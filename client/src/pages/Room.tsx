import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useRoomStore } from '../store/roomStore';
import { useUserStore } from '../store/userStore';
import { RoomState, InsiderSettings } from '@shared';
import InsiderGame from '../components/games/InsiderGame';
import InsiderSettingsPanel from '../components/games/InsiderSettings';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { currentRoom } = useRoomStore();
  const { user } = useUserStore();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!user || !socket) {
      navigate('/');
      return;
    }

    // Listen for room deletion
    const handleRoomDeleted = () => {
      navigate('/');
    };

    socket.on('room:deleted', handleRoomDeleted);

    return () => {
      socket.off('room:deleted', handleRoomDeleted);
    };
  }, [socket, user, navigate]);

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('room:leave');
      navigate('/');
    }
  };

  const handleStartGame = () => {
    if (socket) {
      socket.emit('game:start');
    }
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Loading room...</h2>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const isHost = currentRoom.hostId === user?.id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentRoom.gameName}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Room ID: <span className="font-mono text-primary-400">{currentRoom.id}</span></span>
              <span>•</span>
              <span>State: {currentRoom.state}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            {isHost && currentRoom.state === RoomState.LOBBY && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn bg-gray-700 hover:bg-gray-600"
              >
                ⚙️ Settings
              </button>
            )}
            <button onClick={handleLeaveRoom} className="btn btn-danger">
              Leave Room
            </button>
          </div>
        </div>

        {/* Game Settings Panel */}
        {isHost && showSettings && currentRoom.state === RoomState.LOBBY && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg border-2 border-primary-500">
            <h3 className="text-lg font-semibold text-white mb-4">⚙️ Game Settings</h3>
            {currentRoom.gameName === 'insider' ? (
              <InsiderSettingsPanel
                settings={currentRoom.settings as InsiderSettings}
                onSave={(newSettings) => {
                  if (socket) {
                    socket.emit('room:updateSettings', newSettings);
                    setShowSettings(false);
                  }
                }}
              />
            ) : (
              <div className="space-y-4">
                <div className="text-gray-400 text-sm">
                  <p className="mb-2">🎮 Customize your game experience:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Difficulty levels</li>
                    <li>Timer duration</li>
                    <li>Special roles and rules</li>
                    <li>Game-specific options</li>
                  </ul>
                  <p className="mt-3 text-yellow-400 text-xs">
                    ⚠️ Settings for this game coming soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Players ({currentRoom.players.length}/{currentRoom.maxPlayers})
          </h3>
          <div className="space-y-2">
            {currentRoom.players.map((player) => (
              <div
                key={player.userId}
                className="flex items-center justify-between bg-gray-600 p-3 rounded"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-white">{player.username}</span>
                  {player.isHost && (
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                      Host
                    </span>
                  )}
                </div>
                {player.isReady && !player.isHost && (
                  <span className="text-green-400 text-sm">✓ Ready</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {currentRoom.state === RoomState.LOBBY && isHost && (
          <div>
            <button
              onClick={handleStartGame}
              disabled={currentRoom.players.length < 4}
              className="btn btn-primary w-full"
            >
              {currentRoom.players.length < 4
                ? `Need ${4 - currentRoom.players.length} more players`
                : 'Start Game'}
            </button>
          </div>
        )}

        {currentRoom.state === RoomState.IN_PROGRESS && (
          <div>
            {currentRoom.gameName === 'insider' ? (
              <InsiderGame roomId={currentRoom.id} />
            ) : (
              <div className="bg-primary-500/10 border border-primary-500 p-4 rounded-lg">
                <p className="text-primary-400 text-center">Game in progress...</p>
                <p className="text-gray-400 text-center text-sm mt-2">
                  Game UI for {currentRoom.gameName} coming soon!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
        <p className="text-gray-400">
          Game instructions will appear here once the game starts.
        </p>
      </div>
    </div>
  );
}
