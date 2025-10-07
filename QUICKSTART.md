# ⚡ Quick Start Guide

## 🚀 How to Run (Every Time)

### Option 1: NPM Command (Recommended)
```bash
cd new-gatherplay
npm run dev
```

### Option 2: Double-Click Startup Script
- Windows: Double-click `start.bat`
- Mac/Linux: Run `./start.sh`

**Wait for:**
```
✅ VITE v5.4.20  ready at http://localhost:5173
✅ 🚀 Server running on port 3001
```

**Then open:** http://localhost:5173

---

## 🐛 Common Issues

### ❌ "Connection Refused" or "Cannot GET /"

**Problem:** Server not running

**Solution:**
```bash
npm run dev
```

### ❌ "Module Not Found @gatherplay/shared"

**Problem:** Shared package not built

**Solution:**
```bash
cd shared
npm run build
cd ..
npm run dev
```

### ❌ "Port 5173 already in use"

**Problem:** Another process using the port

**Solution (Windows):**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
npm run dev
```

### ❌ Server Stops When I Close Terminal

**This is normal!** Server runs only while terminal is open.

**Solutions:**
- Keep terminal open
- Use VS Code integrated terminal
- Deploy to a hosting service for 24/7 uptime

---

## 📝 First Time Setup

Only need to do this once:

```bash
# 1. Navigate to project
cd new-gatherplay

# 2. Install dependencies
npm install

# 3. Build shared package
cd shared
npm run build
cd ..

# 4. Start servers
npm run dev
```

---

## 🧪 Quick Test

1. **Browser 1 (Chrome):**
   - http://localhost:5173
   - Username: "Host"
   - Create Room → Copy ID

2. **Browser 2 (Firefox):**
   - http://localhost:5173
   - Username: "Player2"
   - Join with Room ID

✅ Both see each other!

---

## 🚀 Deployment (Go Live)

### GitHub Pages ❌ Won't Work
- Only for static sites
- You need backend server

### Recommended (Free)

**Frontend:** Vercel or Netlify  
**Backend:** Railway or Render

See `DEPLOYMENT.md` for detailed steps.

---

## 🔧 Useful Commands

```bash
# Start everything
npm run dev

# Stop servers
Ctrl + C (in terminal)

# Restart servers
npm run dev

# Check if running
# Should see "Server running on port 3001"
```

---

## 💡 Tips

1. **Keep terminal visible** - See server logs and errors
2. **Use VS Code terminal** - Integrated, stays open
3. **Check browser console** - F12 for errors
4. **Test with multiple browsers** - Chrome + Firefox
5. **Bookmark localhost:5173** - Quick access

---

## 📞 Still Having Issues?

Check these files in `/docs` folder:
- `TESTING_GUIDE.md` - Detailed testing
- `SYSTEM_ARCHITECTURE.md` - How it works
- `HOW_TO_PROCEED.md` - Development guide

---

**✅ You're ready! Run `npm run dev` and open http://localhost:5173**
