# 🚀 Quick Start Guide

## Get Up and Running in 2 Minutes!

### Step 1: Install Dependencies (already done!)
```bash
✅ Dependencies already installed with `npm install`
```

### Step 2: Start Development Servers
```bash
npm run dev
```

This starts both:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Step 3: Test It Out!

1. **Open your browser**: http://localhost:5173

2. **Create a username**:
   - Enter any name (2-20 characters)
   - Click "Continue"

3. **Create a room**:
   - Click "Create New Room"
   - Select a game (any will work)
   - Click "Create Room"

4. **Test multiplayer** (optional):
   - Open another browser window (incognito mode)
   - Go to http://localhost:5173
   - Create a different username
   - Enter the room code from the first window
   - Click "Join Room"

### Step 4: Develop Your Games!

The platform is ready. Now implement the game logic:

1. **Game Components**: `client/src/components/games/`
2. **Game Logic**: `server/src/games/`
3. **Shared Types**: `shared/src/types.ts`

## 🎮 What's Working

✅ Real-time room creation
✅ Room joining with codes
✅ Player management
✅ Real-time updates via Socket.IO
✅ Responsive UI
✅ Connection status
✅ Room deletion
✅ Host controls

## 🔨 What Needs Implementation

The platform framework is complete, but you need to implement:

- [ ] Game-specific UI components
- [ ] Game rules and logic
- [ ] Game state management for each game
- [ ] Timer systems for games
- [ ] Role assignment logic
- [ ] Voting systems
- [ ] Win condition checking

## 📖 Quick Commands

```bash
# Development
npm run dev              # Start everything
npm run dev:client       # Frontend only
npm run dev:server       # Backend only

# Production
npm run build            # Build all packages
npm start                # Start production server

# Code Quality
npm run lint             # Check code
npm run format           # Format code
```

## 🆘 Having Issues?

### Port 3001 already in use?
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change in server/.env
PORT=3002
```

### Can't connect to server?
1. Check `server/.env` has `PORT=3001`
2. Check `client/.env` has `VITE_SERVER_URL=http://localhost:3001`
3. Restart both servers

### TypeScript errors?
```bash
npm run build --workspace=shared
```

## 📚 Documentation

- **README.md** - Full documentation
- **PROJECT_SUMMARY.md** - What was built
- **DEPLOYMENT.md** - How to deploy
- **CONTRIBUTING.md** - How to contribute

## 🎯 Next Steps

1. **Start with one game** (e.g., Insider)
2. **Create game component** in `client/src/components/games/Insider.tsx`
3. **Add game logic** to server
4. **Test with friends**
5. **Iterate and improve**

## 💡 Pro Tips

- Use VS Code tasks: `Ctrl+Shift+P` → "Tasks: Run Task"
- Install recommended extensions (see `.vscode/extensions.json`)
- Check browser console for Socket.IO connection status
- Use React DevTools for debugging
- Monitor server logs for errors

---

**You're all set! Start building! 🎮**
