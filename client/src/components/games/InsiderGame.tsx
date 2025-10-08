import { useEffect, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useUserStore } from '../../store/userStore';
import { InsiderGameState, InsiderPhase } from '@shared';

interface Props {
  roomId: string;
}

export default function InsiderGame({ roomId }: Props) {
  const { socket } = useSocket();
  const { user } = useUserStore();
  const [gameState, setGameState] = useState<Partial<InsiderGameState> | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (state: Partial<InsiderGameState>) => {
      setGameState(state);
    };

    socket.on('game:updated', handleGameUpdate);
    socket.on('game:started', handleGameUpdate);

    return () => {
      socket.off('game:updated', handleGameUpdate);
      socket.off('game:started', handleGameUpdate);
    };
  }, [socket]);

  // Timer countdown
  useEffect(() => {
    if (!gameState || gameState.phase !== InsiderPhase.QUESTIONING) return;
    if (!gameState.timerStart || !gameState.timerDuration) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (gameState.timerStart || 0)) / 1000);
      const left = Math.max(0, (gameState.timerDuration || 0) - elapsed);
      setTimeLeft(left);

      if (left <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleWordGuessed = () => {
    if (!socket) return;
    socket.emit('game:action', { type: 'word_guessed', roomId });
  };

  const handleAccusation = (playerId: string) => {
    if (!socket) return;
    socket.emit('game:action', { type: 'accuse', roomId, payload: { accusedPlayerId: playerId } });
  };

  if (!gameState || !user) {
    return <div className="text-white">Loading game...</div>;
  }

  const myRole = gameState.roles?.[user.id];
  const isMaster = myRole === 'Master';
  const isInsider = myRole === 'Insider';

  return (
    <div className="space-y-6">
      {/* Phase: Role Reveal */}
      {gameState.phase === InsiderPhase.ROLE_REVEAL && (
        <div className="card text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🎭 Your Role</h2>
          <div className={`text-6xl font-bold mb-4 ${
            isMaster ? 'text-blue-400' : isInsider ? 'text-red-400' : 'text-green-400'
          }`}>
            {myRole}
          </div>
          
          {(isMaster || isInsider) && gameState.secretWord && (
            <div className="mt-6 p-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg">
              <div className="text-yellow-400 text-sm font-semibold mb-2">Secret Word:</div>
              <div className="text-4xl font-bold text-yellow-300">{gameState.secretWord}</div>
            </div>
          )}
          
          <div className="mt-6 text-gray-400">
            {isMaster && <p>You know the word. Answer questions with Yes/No/Maybe/I don't know.</p>}
            {isInsider && <p>You know the word. Subtly guide others to guess it without being obvious!</p>}
            {!isMaster && !isInsider && <p>Ask yes/no questions to guess the secret word!</p>}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">Game starting soon...</div>
        </div>
      )}

      {/* Phase: Questioning */}
      {gameState.phase === InsiderPhase.QUESTIONING && (
        <div className="space-y-4">
          {/* Timer */}
          <div className={`card text-center ${timeLeft <= 30 ? 'bg-red-500/10 border-red-500' : ''}`}>
            <div className="text-sm text-gray-400 mb-2">Time Remaining</div>
            <div className={`text-5xl font-bold ${timeLeft <= 30 ? 'text-red-400' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Role & Word Display */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Your Role:</div>
                <div className={`text-2xl font-bold ${
                  isMaster ? 'text-blue-400' : isInsider ? 'text-red-400' : 'text-green-400'
                }`}>
                  {myRole}
                </div>
              </div>
              
              {(isMaster || isInsider) && gameState.secretWord && (
                <div className="text-right">
                  <div className="text-sm text-gray-400">Secret Word:</div>
                  <div className="text-3xl font-bold text-yellow-400">{gameState.secretWord}</div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="card bg-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">📋 How to Play:</h3>
            <div className="text-gray-300 text-sm space-y-2">
              {isMaster && (
                <>
                  <p>• You are the <span className="text-blue-400 font-semibold">Master</span></p>
                  <p>• Answer questions with: Yes, No, Maybe, or I don't know</p>
                  <p>• When the word is guessed, click "Word Guessed" button</p>
                  <p>• Then vote for who you think is the Insider</p>
                </>
              )}
              {isInsider && (
                <>
                  <p>• You are the <span className="text-red-400 font-semibold">Insider</span></p>
                  <p>• Pretend to be a Common player</p>
                  <p>• Subtly guide the group toward the answer</p>
                  <p>• Don't be too obvious or you'll be caught!</p>
                </>
              )}
              {!isMaster && !isInsider && (
                <>
                  <p>• You are a <span className="text-green-400 font-semibold">Common</span> player</p>
                  <p>• Ask yes/no questions to the Master</p>
                  <p>• Guess the secret word before time runs out</p>
                  <p>• Then help identify who the Insider is!</p>
                </>
              )}
            </div>
          </div>

          {/* Master Controls */}
          {isMaster && (
            <button
              onClick={handleWordGuessed}
              className="btn btn-primary w-full"
            >
              ✓ Word Guessed - Proceed to Voting
            </button>
          )}
        </div>
      )}

      {/* Phase: Voting */}
      {gameState.phase === InsiderPhase.VOTING && (
        <div className="space-y-4">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🔍 Who is the Insider?
            </h2>
            {gameState.wordGuessed && (
              <p className="text-green-400 mb-4">✓ Word was guessed!</p>
            )}
          </div>

          {isMaster ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Cast Your Vote:</h3>
              <div className="space-y-2">
                {/* Note: In real implementation, we'd get player list from room state */}
                <p className="text-gray-400 text-sm">Select who you think is the Insider:</p>
                {/* Placeholder - will be replaced with actual player list */}
                <button className="btn bg-gray-700 hover:bg-gray-600 w-full">
                  Coming soon: Player selection
                </button>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-gray-400">Waiting for Master to vote...</p>
            </div>
          )}
        </div>
      )}

      {/* Phase: Game Over */}
      {gameState.phase === InsiderPhase.GAME_OVER && (
        <div className="space-y-4">
          <div className="card text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <div className="text-2xl mb-6">{gameState.result}</div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Roles Revealed:</h3>
              {gameState.roles && Object.entries(gameState.roles).map(([playerId, role]) => (
                <div
                  key={playerId}
                  className={`p-2 mb-2 rounded ${
                    role === 'Master' ? 'bg-blue-500/20' :
                    role === 'Insider' ? 'bg-red-500/20' : 'bg-green-500/20'
                  }`}
                >
                  <span className="text-white">{playerId}</span>: {' '}
                  <span className={`font-bold ${
                    role === 'Master' ? 'text-blue-400' :
                    role === 'Insider' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {role}
                  </span>
                  {gameState.accusedPlayerId === playerId && (
                    <span className="ml-2 text-yellow-400">← Accused</span>
                  )}
                </div>
              ))}
            </div>

            {gameState.secretWord && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <div className="text-sm text-yellow-400">The secret word was:</div>
                <div className="text-2xl font-bold text-yellow-300">{gameState.secretWord}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
