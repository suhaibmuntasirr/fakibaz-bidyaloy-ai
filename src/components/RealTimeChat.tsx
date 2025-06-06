
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Users, MessageCircle } from 'lucide-react';
import { realtimeService, ChatMessage } from '@/services/realtimeService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RealTimeChatProps {
  chatRoomId: string;
  className?: string;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({ chatRoomId, className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!chatRoomId) return;

    // Subscribe to chat messages
    const unsubscribeMessages = realtimeService.subscribeToChat(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();
    });

    // Subscribe to online users
    const unsubscribeUsers = realtimeService.subscribeToOnlineUsers(setOnlineUsers);

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [chatRoomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isLoading) return;

    setIsLoading(true);
    try {
      await realtimeService.sendMessage(
        chatRoomId,
        newMessage.trim(),
        user.uid,
        user.displayName || 'অজ্ঞাত ব্যবহারকারী'
      );
      setNewMessage('');
    } catch (error) {
      toast({
        title: "বার্তা পাঠাতে সমস্যা",
        description: "আবার চেষ্টা করুন",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bn-BD', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={`bg-black/20 backdrop-blur-lg border border-white/10 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
            লাইভ চ্যাট
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Users className="mr-1 h-4 w-4" />
            {onlineUsers.length} অনলাইন
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-64 mb-4 border border-white/10 rounded-lg p-3 bg-black/30">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>কোন বার্তা নেই</p>
                <p className="text-sm">প্রথম বার্তা পাঠান!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.userId === user?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.userId === user?.uid
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {message.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {message.userName}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="বার্তা লিখুন..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeChat;
