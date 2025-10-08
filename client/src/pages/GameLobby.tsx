import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useUserStore } from '../store/userStore';
import type { GameType } from '@shared/types';
import { GAME_CONFIGS } from '@shared/constants';

// Game metadata with emojis and categories
const GAME_METADATA: Record<GameType, { emoji: string; category: string; implemented: boolean }> = {
  'insider': { emoji: '🕵️', category: 'Word & Deduction', implemented: true },
  'werewords': { emoji: '🐺', category: 'Word & Deduction', implemented: true },
  'town-of-salem': { emoji: '🏛️', category: 'Social Deduction', implemented: false },
  'mascarade': { emoji: '🎭', category: 'Bluffing & Identity', implemented: false },
  'feed-the-kraken': { emoji: '🦑', category: 'Hidden Teams', implemented: false },
  'deception-murder-hong-kong': { emoji: '🔍', category: 'Mystery & Clues', implemented: false },
  'dead-of-winter': { emoji: '🧟', category: 'Betrayal & Survival', implemented: false },
  'letters-from-whitechapel': { emoji: '🕯️', category: 'Hidden Movement', implemented: false },
  'fury-of-dracula': { emoji: '🧛', category: 'Hidden Movement', implemented: false },
  'specter-ops': { emoji: '👁️', category: 'Stealth & Hunt', implemented: false },
  'not-alone': { emoji: '👽', category: 'Asymmetric Hunt', implemented: false },
  'scotland-yard': { emoji: '🚂', category: 'Chase Classic', implemented: false },
};

export default function GameLobby() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useUserStore();
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!user || !socket || !selectedGame) return;

    const metadata = GAME_METADATA[selectedGame];
    if (!metadata.implemented) {
      setError('This game is coming soon! Try Insider or Werewords instead.');
      return;
    }

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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="btn btn-secondary mb-4">
          ← Back to Home
        </button>
        <h1 className="text-5xl font-bold text-white mb-2">Select a Game</h1>
        <p className="text-xl text-gray-400">Choose which game you'd like to host</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Game Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.entries(GAME_CONFIGS) as [GameType, typeof GAME_CONFIGS[GameType]][]).map(
          ([gameId, config]) => {
            const metadata = GAME_METADATA[gameId];
            const isSelected = selectedGame === gameId;
            const isImplemented = metadata.implemented;

            return (
              <div
                key={gameId}
                onClick={() => setSelectedGame(gameId)}
                className={`card cursor-pointer transition-all relative group ${
                  isSelected
                    ? 'ring-4 ring-primary-500 bg-gray-700'
                    : 'hover:bg-gray-700 hover:ring-2 hover:ring-primary-400'
                } ${!isImplemented ? 'opacity-75' : ''}`}
              >
                {/* Coming Soon Badge */}
                {!isImplemented && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    COMING SOON
                  </div>
                )}

                {/* Game Icon */}
                <div className="text-center mb-4">
                  <div className={`text-6xl mb-2 transition-transform ${
                    isSelected ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {metadata.emoji}
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-600 rounded-full text-xs text-gray-300 font-medium">
                    {metadata.category}
                  </span>
                </div>

                {/* Game Info */}
                <h3 className="text-2xl font-bold text-white mb-2 text-center">
                  {config.name}
                </h3>
                <p className="text-gray-400 mb-4 text-center text-sm min-h-[40px]">
                  {config.description}
                </p>

                {/* Player Count */}
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <span>👥</span>
                  <span className="font-semibold">
                    {config.minPlayers}-{config.maxPlayers} players
                  </span>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 border-4 border-primary-500 rounded-lg pointer-events-none flex items-center justify-center">
                    <div className="bg-primary-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                      ✓ SELECTED
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Create Room Button - Fixed at bottom */}
      {selectedGame && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-6 shadow-2xl z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{GAME_METADATA[selectedGame].emoji}</div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {GAME_CONFIGS[selectedGame].name}
                </h3>
                <p className="text-gray-400">
                  {GAME_CONFIGS[selectedGame].minPlayers}-{GAME_CONFIGS[selectedGame].maxPlayers} players • {GAME_METADATA[selectedGame].category}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedGame(null)}
                className="btn bg-gray-700 hover:bg-gray-600 px-8"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="btn btn-primary px-8 text-lg"
              >
                {GAME_METADATA[selectedGame].implemented ? 'Create Room' : 'Coming Soon'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Padding when button is fixed */}
      {selectedGame && <div className="h-32"></div>}
    </div>
  );
}
