import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import GameLobby from './pages/GameLobby';
import Room from './pages/Room';
import { useRoomStore } from './store/roomStore';

// Navigation guard component
function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { currentRoom } = useRoomStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is in a room and tries to navigate away from /room/:roomId
    if (currentRoom && !location.pathname.startsWith('/room/')) {
      // Allow navigation only if explicitly leaving (handled by leave button)
      // Otherwise, redirect back to room
      const shouldStayInRoom = window.confirm(
        'You are currently in a game room. You must leave the room first. Click OK to leave the room, or Cancel to stay.'
      );
      
      if (!shouldStayInRoom) {
        navigate(`/room/${currentRoom.id}`, { replace: true });
      }
    }
  }, [location.pathname, currentRoom, navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Layout>
          <NavigationGuard>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lobby" element={<GameLobby />} />
              <Route path="/room/:roomId" element={<Room />} />
            </Routes>
          </NavigationGuard>
        </Layout>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
