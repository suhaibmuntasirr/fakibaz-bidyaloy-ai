
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai'}>>([
    { id: '1', text: 'হ্যালো! আমি আপনার AI সহায়ক। আপনি কীভাবে সাহায্য চান?', sender: 'ai' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `আপনার প্রশ্নের উত্তর: "${currentMessage}" - এটি একটি দুর্দান্ত প্রশ্ন! আমি আপনাকে এই বিষয়ে সাহায্য করতে পারি।`,
        sender: 'ai' as const
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-50"
          size="icon"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#28282B] border-white/20 text-white max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="mr-2 h-5 w-5 text-blue-400" />
              AI সহায়ক
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg mb-4 max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 max-w-[80%] p-3 rounded-lg">
                  <p className="text-sm">টাইপ করছি...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="আপনার প্রশ্ন লিখুন..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[40px] max-h-[80px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIToggle;
