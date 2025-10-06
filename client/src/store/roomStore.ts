import { create } from 'zustand';
import type { Room } from '@shared/types';

interface RoomState {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  updateRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  updateRoom: (room) => set({ currentRoom: room }),
}));
