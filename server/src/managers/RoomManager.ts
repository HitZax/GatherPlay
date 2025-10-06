import { Room, Player, GameType, RoomState, GameSettings } from '@gatherplay/shared';
import { generateRoomId } from '@gatherplay/shared';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  createRoom(hostId: string, gameName: GameType, hostUsername: string): Room {
    const roomId = this.generateUniqueRoomId();
    
    const hostPlayer: Player = {
      userId: hostId,
      username: hostUsername,
      isReady: true,
      isHost: true,
    };

    const room: Room = {
      id: roomId,
      hostId,
      gameName,
      players: [hostPlayer],
      settings: this.getDefaultSettings(gameName),
      state: RoomState.LOBBY,
      createdAt: Date.now(),
      maxPlayers: this.getMaxPlayers(gameName),
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  deleteRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }

  addPlayer(roomId: string, player: Player): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    // Check if player already exists
    const existingPlayerIndex = room.players.findIndex((p) => p.userId === player.userId);
    if (existingPlayerIndex >= 0) {
      // Update existing player
      room.players[existingPlayerIndex] = player;
    } else {
      // Add new player
      if (room.players.length >= room.maxPlayers) return false;
      room.players.push(player);
    }
    
    return true;
  }

  removePlayer(roomId: string, userId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const initialLength = room.players.length;
    room.players = room.players.filter((p) => p.userId !== userId);

    // If host left, assign new host or delete room
    if (userId === room.hostId) {
      if (room.players.length > 0) {
        room.hostId = room.players[0].userId;
        room.players[0].isHost = true;
      } else {
        this.deleteRoom(roomId);
        return true;
      }
    }

    return room.players.length !== initialLength;
  }

  updateSettings(roomId: string, settings: GameSettings): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    room.settings = { ...room.settings, ...settings };
    return true;
  }

  updateRoomState(roomId: string, state: RoomState): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    room.state = state;
    return true;
  }

  private generateUniqueRoomId(): string {
    let roomId: string;
    do {
      roomId = generateRoomId();
    } while (this.rooms.has(roomId));
    return roomId;
  }

  private getDefaultSettings(gameName: GameType): GameSettings {
    // Return default settings based on game type
    switch (gameName) {
      case 'insider':
        return {
          timerMinutes: 3,
          wordDifficulty: 'easy',
        };
      case 'werewords':
        return {
          yesNoTokens: 36,
          maybeTokens: 12,
          timerSeconds: 240,
          difficulty: 'easy',
          deluxeRolesEnabled: false,
        };
      case 'feed-the-kraken':
        return {
          journeyType: 'short',
          cultistConversion: true,
          openCaptainLog: false,
        };
      case 'deception-murder-hong-kong':
        return {
          cardsPerPlayer: 4,
          accompliceEnabled: true,
          witnessEnabled: true,
          roundTimerMinutes: 5,
          finalGuessTimerMinutes: 2,
        };
      default:
        return {};
    }
  }

  private getMaxPlayers(gameName: GameType): number {
    const configs: Record<GameType, number> = {
      'insider': 12,
      'werewords': 10,
      'feed-the-kraken': 11,
      'deception-murder-hong-kong': 12,
    };
    return configs[gameName] || 10;
  }
}
