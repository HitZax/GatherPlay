export const GAME_CONFIGS = {
  insider: {
    name: 'Insider',
    minPlayers: 4,
    maxPlayers: 12,
    description: 'A word-guessing game where one player is secretly helping',
  },
  werewords: {
    name: 'Werewords',
    minPlayers: 4,
    maxPlayers: 10,
    description: 'Guess the magic word before time runs out, but beware of werewolves',
  },
  'feed-the-kraken': {
    name: 'Feed the Kraken',
    minPlayers: 5,
    maxPlayers: 11,
    description: 'Navigate the seas while pirates and cultists battle for control',
  },
  'deception-murder-hong-kong': {
    name: 'Deception: Murder in Hong Kong',
    minPlayers: 4,
    maxPlayers: 12,
    description: 'Solve the murder using cryptic clues from the forensic scientist',
  },
} as const;

export const ROOM_ID_LENGTH = 6;
export const MAX_ROOMS_PER_USER = 1;
export const ROOM_CLEANUP_DELAY = 60000; // 1 minute
export const PING_INTERVAL = 30000; // 30 seconds
export const CONNECTION_TIMEOUT = 60000; // 1 minute
