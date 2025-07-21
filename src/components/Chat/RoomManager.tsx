import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoomManagerProps {
  onJoinRoom: (roomCode: string) => void;
}

export const RoomManager = ({ onJoinRoom }: RoomManagerProps) => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const newRoomCode = generateRoomCode();
      const roomRef = ref(database, `rooms/${newRoomCode}`);
      
      await set(roomRef, {
        createdBy: currentUser.uid,
        createdAt: Date.now(),
        creatorName: currentUser.displayName || 'Anonymous',
      });

      toast({
        title: "Room created!",
        description: `Room code: ${newRoomCode}`,
      });

      onJoinRoom(newRoomCode);
    } catch (error) {
      toast({
        title: "Failed to create room",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      toast({
        title: "Please enter a room code",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const roomRef = ref(database, `rooms/${roomCode.toUpperCase()}`);
      const snapshot = await get(roomRef);
      
      if (snapshot.exists()) {
        onJoinRoom(roomCode.toUpperCase());
      } else {
        toast({
          title: "Room not found",
          description: "Please check the room code and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to join room",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MassChat Room
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.displayName}!
          </p>
        </div>

        {/* Room Management */}
        <Card>
          <CardHeader>
            <CardTitle>Join the Conversation</CardTitle>
            <CardDescription>
              Create a new room or join an existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Room</TabsTrigger>
                <TabsTrigger value="join">Join Room</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Create a new room and get a unique code to share with friends
                    </p>
                  </div>
                  <Button 
                    onClick={createRoom} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Creating..." : "Create New Room"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="join" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Enter a room code to join an existing conversation
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input
                      id="roomCode"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Enter room code"
                      className="text-center font-mono"
                    />
                  </div>
                  <Button 
                    onClick={joinRoom} 
                    disabled={loading || !roomCode.trim()}
                    className="w-full"
                  >
                    {loading ? "Joining..." : "Join Room"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};