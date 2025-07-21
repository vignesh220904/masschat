import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthPage } from './AuthPage';
import { RoomManager } from '@/components/Chat/RoomManager';
import { ChatRoom } from '@/components/Chat/ChatRoom';

const AppContent = () => {
  const { currentUser } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  if (!currentUser) {
    return <AuthPage />;
  }

  if (currentRoom) {
    return (
      <ChatRoom 
        roomCode={currentRoom} 
        onLeaveRoom={() => setCurrentRoom(null)} 
      />
    );
  }

  return <RoomManager onJoinRoom={setCurrentRoom} />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
