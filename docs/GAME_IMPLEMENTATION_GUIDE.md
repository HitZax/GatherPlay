# 🎮 Game Implementation Quick Guide

## Where Your Old Games Are

```
GatherPlay/games/
├── insider/
│   ├── insider.js          ← Game logic here
│   └── words.js            ← Word list
├── werewords/
│   ├── werewords.js        ← Game logic here
│   ├── words.js            ← Word list
│   └── settings.js         ← Game settings
├── feed-the-kraken/
│   └── feed-the-kraken.js  ← Game logic here
└── deception-murder-in-hong-kong/
    └── deception-murder-in-hong-kong.js  ← Game logic here
```

## Where to Put New Game Code

### 1. Types (Interfaces) - FIRST
**File:** `shared/src/types.ts`

Already has:
```typescript
export interface InsiderGameState {
  phase: InsiderPhase;
  roles: Record<string, InsiderRole>;
  word: string;
  // ...
}
```

Add your game states here.

### 2. Server Game Logic - SECOND
**Create:** `server/src/games/InsiderGame.ts`

```typescript
import { Room, InsiderGameState } from '@gatherplay/shared';

export class InsiderGame {
  // Start the game
  startGame(room: Room): InsiderGameState {
    // Assign roles, pick word, etc.
    return initialState;
  }
  
  // Handle actions during game
  handleAction(state: InsiderGameState, action: any): InsiderGameState {
    // Process votes, questions, etc.
    return newState;
  }
}
```

### 3. Update Socket Handlers - THIRD
**File:** `server/src/socket.ts`

Add game start logic:
```typescript
socket.on('game:start', () => {
  // ...existing code...
  
  // Add game initialization
  let gameState;
  if (room.gameName === 'insider') {
    const insiderGame = new InsiderGame();
    gameState = insiderGame.startGame(room);
  }
  
  io.to(roomId).emit('game:started', gameState);
});
```

### 4. Create Game Component - FOURTH
**Create:** `client/src/components/games/InsiderGame.tsx`

```typescript
import { InsiderGameState } from '@gatherplay/shared';

interface InsiderGameProps {
  gameState: InsiderGameState;
  userId: string;
  onAction: (action: any) => void;
}

export function InsiderGame({ gameState, userId, onAction }: InsiderGameProps) {
  const myRole = gameState.roles[userId];
  
  return (
    <div className="insider-game">
      <h2>Insider</h2>
      
      {/* Show role */}
      <div className="role-card">
        You are: {myRole}
      </div>
      
      {/* Show word (only for Master and Insider) */}
      {(myRole === 'Master' || myRole === 'Insider') && (
        <div className="word">
          Secret Word: {gameState.word}
        </div>
      )}
      
      {/* Timer */}
      <div className="timer">
        Time: {gameState.timerMinutes} minutes
      </div>
      
      {/* Game phase UI */}
      {gameState.phase === InsiderPhase.QUESTIONING && (
        <QuestioningPhase onAction={onAction} />
      )}
      
      {gameState.phase === InsiderPhase.VOTING && (
        <VotingPhase players={gameState.players} onAction={onAction} />
      )}
    </div>
  );
}
```

### 5. Add to Room Page - FIFTH
**File:** `client/src/pages/Room.tsx`

```typescript
import { InsiderGame } from '../components/games/InsiderGame';

// Inside the component:
{room.state === RoomState.IN_PROGRESS && (
  <>
    {room.gameName === 'insider' && (
      <InsiderGame 
        gameState={gameState} 
        userId={user.id}
        onAction={handleGameAction}
      />
    )}
  </>
)}
```

---

## 🔄 Development Flow

### When Implementing a Game

1. **Read old game code**
   - Open `GatherPlay/games/insider/insider.js`
   - Understand the game flow
   - Note all the phases/states

2. **Define types**
   - Edit `shared/src/types.ts`
   - Add game state interface
   - Add enums for phases/roles

3. **Build shared**
   ```bash
   cd shared
   npm run build
   ```

4. **Create server logic**
   - Create `server/src/games/InsiderGame.ts`
   - Implement startGame()
   - Implement game logic

5. **Update socket handlers**
   - Edit `server/src/socket.ts`
   - Add game start logic
   - Add game action handlers

6. **Create React component**
   - Create `client/src/components/games/InsiderGame.tsx`
   - Build the UI
   - Handle user interactions

7. **Wire it up**
   - Edit `client/src/pages/Room.tsx`
   - Import and render game component

8. **Test**
   - Open 2+ browsers
   - Create room
   - Start game
   - Play through

9. **Fix bugs and iterate**

---

## 📝 Example: Porting Insider Game

### Old Code (insider.js)
```javascript
window.currentGame = {
    name: "Insider",
    
    startGame: function() {
        // Assign roles
        const players = /* get players */;
        const master = /* pick random */;
        const insider = /* pick random */;
        
        // Pick word
        const word = /* random word */;
        
        // Set state in Firebase
        db.ref('rooms/'+roomId+'/gameState').set({
            phase: 1,
            roles: { /*...*/ },
            word: word
        });
    }
}
```

### New Code (InsiderGame.ts)
```typescript
export class InsiderGame {
  startGame(room: Room): InsiderGameState {
    // Assign roles
    const playerIds = room.players.map(p => p.userId);
    const masterId = this.pickRandom(playerIds);
    const insiderId = this.pickRandom(playerIds.filter(id => id !== masterId));
    
    const roles: Record<string, InsiderRole> = {};
    playerIds.forEach(id => {
      if (id === masterId) roles[id] = 'Master';
      else if (id === insiderId) roles[id] = 'Insider';
      else roles[id] = 'Common';
    });
    
    // Pick word
    const word = this.pickWord(room.settings.wordDifficulty);
    
    // Return state (no database, return object)
    return {
      phase: InsiderPhase.QUESTIONING,
      roles,
      word,
      masterId,
      insiderId,
      timerStart: Date.now(),
      timerMinutes: room.settings.timerMinutes || 3,
    };
  }
  
  private pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  private pickWord(difficulty: string): string {
    // Import word list, pick random
    return "example";
  }
}
```

---

## 🎯 Migration Checklist for Each Game

### For Each Game You Port:

- [ ] Copy word lists / game data to new project
- [ ] Define TypeScript interfaces in `shared/src/types.ts`
- [ ] Build shared package (`cd shared && npm run build`)
- [ ] Create server game class in `server/src/games/`
- [ ] Update `server/src/socket.ts` to handle game events
- [ ] Create React component in `client/src/components/games/`
- [ ] Import and use in `client/src/pages/Room.tsx`
- [ ] Test with multiple browsers
- [ ] Fix bugs
- [ ] Commit to git

---

## 💡 Key Differences to Remember

| Old (Firebase) | New (Socket.IO) |
|----------------|-----------------|
| `db.ref('path').set(data)` | `return gameState` (in server), `io.emit('game:updated', state)` (to send) |
| `db.ref('path').on('value', callback)` | `socket.on('game:updated', callback)` (in client) |
| `window.currentGame = { ... }` | `export class InsiderGame { ... }` |
| DOM manipulation | React components & state |
| `document.getElementById()` | `useState()` and props |
| Global variables | TypeScript types & interfaces |

---

## 🚀 Quick Start: Implement Insider in 1 Hour

1. **Types** (5 min)
   - Already done in `shared/src/types.ts`!

2. **Server** (20 min)
   - Create `server/src/games/InsiderGame.ts`
   - Copy role assignment logic from old code
   - Import words.js

3. **Socket** (10 min)
   - Edit `server/src/socket.ts`
   - Add insider game initialization

4. **Component** (20 min)
   - Create `client/src/components/games/InsiderGame.tsx`
   - Show role card
   - Show word (conditionally)
   - Add timer display

5. **Wire up** (5 min)
   - Edit `client/src/pages/Room.tsx`
   - Render InsiderGame component

**You're done! Test it!**

---

## 📞 Need Help?

Check these files for reference:
- Types example: `shared/src/types.ts` (already has Insider & Werewords)
- Manager example: `server/src/managers/RoomManager.ts`
- Component example: `client/src/pages/Home.tsx`
- Socket example: `server/src/socket.ts`

---

**Pro tip:** Start with just displaying roles and the word. Get that working first, then add timer, then voting, etc. Build incrementally!
