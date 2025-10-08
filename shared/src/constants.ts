export const GAME_CONFIGS = {
  insider: {
    name: 'Insider',
    minPlayers: 4,
    maxPlayers: 12,
    description: 'A word-guessing game where one player is secretly helping',
    implemented: true,
  },
  werewords: {
    name: 'Werewords',
    minPlayers: 4,
    maxPlayers: 10,
    description: 'Guess the magic word before time runs out, but beware of werewolves',
    implemented: true,
  },
  'feed-the-kraken': {
    name: 'Feed the Kraken',
    minPlayers: 5,
    maxPlayers: 11,
    description: 'Navigate the seas while pirates and cultists battle for control',
    implemented: false,
  },
  'deception-murder-hong-kong': {
    name: 'Deception: Murder in Hong Kong',
    minPlayers: 4,
    maxPlayers: 12,
    description: 'Solve the murder using cryptic clues from the forensic scientist',
    implemented: false,
  },
  'town-of-salem': {
    name: 'Town of Salem',
    minPlayers: 7,
    maxPlayers: 15,
    description: 'Day and night cycles of deduction - find the mafia before they eliminate the town',
    implemented: false,
  },
  'dead-of-winter': {
    name: 'Dead of Winter',
    minPlayers: 4,
    maxPlayers: 5,
    description: 'Survive the zombie apocalypse while pursuing secret objectives. Who is the betrayer?',
    implemented: false,
  },
  'mascarade': {
    name: 'Mascarade',
    minPlayers: 4,
    maxPlayers: 13,
    description: 'Swap masks and bluff about your identity in this chaotic deduction game',
    implemented: false,
  },
  'letters-from-whitechapel': {
    name: 'Letters from Whitechapel',
    minPlayers: 2,
    maxPlayers: 6,
    description: 'Hidden movement game - Detectives hunt Jack the Ripper through Victorian London',
    implemented: false,
  },
  'fury-of-dracula': {
    name: 'Fury of Dracula',
    minPlayers: 2,
    maxPlayers: 5,
    description: 'Hidden movement classic - Hunters track Dracula across Europe in this gothic thriller',
    implemented: false,
  },
  'specter-ops': {
    name: 'Specter Ops',
    minPlayers: 2,
    maxPlayers: 5,
    description: 'Hidden movement stealth game - One agent infiltrates while hunters search',
    implemented: false,
  },
  'not-alone': {
    name: 'Not Alone',
    minPlayers: 2,
    maxPlayers: 7,
    description: 'Asymmetric hidden movement - Stranded explorers evade a mysterious creature',
    implemented: false,
  },
  'scotland-yard': {
    name: 'Scotland Yard',
    minPlayers: 3,
    maxPlayers: 6,
    description: 'Classic hidden movement - Detectives chase Mister X through London',
    implemented: false,
  },
} as const;

export const ROOM_ID_LENGTH = 6;
export const MAX_ROOMS_PER_USER = 1;
export const ROOM_CLEANUP_DELAY = 60000; // 1 minute
export const PING_INTERVAL = 30000; // 30 seconds
export const CONNECTION_TIMEOUT = 60000; // 1 minute
