import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useRoomStore } from '../store/roomStore';
import { useSocket } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const { user, setUser } = useUserStore();
  const { currentRoom } = useRoomStore();
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  const handleUsernameUpdate = () => {
    if (!newUsername.trim() || !socket) return;
    
    socket.emit('user:updateUsername', newUsername.trim());
    setUser({ ...user!, username: newUsername.trim() });
    setIsEditingUsername(false);
    setNewUsername('');
  };

  const handleLeaveRoom = () => {
    if (!socket) return;
    socket.emit('room:leave');
    navigate('/');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg shadow-lg transition-all"
        title="Toggle Sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-gray-800 border-l border-gray-700 shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Game Info</h2>
            <div className="h-1 bg-primary-500 rounded"></div>
          </div>

          {/* Connection Status */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Status</span>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-white">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="mb-3">
              <span className="text-gray-400 text-sm block mb-2">Username</span>
              
              {!isEditingUsername ? (
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {user?.username || 'Not set'}
                  </span>
                  {user && (
                    <button
                      onClick={() => {
                        setIsEditingUsername(true);
                        setNewUsername(user.username);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="input w-full"
                    placeholder="New username"
                    maxLength={20}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUsernameUpdate}
                      className="btn btn-primary flex-1 text-sm py-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        setNewUsername('');
                      }}
                      className="btn bg-gray-600 hover:bg-gray-500 flex-1 text-sm py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room Info */}
          {currentRoom ? (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-400 text-sm block mb-2">Current Room</span>
              
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-xs">Room ID:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white font-mono font-bold text-lg">
                      {currentRoom.id}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentRoom.id);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-xs"
                      title="Copy room ID"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-xs">Game:</span>
                  <div className="text-white font-semibold mt-1">
                    {currentRoom.gameName}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-xs">Players:</span>
                  <div className="text-white font-semibold mt-1">
                    {currentRoom.players.length} / {currentRoom.maxPlayers}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-xs">Status:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        currentRoom.state === 'lobby'
                          ? 'bg-blue-500 text-white'
                          : currentRoom.state === 'in_progress'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {currentRoom.state.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLeaveRoom}
                  className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-semibold transition-colors"
                >
                  Leave Room
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-400 text-sm">Not in a room</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  navigate('/lobby');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                ➕ Create Room
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-gray-400 text-xs mb-3">
              Check out the guides in the project folder:
            </p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• TESTING_GUIDE.md</li>
              <li>• HOW_TO_PROCEED.md</li>
              <li>• GAME_IMPLEMENTATION_GUIDE.md</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-xs text-center">
              GatherPlay v2.0
              <br />
              Built with React + Socket.IO
            </p>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
}
