import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useUserStore } from '../store/userStore';

export default function Home() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState(user?.username || '');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    setUser({
      id: socket?.id || Math.random().toString(36),
      username: username.trim(),
    });
    setError('');
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please set your username first');
      return;
    }
    if (!socket) {
      setError('Not connected to server');
      return;
    }
    if (roomId.trim().length !== 6) {
      setError('Room ID must be 6 characters');
      return;
    }

    socket.emit('room:join', { roomId: roomId.toUpperCase(), username: user.username }, (response) => {
      if (response.success) {
        navigate(`/room/${roomId.toUpperCase()}`);
      } else {
        setError(response.error || 'Failed to join room');
      }
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="card max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-6">Welcome to GatherPlay</h2>
          <p className="text-gray-400 mb-6">
            Choose your username to start playing social deduction games with friends
          </p>

          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              className="input w-full mb-4"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome, <span className="text-primary-400">{user.username}</span>!
        </h1>
        <p className="text-2xl text-gray-400 mb-8">
          Play social deduction games with friends in real-time
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="card text-center group hover:bg-gray-700 transition-all cursor-pointer"
             onClick={() => navigate('/lobby')}>
          <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎮</div>
          <h2 className="text-3xl font-bold text-white mb-4">Create a Game</h2>
          <p className="text-gray-400 mb-6 text-lg">
            Host a new game room and invite your friends to join
          </p>
          <button className="btn btn-primary w-full text-lg py-3">
            Create New Room
          </button>
        </div>

        <div className="card group hover:bg-gray-700 transition-all">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚪</div>
            <h2 className="text-3xl font-bold text-white mb-4">Join a Game</h2>
            <p className="text-gray-400 mb-6 text-lg">
              Enter a room code to join an existing game
            </p>
          </div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              className="input w-full mb-4 text-center text-xl font-mono"
              placeholder="Enter Room ID (e.g., ABC123)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="btn btn-primary w-full text-lg py-3">
              Join Room
            </button>
          </form>
        </div>
      </div>

      {/* Game Showcase - Just a teaser */}
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-white mb-4">12 Games & Counting</h2>
        <p className="text-gray-400 mb-8 text-lg">
          From classic word games to intense hidden movement thrillers
        </p>
        
        <div className="flex justify-center items-center space-x-6 mb-8 flex-wrap gap-4">
          {['🕵️', '🐺', '🏛️', '🎭', '🦑', '🔍', '🧟', '🕯️', '🧛', '👁️', '�', '🚂'].map((emoji, i) => (
            <div key={i} className="text-5xl hover:scale-125 transition-transform cursor-default">
              {emoji}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/lobby')}
          className="btn btn-secondary text-lg"
        >
          Browse All Games →
        </button>
      </div>
    </div>
  );
}
