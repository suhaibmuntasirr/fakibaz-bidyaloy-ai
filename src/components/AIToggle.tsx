
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, X, Mic, MicOff, Copy, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai', timestamp: Date}>>([
    { id: '1', text: 'হ্যালো! আমি আপনার AI সহায়ক। আমি আপনাকে পড়াশোনা, নোট তৈরি, প্রশ্ন সমাধান এবং আরও অনেক বিষয়ে সাহায্য করতে পারি। আপনি কীভাবে সাহায্য চান?', sender: 'ai', timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Enhanced AI response simulation with more intelligent responses
    setTimeout(() => {
      let aiResponseText = '';
      const userQuery = currentMessage.toLowerCase();

      if (userQuery.includes('গণিত') || userQuery.includes('math')) {
        aiResponseText = `গণিত সম্পর্কে আপনার প্রশ্ন: "${currentMessage}" - আমি এই বিষয়ে বিস্তারিত সাহায্য করতে পারি। কোন নির্দিষ্ট অধ্যায় বা সমস্যা নিয়ে জানতে চান?`;
      } else if (userQuery.includes('পদার্থ') || userQuery.includes('physics')) {
        aiResponseText = `পদার্থবিজ্ঞান একটি আকর্ষণীয় বিষয়! "${currentMessage}" - এই বিষয়ে আমি আপনাকে ধারণা, সূত্র এবং সমস্যা সমাধানে সাহায্য করতে পারি।`;
      } else if (userQuery.includes('রসায়ন') || userQuery.includes('chemistry')) {
        aiResponseText = `রসায়নের জগত অসাধারণ! "${currentMessage}" - জৈব, অজৈব বা ভৌত রসায়ন যেকোন বিষয়ে প্রশ্ন করুন।`;
      } else if (userQuery.includes('নোট') || userQuery.includes('note')) {
        aiResponseText = `নোট তৈরি এবং সংগঠনে আমি আপনাকে সাহায্য করতে পারি। কোন বিষয়ের নোট প্রয়োজন? আমি আপনাকে গাইড করব।`;
      } else if (userQuery.includes('প্রশ্ন') || userQuery.includes('question')) {
        aiResponseText = `প্রশ্ন সমাধানে আমি দক্ষ! আপনার প্রশ্নটি শেয়ার করুন এবং আমি ধাপে ধাপে সমাধান দেব।`;
      } else {
        aiResponseText = `আপনার প্রশ্ন: "${currentMessage}" - এটি একটি চমৎকার প্রশ্ন! আমি আপনাকে বিস্তারিত সাহায্য করতে পারি। আরও নির্দিষ্ট তথ্য দিলে আরও ভাল সাহায্য করতে পারব।`;
      }

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai' as const,
        timestamp: new Date()
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

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      toast({
        title: "ভয়েস রেকগনিশন",
        description: "আপনার কথা শুনছি...",
      });
      
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        setCurrentMessage("আমি ভয়েস ইনপুট ব্যবহার করে লিখছি");
        toast({
          title: "ভয়েস রেকগনিশন সম্পন্ন",
          description: "আপনার কথা টেক্সটে রূপান্তরিত হয়েছে",
        });
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি হয়েছে",
      description: "বার্তাটি ক্লিপবোর্ডে কপি হয়েছে",
    });
  };

  const clearChat = () => {
    setMessages([
      { id: '1', text: 'হ্যালো! আমি আপনার AI সহায়ক। আমি আপনাকে পড়াশোনা, নোট তৈরি, প্রশ্ন সমাধান এবং আরও অনেক বিষয়ে সাহায্য করতে পারি। আপনি কীভাবে সাহায্য চান?', sender: 'ai', timestamp: new Date() }
    ]);
    toast({
      title: "চ্যাট ক্লিয়ার হয়েছে",
      description: "সমস্ত বার্তা মুছে ফেলা হয়েছে",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-50 animate-pulse"
          size="icon"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#28282B] border-white/20 text-white max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="mr-2 h-5 w-5 text-blue-400" />
              AI সহায়ক
              <Badge className="ml-2 bg-green-600/20 text-green-300">অনলাইন</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-white hover:bg-white/10 h-6 w-6 p-0"
                title="চ্যাট ক্লিয়ার করুন"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg mb-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg relative group ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white/10 text-gray-200 border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 max-w-[80%] p-3 rounded-lg border border-white/20">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <p className="text-sm">AI চিন্তা করছে...</p>
                  </div>
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
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[50px] max-h-[100px] resize-none"
              disabled={isLoading}
            />
            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={`px-3 h-6 ${
                  isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title="ভয়েস ইনপুট"
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3 h-6"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIToggle;
