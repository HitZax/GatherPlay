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
        className="fixed top-20 left-4 z-50 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg shadow-lg transition-all"
        title="Toggle Menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <div className="p-6 h-full overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Game Menu</h2>
            <div className="h-1 bg-primary-500 rounded"></div>
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
                  if (currentRoom) {
                    alert('Please leave your current room first before navigating.');
                    return;
                  }
                  navigate('/');
                  setIsOpen(false);
                }}
                disabled={!!currentRoom}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  currentRoom
                    ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  if (currentRoom) {
                    alert('Please leave your current room first before creating a new one.');
                    return;
                  }
                  navigate('/lobby');
                  setIsOpen(false);
                }}
                disabled={!!currentRoom}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  currentRoom
                    ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                ➕ Create Room
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="p-4 bg-gray-700 rounded-lg mb-6">
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

          {/* Donation Section */}
          <div className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">💖 Support GatherPlay</h3>
            <p className="text-gray-200 text-xs mb-3">
              This is a passion project made for fun! If you enjoy it, consider supporting development.
            </p>
            <button
              onClick={() => window.open('https://ko-fi.com/gatherplay', '_blank')}
              className="w-full bg-white hover:bg-gray-100 text-primary-700 font-semibold py-2 px-4 rounded transition-colors text-sm"
            >
              ☕ Buy me a coffee
            </button>
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-1"></div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-700">
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
