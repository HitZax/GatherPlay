import { Server, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Player,
  RoomState,
} from '@gatherplay/shared';
import { RoomManager } from './managers/RoomManager';
import { UserManager } from './managers/UserManager';

export function setupSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  roomManager: RoomManager,
  userManager: UserManager
) {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Room creation
    socket.on('room:create', ({ gameName, username }, callback) => {
      try {
        const userId = socket.id; // Temporary - in production use proper auth
        
        // Create or update user
        let user = userManager.getUser(userId);
        if (!user) {
          user = userManager.createUser(userId, username, socket.id);
        } else {
          userManager.updateUser(userId, { username });
          userManager.updateSocketId(userId, socket.id);
        }

        // Create room
        const room = roomManager.createRoom(userId, gameName, username);
        userManager.setUserRoom(userId, room.id);

        // Join socket room
        socket.join(room.id);

        console.log(`🎮 Room created: ${room.id} for game: ${gameName}`);
        
        callback({ success: true, roomId: room.id });
        socket.emit('room:created', room);
      } catch (error) {
        console.error('Error creating room:', error);
        callback({ success: false, error: 'Failed to create room' });
      }
    });

    // Join room
    socket.on('room:join', ({ roomId, username }, callback) => {
      try {
        const room = roomManager.getRoom(roomId);
        if (!room) {
          callback({ success: false, error: 'Room not found' });
          return;
        }

        if (room.state !== RoomState.LOBBY) {
          callback({ success: false, error: 'Game already in progress' });
          return;
        }

        const userId = socket.id;
        
        // Create or update user
        let user = userManager.getUser(userId);
        if (!user) {
          user = userManager.createUser(userId, username, socket.id);
        } else {
          userManager.updateUser(userId, { username });
          userManager.updateSocketId(userId, socket.id);
        }

        // Add player to room
        const player: Player = {
          userId,
          username,
          isReady: false,
          isHost: false,
        };

        const added = roomManager.addPlayer(roomId, player);
        if (!added) {
          callback({ success: false, error: 'Room is full' });
          return;
        }

        userManager.setUserRoom(userId, roomId);
        socket.join(roomId);

        console.log(`👤 ${username} joined room: ${roomId}`);

        callback({ success: true });
        socket.emit('room:joined', room);
        io.to(roomId).emit('room:updated', room);
        socket.to(roomId).emit('player:joined', player);
      } catch (error) {
        console.error('Error joining room:', error);
        callback({ success: false, error: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('room:leave', () => {
      try {
        const user = userManager.getUserBySocketId(socket.id);
        if (!user || !user.currentRoomId) return;

        const roomId = user.currentRoomId;
        const room = roomManager.getRoom(roomId);
        
        roomManager.removePlayer(roomId, user.id);
        userManager.setUserRoom(user.id, undefined);
        socket.leave(roomId);

        console.log(`👋 ${user.username} left room: ${roomId}`);

        if (room && roomManager.getRoom(roomId)) {
          io.to(roomId).emit('room:updated', roomManager.getRoom(roomId)!);
          io.to(roomId).emit('player:left', user.id);
        } else {
          // Room was deleted
          io.to(roomId).emit('room:deleted');
        }

        socket.emit('room:left');
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    // Update room settings
    socket.on('room:updateSettings', (settings) => {
      try {
        const user = userManager.getUserBySocketId(socket.id);
        if (!user || !user.currentRoomId) return;

        const room = roomManager.getRoom(user.currentRoomId);
        if (!room || room.hostId !== user.id) {
          socket.emit('error', 'Only host can update settings');
          return;
        }

        roomManager.updateSettings(user.currentRoomId, settings);
        const updatedRoom = roomManager.getRoom(user.currentRoomId)!;
        io.to(user.currentRoomId).emit('room:updated', updatedRoom);
      } catch (error) {
        console.error('Error updating settings:', error);
      }
    });

    // Start game
    socket.on('game:start', () => {
      try {
        const user = userManager.getUserBySocketId(socket.id);
        if (!user || !user.currentRoomId) return;

        const room = roomManager.getRoom(user.currentRoomId);
        if (!room || room.hostId !== user.id) {
          socket.emit('error', 'Only host can start the game');
          return;
        }

        roomManager.updateRoomState(user.currentRoomId, RoomState.IN_PROGRESS);
        const updatedRoom = roomManager.getRoom(user.currentRoomId)!;
        
        console.log(`🎯 Game started in room: ${user.currentRoomId}`);
        
        // Emit game started with initial game state
        io.to(user.currentRoomId).emit('game:started', { room: updatedRoom });
        io.to(user.currentRoomId).emit('room:updated', updatedRoom);
      } catch (error) {
        console.error('Error starting game:', error);
      }
    });

    // Game actions
    socket.on('game:action', (action) => {
      try {
        const user = userManager.getUserBySocketId(socket.id);
        if (!user || !user.currentRoomId) return;

        // Broadcast game action to all players in the room
        io.to(user.currentRoomId).emit('game:updated', action);
      } catch (error) {
        console.error('Error handling game action:', error);
      }
    });

    // Update username
    socket.on('user:updateUsername', (username) => {
      try {
        const user = userManager.getUserBySocketId(socket.id);
        if (!user) return;

        userManager.updateUser(user.id, { username });
        
        if (user.currentRoomId) {
          const room = roomManager.getRoom(user.currentRoomId);
          if (room) {
            const player = room.players.find((p) => p.userId === user.id);
            if (player) {
              player.username = username;
              io.to(user.currentRoomId).emit('room:updated', room);
            }
          }
        }
      } catch (error) {
        console.error('Error updating username:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      try {
        const user = userManager.getUserBySocketId(socket.id);
        if (!user) {
          console.log(`❌ Client disconnected: ${socket.id}`);
          return;
        }

        console.log(`❌ ${user.username} disconnected`);

        if (user.currentRoomId) {
          const roomId = user.currentRoomId;
          roomManager.removePlayer(roomId, user.id);
          
          const room = roomManager.getRoom(roomId);
          if (room) {
            io.to(roomId).emit('room:updated', room);
            io.to(roomId).emit('player:left', user.id);
          } else {
            io.to(roomId).emit('room:deleted');
          }
        }

        // Keep user data for potential reconnection
        // In production, implement proper session management
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
}
