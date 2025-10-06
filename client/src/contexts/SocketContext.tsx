import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@shared/types';
import { useUserStore } from '../store/userStore';
import { useRoomStore } from '../store/roomStore';

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: SocketType | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [connected, setConnected] = useState(false);
  const { setCurrentRoom } = useRoomStore();

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Room event listeners
    socketInstance.on('room:created', (room) => {
      console.log('Room created:', room);
      setCurrentRoom(room);
    });

    socketInstance.on('room:joined', (room) => {
      console.log('Room joined:', room);
      setCurrentRoom(room);
    });

    socketInstance.on('room:updated', (room) => {
      console.log('Room updated:', room);
      setCurrentRoom(room);
    });

    socketInstance.on('room:left', () => {
      console.log('Left room');
      setCurrentRoom(null);
    });

    socketInstance.on('room:deleted', () => {
      console.log('Room deleted');
      setCurrentRoom(null);
    });

    socketInstance.on('error', (message) => {
      console.error('Socket error:', message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [setCurrentRoom]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}
