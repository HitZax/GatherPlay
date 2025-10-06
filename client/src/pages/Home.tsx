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
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome, <span className="text-primary-400">{user.username}</span>!
        </h1>
        <p className="text-xl text-gray-400">Choose how you'd like to play</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Create a Game</h2>
          <p className="text-gray-400 mb-6">
            Host a new game room and invite your friends to join
          </p>
          <button
            onClick={() => navigate('/lobby')}
            className="btn btn-primary w-full"
          >
            Create New Room
          </button>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4">Join a Game</h2>
          <p className="text-gray-400 mb-6">
            Enter a room code to join an existing game
          </p>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              className="input w-full mb-4"
              placeholder="Enter Room ID (e.g., ABC123)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="btn btn-primary w-full">
              Join Room
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Available Games</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Insider', players: '4-12', emoji: '🕵️' },
            { name: 'Werewords', players: '4-10', emoji: '🐺' },
            { name: 'Feed the Kraken', players: '5-11', emoji: '🦑' },
            { name: 'Deception', players: '4-12', emoji: '🔍' },
          ].map((game) => (
            <div
              key={game.name}
              className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors"
            >
              <div className="text-4xl mb-2">{game.emoji}</div>
              <h3 className="text-white font-semibold">{game.name}</h3>
              <p className="text-gray-400 text-sm">{game.players} players</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
