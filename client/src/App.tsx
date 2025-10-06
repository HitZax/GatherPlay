import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import GameLobby from './pages/GameLobby';
import Room from './pages/Room';

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<GameLobby />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </Layout>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
