import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useUserStore } from '../store/userStore';
import type { GameType } from '@shared/types';
import { GAME_CONFIGS } from '@shared/constants';

export default function GameLobby() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useUserStore();
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!user || !socket || !selectedGame) return;

    socket.emit(
      'room:create',
      { gameName: selectedGame, username: user.username },
      (response) => {
        if (response.success && response.roomId) {
          navigate(`/room/${response.roomId}`);
        } else {
          setError(response.error || 'Failed to create room');
        }
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="btn btn-secondary mb-4">
          ← Back to Home
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Select a Game</h1>
        <p className="text-gray-400">Choose which game you'd like to host</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {(Object.entries(GAME_CONFIGS) as [GameType, typeof GAME_CONFIGS[GameType]][]).map(
          ([gameId, config]) => (
            <button
              key={gameId}
              onClick={() => setSelectedGame(gameId)}
              className={`card text-left transition-all ${
                selectedGame === gameId
                  ? 'ring-4 ring-primary-500 bg-gray-700'
                  : 'hover:bg-gray-700'
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{config.name}</h3>
              <p className="text-gray-400 mb-4">{config.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-500">
                  👥 {config.minPlayers}-{config.maxPlayers} players
                </span>
              </div>
            </button>
          )
        )}
      </div>

      {selectedGame && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">
            Ready to create {GAME_CONFIGS[selectedGame].name} room?
          </h3>
          <button onClick={handleCreateRoom} className="btn btn-primary">
            Create Room
          </button>
        </div>
      )}
    </div>
  );
}
