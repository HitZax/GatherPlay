import { WordDifficulty } from './insiderWords';

export interface InsiderGameSettings {
  timerMinutes: number;
  wordDifficulty: WordDifficulty;
}

export enum InsiderRole {
  MASTER = 'Master',
  INSIDER = 'Insider',
  COMMON = 'Common',
}

export enum InsiderPhase {
  ROLE_REVEAL = 'role_reveal',
  QUESTIONING = 'questioning',
  VOTING = 'voting',
  GAME_OVER = 'game_over',
}

export interface InsiderGameState {
  phase: InsiderPhase;
  roles: Record<string, InsiderRole>; // userId -> role
  secretWord: string;
  masterId: string;
  insiderId: string;
  timerStart: number;
  timerDuration: number; // in seconds
  accusedPlayerId?: string;
  wordGuessed: boolean;
  wordDifficulty: WordDifficulty;
  result?: string;
}
