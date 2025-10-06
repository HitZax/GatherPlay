# 🎮 GatherPlay

**GatherPlay** is a modern, real-time multiplayer platform for social deduction games. Play popular party games like Insider, Werewords, Feed the Kraken, and Deception: Murder in Hong Kong with friends online.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🎲 **Multiple Games**: Choose from 4 popular social deduction games
- 🔄 **Real-time Multiplayer**: Powered by Socket.IO for seamless gameplay
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS
- 📱 **Mobile Friendly**: Play on any device
- 🚀 **Scalable Architecture**: Built to handle thousands of concurrent players
- 🔒 **Type-Safe**: Full TypeScript support across the stack

## 🎯 Available Games

| Game | Players | Description |
|------|---------|-------------|
| **Insider** | 4-12 | Word-guessing game where one player secretly helps |
| **Werewords** | 4-10 | Guess the magic word before werewolves sabotage you |
| **Feed the Kraken** | 5-11 | Navigate the seas while pirates and cultists battle |
| **Deception: Murder in Hong Kong** | 4-12 | Solve the murder using cryptic clues |

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **Socket.IO** - WebSocket server
- **TypeScript** - Type-safe server code

### Shared
- Shared TypeScript types and utilities
- Consistent validation across client and server

## 📁 Project Structure

```
GatherPlay/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Socket, etc.)
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Zustand stores
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── managers/      # Room and user management
│   │   ├── index.ts       # Server entry point
│   │   └── socket.ts      # Socket.IO handlers
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                # Shared types and utilities
│   ├── src/
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── constants.ts   # Shared constants
│   │   └── utils.ts       # Helper functions
│   ├── package.json
│   └── tsconfig.json
│
└── package.json           # Root workspace config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GatherPlay.git
   cd GatherPlay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `client` and `server` directories:
   
   **server/.env**
   ```env
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   ```
   
   **client/.env**
   ```env
   VITE_SERVER_URL=http://localhost:3001
   ```

### Development

Run both client and server in development mode:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

Or run them separately:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Production Build

```bash
# Build all packages
npm run build

# Start production server
npm start
```

## 🎮 How to Play

1. **Set Your Username**
   - Visit the homepage
   - Enter your username (2-20 characters)

2. **Create or Join a Room**
   - **Create**: Click "Create New Room" → Select a game
   - **Join**: Enter a 6-character room code

3. **Start the Game**
   - Wait for players to join (minimum 4 players)
   - Host clicks "Start Game"
   - Follow game-specific rules

4. **Have Fun!**
   - Each game has unique mechanics
   - Work together or deceive each other
   - Winner is announced at the end

## 🔧 API Endpoints

### REST API

- `GET /health` - Server health check
- `GET /api/rooms` - List all active rooms

### Socket.IO Events

#### Client → Server

- `room:create` - Create a new game room
- `room:join` - Join an existing room
- `room:leave` - Leave current room
- `room:updateSettings` - Update room settings (host only)
- `game:start` - Start the game (host only)
- `game:action` - Send game action
- `user:updateUsername` - Update your username

#### Server → Client

- `room:created` - Room successfully created
- `room:joined` - Joined a room
- `room:updated` - Room state changed
- `room:left` - Left the room
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
