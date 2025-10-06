// User types
export interface User {
  id: string;
  username: string;
  socketId?: string;
  currentRoomId?: string;
  createdAt: number;
  lastActive: number;
}

// Room types
export interface Room {
  id: string;
  hostId: string;
  gameName: GameType;
  players: Player[];
  settings: GameSettings;
  state: RoomState;
  createdAt: number;
  maxPlayers: number;
}

export interface Player {
  userId: string;
  username: string;
  isReady: boolean;
  isHost: boolean;
}

export enum RoomState {
  LOBBY = 'lobby',
  STARTING = 'starting',
  IN_PROGRESS = 'in_progress',
  ENDED = 'ended',
}

// Game types
export type GameType = 'insider' | 'werewords' | 'feed-the-kraken' | 'deception-murder-hong-kong';

export interface GameSettings {
  [key: string]: unknown;
}

// Insider game types
export interface InsiderGameState {
  phase: InsiderPhase;
  roles: Record<string, InsiderRole>;
  word: string;
  masterId: string;
  insiderId: string;
  timerStart?: number;
  timerMinutes: number;
  accusedPlayer?: string;
  result?: string;
}

export enum InsiderPhase {
  QUESTIONING = 1,
  VOTING = 2,
  GAME_OVER = 3,
}

export type InsiderRole = 'Master' | 'Insider' | 'Common';

export interface InsiderSettings extends GameSettings {
  timerMinutes: number;
  wordDifficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

// Werewords game types
export interface WerewordsGameState {
  phase: WerewordsPhase;
  roles: Record<string, WerewordsRole>;
  secretWord: string;
  mayorId: string;
  wordChoices?: string[];
  guessingState?: {
    yesNoTokens: number;
    maybeTokens: number;
    playerTokens: Record<string, { yes: number; no: number; maybe: number }>;
  };
  guessingStart?: number;
  werewolfVotes?: Record<string, string>;
  seerVotes?: Record<string, string>;
  phaseStart?: number;
  phaseDuration?: number;
}

export enum WerewordsPhase {
  MAYOR_CHOOSE = 'mayor-choose',
  GUESSING = 'guessing',
  FIND_WEREWOLF = 'find-werewolf',
  FIND_SEER = 'find-seer',
  GAME_OVER = 'game-over',
}

export type WerewordsRole = 'Mayor' | 'Seer' | 'Werewolf' | 'Villager';

export interface WerewordsSettings extends GameSettings {
  yesNoTokens: number;
  maybeTokens: number;
  timerSeconds: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  deluxeRolesEnabled: boolean;
}

// Socket event types
export interface ServerToClientEvents {
  // Room events
  'room:created': (room: Room) => void;
  'room:joined': (room: Room) => void;
  'room:left': () => void;
  'room:updated': (room: Room) => void;
  'room:deleted': () => void;
  'room:error': (error: string) => void;

  // Game events
  'game:started': (gameState: unknown) => void;
  'game:updated': (gameState: unknown) => void;
  'game:ended': (result: unknown) => void;

  // Player events
  'player:joined': (player: Player) => void;
  'player:left': (userId: string) => void;
  
  // Error events
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  // Room actions
  'room:create': (data: { gameName: GameType; username: string }, callback: (response: { success: boolean; roomId?: string; error?: string }) => void) => void;
  'room:join': (data: { roomId: string; username: string }, callback: (response: { success: boolean; error?: string }) => void) => void;
  'room:leave': () => void;
  'room:updateSettings': (settings: GameSettings) => void;

  // Game actions
  'game:start': () => void;
  'game:action': (action: GameAction) => void;

  // User actions
  'user:updateUsername': (username: string) => void;
}

export interface GameAction {
  type: string;
  payload: unknown;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
