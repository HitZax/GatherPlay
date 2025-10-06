import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { ServerToClientEvents, ClientToServerEvents } from '@gatherplay/shared';
import { setupSocketHandlers } from './socket';
import { RoomManager } from './managers/RoomManager';
import { UserManager } from './managers/UserManager';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize managers
const roomManager = new RoomManager();
const userManager = new UserManager();

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    rooms: roomManager.getRoomCount(),
    users: userManager.getUserCount(),
    uptime: process.uptime(),
  });
});

// API routes
app.get('/api/rooms', (_req, res) => {
  const rooms = roomManager.getAllRooms().map((room) => ({
    id: room.id,
    gameName: room.gameName,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    state: room.state,
  }));
  res.json({ success: true, data: rooms });
});

// Socket.IO connection handling
setupSocketHandlers(io, roomManager, userManager);

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
