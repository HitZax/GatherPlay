import { User } from '@gatherplay/shared';

export class UserManager {
  private users: Map<string, User> = new Map();
  private socketToUser: Map<string, string> = new Map();

  createUser(userId: string, username: string, socketId: string): User {
    const user: User = {
      id: userId,
      username,
      socketId,
      createdAt: Date.now(),
      lastActive: Date.now(),
    };
    
    this.users.set(userId, user);
    this.socketToUser.set(socketId, userId);
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUserBySocketId(socketId: string): User | undefined {
    const userId = this.socketToUser.get(socketId);
    return userId ? this.users.get(userId) : undefined;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserCount(): number {
    return this.users.size;
  }

  updateUser(userId: string, updates: Partial<User>): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    
    Object.assign(user, updates, { lastActive: Date.now() });
    return true;
  }

  updateSocketId(userId: string, socketId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    
    // Remove old socket mapping
    if (user.socketId) {
      this.socketToUser.delete(user.socketId);
    }
    
    // Add new socket mapping
    user.socketId = socketId;
    user.lastActive = Date.now();
    this.socketToUser.set(socketId, userId);
    return true;
  }

  deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    
    if (user.socketId) {
      this.socketToUser.delete(user.socketId);
    }
    
    return this.users.delete(userId);
  }

  deleteUserBySocketId(socketId: string): boolean {
    const userId = this.socketToUser.get(socketId);
    if (!userId) return false;
    
    this.socketToUser.delete(socketId);
    return this.users.delete(userId);
  }

  setUserRoom(userId: string, roomId: string | undefined): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    
    user.currentRoomId = roomId;
    user.lastActive = Date.now();
    return true;
  }
}
