# 🎮 GatherPlay v2.0# 🎮 GatherPlay



Modern real-time multiplayer platform for social deduction games.**GatherPlay** is a modern, real-time multiplayer platform for social deduction games. Play popular party games like Insider, Werewords, Feed the Kraken, and Deception: Murder in Hong Kong with friends online.



---![Version](https://img.shields.io/badge/version-2.0.0-blue)

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## 🚀 Quick Start (3 Steps)![License](https://img.shields.io/badge/license-MIT-blue)



### 1. Install## ✨ Features

```bash

npm install- 🎲 **Multiple Games**: Choose from 4 popular social deduction games

```- 🔄 **Real-time Multiplayer**: Powered by Socket.IO for seamless gameplay

- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS

### 2. Start Servers- 📱 **Mobile Friendly**: Play on any device

```bash- 🚀 **Scalable Architecture**: Built to handle thousands of concurrent players

npm run dev- 🔒 **Type-Safe**: Full TypeScript support across the stack

```

## 🎯 Available Games

### 3. Open Browser

**http://localhost:5173**| Game | Players | Description |

|------|---------|-------------|

✅ **Done! Both servers running.**| **Insider** | 4-12 | Word-guessing game where one player secretly helps |

| **Werewords** | 4-10 | Guess the magic word before werewolves sabotage you |

---| **Feed the Kraken** | 5-11 | Navigate the seas while pirates and cultists battle |

| **Deception: Murder in Hong Kong** | 4-12 | Solve the murder using cryptic clues |

## 🧪 Test with 2 Browsers

## 🏗️ Tech Stack

1. **Chrome** → http://localhost:5173

   - Username: "Host"### Frontend

   - Create Room → Copy ID- **React 18** - Modern React with hooks

- **TypeScript** - Type-safe development

2. **Firefox** → http://localhost:5173  - **Vite** - Lightning-fast build tool

   - Username: "Player2"- **TailwindCSS** - Utility-first CSS framework

   - Join with Room ID- **Socket.IO Client** - Real-time communication

- **Zustand** - Lightweight state management

✅ **Both see each other in real-time!**- **React Router** - Client-side routing



---### Backend

- **Node.js** - JavaScript runtime

## 📖 Documentation- **Express** - Web server framework

- **Socket.IO** - WebSocket server

### Must-Read (In Root Folder)- **TypeScript** - Type-safe server code



| File | Purpose |### Shared

|------|---------|- Shared TypeScript types and utilities

| `README.md` | ← You are here |- Consistent validation across client and server

| `QUICKSTART.md` | Setup & troubleshooting |

| `DEPLOYMENT.md` | How to publish online |## 📁 Project Structure



### Detailed Guides (In `/docs` Folder)```

GatherPlay/

- **Quick Start** - 2-minute walkthrough├── client/                 # React frontend

- **Testing Guide** - Multi-browser testing│   ├── src/

- **System Architecture** - How it works│   │   ├── components/    # Reusable UI components

- **Game Implementation** - Port old games│   │   ├── contexts/      # React contexts (Socket, etc.)

- **Development Roadmap** - What's next│   │   ├── pages/         # Route pages

│   │   ├── store/         # Zustand stores

---│   │   ├── App.tsx        # Main app component

│   │   └── main.tsx       # Entry point

## 🎮 Available Games│   ├── index.html

│   ├── package.json

| Game | Players | Status |│   └── vite.config.ts

|------|---------|--------|│

| 🕵️ Insider | 4-12 | Framework ready, needs implementation |├── server/                # Node.js backend

| 🐺 Werewords | 4-10 | Framework ready, needs implementation |│   ├── src/

| 🦑 Feed the Kraken | 5-11 | Framework ready, needs implementation |│   │   ├── managers/      # Room and user management

| 🔍 Deception | 4-12 | Framework ready, needs implementation |│   │   ├── index.ts       # Server entry point

│   │   └── socket.ts      # Socket.IO handlers

---│   ├── package.json

│   └── tsconfig.json

## 🛠️ Tech Stack│

├── shared/                # Shared types and utilities

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS│   ├── src/

- **Backend:** Node.js, Express, Socket.IO│   │   ├── types.ts       # TypeScript interfaces

- **Real-time:** WebSocket (works on all browsers)│   │   ├── constants.ts   # Shared constants

│   │   └── utils.ts       # Helper functions

---│   ├── package.json

│   └── tsconfig.json

## 📁 Project Structure│

└── package.json           # Root workspace config

``````

new-gatherplay/

├── client/           # React frontend (localhost:5173)## 🚀 Getting Started

├── server/           # Node.js backend (port 3001)

├── shared/           # Shared TypeScript types### Prerequisites

├── docs/             # Detailed documentation

├── README.md         # ← Start here- **Node.js** >= 18.0.0

└── QUICKSTART.md     # Troubleshooting- **npm** >= 9.0.0

```

### Installation

---

1. **Clone the repository**

## 🐛 Troubleshooting   ```bash

   git clone https://github.com/yourusername/GatherPlay.git

### ❌ "Connection Refused" Error   cd GatherPlay

   ```

**Server not running.** Start it:

```bash2. **Install dependencies**

npm run dev   ```bash

```   npm install

   ```

Wait for both lines:

```3. **Set up environment variables**

✅ VITE ready at http://localhost:5173   

✅ Server running on port 3001   Create `.env` files in both `client` and `server` directories:

```   

   **server/.env**

### ❌ "Module Not Found"   ```env

   PORT=3001

Build shared package:   NODE_ENV=development

```bash   CLIENT_URL=http://localhost:5173

cd shared   CORS_ORIGIN=http://localhost:5173

npm run build   ```

cd ..   

npm run dev   **client/.env**

```   ```env

   VITE_SERVER_URL=http://localhost:3001

### ❌ Server Stops When I Close Terminal   ```



**Normal behavior!** The server only runs while `npm run dev` is active.### Development



**Solutions:**Run both client and server in development mode:

1. Keep terminal open while developing

2. Use VS Code's integrated terminal```bash

3. For production, deploy to a server (see DEPLOYMENT.md)npm run dev

```

---

This will start:

## 🚀 Deployment (Publishing Online)- **Frontend**: http://localhost:5173

- **Backend**: http://localhost:3001

### ❌ GitHub Pages Won't Work

Or run them separately:

GitHub Pages is only for static sites. Your backend needs a server.

```bash

### ✅ Recommended Free Options# Frontend only

npm run dev:client

**Frontend (React):**

- Vercel ✅ (Free, easy)# Backend only

- Netlify ✅ (Free)npm run dev:server

```

**Backend (Node.js):**

- Railway ✅ (Free tier, easy)### Production Build

- Render ✅ (Free tier)

- Fly.io ✅ (Free tier)```bash

# Build all packages

See `DEPLOYMENT.md` for step-by-step instructions.npm run build



---# Start production server

npm start

## 🔧 Commands```



```bash## 🎮 How to Play

# Start everything

npm run dev1. **Set Your Username**

   - Visit the homepage

# Start only frontend   - Enter your username (2-20 characters)

npm run dev:client

2. **Create or Join a Room**

# Start only backend   - **Create**: Click "Create New Room" → Select a game

npm run dev:server   - **Join**: Enter a 6-character room code



# Build for production3. **Start the Game**

npm run build   - Wait for players to join (minimum 4 players)

   - Host clicks "Start Game"

# Production mode   - Follow game-specific rules

npm start

```4. **Have Fun!**

   - Each game has unique mechanics

---   - Work together or deceive each other

   - Winner is announced at the end

## ❓ Common Questions

## 🔧 API Endpoints

**Q: Where is my data stored?**  

A: In server memory (RAM). Lost when server restarts. Can add database later.### REST API



**Q: Works on all browsers?**  - `GET /health` - Server health check

A: Yes! Chrome, Firefox, Edge, Safari, Opera - all supported.- `GET /api/rooms` - List all active rooms



**Q: Can I test multiplayer alone?**  ### Socket.IO Events

A: Yes! Open multiple browsers, join same room with different usernames.

#### Client → Server

**Q: Why does it stop when I close VS Code?**  

A: Server runs in terminal. Closing terminal stops server. Normal!- `room:create` - Create a new game room

- `room:join` - Join an existing room

**Q: How to keep it running 24/7?**  - `room:leave` - Leave current room

A: Deploy to a hosting service like Railway or Render (see DEPLOYMENT.md).- `room:updateSettings` - Update room settings (host only)

- `game:start` - Start the game (host only)

---- `game:action` - Send game action

- `user:updateUsername` - Update your username

## 📝 License

#### Server → Client

MIT License - See [LICENSE](LICENSE)

- `room:created` - Room successfully created

---- `room:joined` - Joined a room

- `room:updated` - Room state changed

**Need Help?** Check `QUICKSTART.md` or `/docs` folder!- `room:left` - Left the room

- `room:deleted` - Room was deleted
- `game:started` - Game has started
- `game:updated` - Game state changed
- `player:joined` - New player joined
- `player:left` - Player left
- `error` - Error occurred

## 🧪 Development Commands

```bash
# Install dependencies
npm install

# Run development servers
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Run tests (when implemented)
npm test
```

## 📦 Workspaces

This project uses npm workspaces to manage multiple packages:

- `@gatherplay/client` - Frontend React app
- `@gatherplay/server` - Backend Node.js server
- `@gatherplay/shared` - Shared TypeScript types

## 🌟 Future Enhancements

- [ ] User accounts and authentication
- [ ] Game statistics and leaderboards
- [ ] More social deduction games
- [ ] Spectator mode
- [ ] Voice chat integration
- [ ] Custom game lobbies
- [ ] Mobile app (React Native)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit and integration tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by popular social deduction games
- Built with modern web technologies
- Community-driven development

## 📧 Contact

Project Link: [https://github.com/yourusername/GatherPlay](https://github.com/yourusername/GatherPlay)

---

**Made with ❤️ by the GatherPlay Team**
