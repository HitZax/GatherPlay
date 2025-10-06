import { ROOM_ID_LENGTH } from './constants';

/**
 * Generate a random room ID
 */
export function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  return username.trim().length >= 2 && username.trim().length <= 20;
}

/**
 * Validate room ID format
 */
export function isValidRoomId(roomId: string): boolean {
  return /^[A-Z0-9]{6}$/.test(roomId);
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random element from array
 */
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
