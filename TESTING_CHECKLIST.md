# Testing Checklist for GatherPlay v2.0

## ✅ Pre-Deployment Testing

### 1. Basic Functionality Tests

#### User Management
- [ ] Enter username and continue
- [ ] Username displays in header ("Welcome, [Name]")
- [ ] Connection status shows "Connected" (green dot)

#### Room Creation
- [ ] Click "Create New Room" button
- [ ] Should navigate to game selection page (`/lobby`)
- [ ] Select a game (e.g., Insider)
- [ ] Room is created with 6-character ID
- [ ] You appear as host in player list

#### Room Joining
- [ ] Open second browser/incognito window
- [ ] Enter different username
- [ ] Enter the room ID from first window
- [ ] Click "Join Room"
- [ ] Should see both players in the room
- [ ] First window should update with new player

#### Real-time Sync
- [ ] Player joins → both see update
- [ ] Player leaves → both see update
- [ ] Host leaves → room is deleted OR new host assigned

#### Navigation
- [ ] Home page (`/`) works
- [ ] Game lobby (`/lobby`) works
- [ ] Room page (`/room/:id`) works
- [ ] Back/forward browser buttons work

### 2. Multi-Window Testing

**Setup:** Open 2-3 browser windows/tabs

1. **Window 1 (Host):**
   - Create room
   - Note room ID
   - Stay on room page

2. **Window 2 (Player):**
   - Join with room ID
   - Verify you see host

3. **Window 3 (Player):**
   - Join same room
   - Verify all 3 players visible

4. **Test Disconnection:**
   - Close Window 2
   - Windows 1 & 3 should update

### 3. Error Handling

- [ ] Try joining non-existent room → error message
- [ ] Try joining without username → error message
- [ ] Try joining with invalid room ID → error message
- [ ] Refresh page while in room → what happens?

### 4. UI/UX Tests

- [ ] All buttons are clickable
- [ ] Forms submit on Enter key
- [ ] Mobile responsive (resize browser)
- [ ] No console errors in DevTools
- [ ] Loading states appear properly

---

## 🎮 Game-Specific Testing (When Implemented)

### Insider
- [ ] Game starts
- [ ] Roles assigned
- [ ] Timer works
- [ ] Voting works
- [ ] Game ends properly

### Werewords
- [ ] Not yet implemented

### Feed the Kraken
- [ ] Not yet implemented

### Deception
- [ ] Not yet implemented

---

## 🐛 Known Issues / TODO

- [ ] Game logic not yet implemented
- [ ] No game settings UI
- [ ] No game rules display
- [ ] Session persistence on refresh
- [ ] Reconnection handling
- [ ] Username editing after set

---

## 📝 Test Results

### Date: ___________
### Tester: ___________

| Test | Pass/Fail | Notes |
|------|-----------|-------|
| Username entry | ⬜ | |
| Create room | ⬜ | |
| Join room | ⬜ | |
| Multiple players | ⬜ | |
| Real-time updates | ⬜ | |
| Leave room | ⬜ | |
| Navigation | ⬜ | |

---

## 🚀 Quick Test Script

1. Open http://localhost:5173
2. Enter username "Player1" → Continue
3. Click "Create New Room"
4. Select any game
5. Copy the room ID
6. Open incognito window → http://localhost:5173
7. Enter username "Player2" → Continue
8. Paste room ID → Join Room
9. Check both windows show 2 players
10. Close incognito window
11. Check first window shows only 1 player

**Expected:** All steps work without errors
**Actual:** _________________________
