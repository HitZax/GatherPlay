import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useSocket } from '../contexts/SocketContext';

export default function Header() {
  const { user } = useUserStore();
  const { connected } = useSocket();

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              🎮 <span className="text-primary-400">GatherPlay</span>
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-400">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {user && (
              <div className="text-white">
                <span className="text-gray-400">Welcome,</span> {user.username}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
