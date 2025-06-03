
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { chatGPTService } from '@/services/chatgptService';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AIToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Add initial welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        content: 'আসসালামু আলাইকুম! আমি আপনার AI শিক্ষক। আপনার পড়াশোনার যেকোনো প্রশ্ন করতে পারেন।',
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      if (apiKey) {
        chatGPTService.setApiKey(apiKey);
        response = await chatGPTService.sendMessage(inputMessage);
      } else {
        // Fallback to simple responses without API key
        response = getSimpleResponse(inputMessage);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      toast({
        title: "ত্রুটি",
        description: "AI থেকে উত্তর পেতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSimpleResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('গণিত') || lowerQuestion.includes('math')) {
      return 'গণিত নিয়ে প্রশ্ন করেছেন! কোন বিষয়ে সাহায্য চান? বীজগণিত, জ্যামিতি, ক্যালকুলাস?';
    } else if (lowerQuestion.includes('পদার্থ') || lowerQuestion.includes('physics')) {
      return 'পদার্থবিজ্ঞান খুবই আকর্ষণীয় বিষয়! কোন অধ্যায়ে সাহায্য চান?';
    } else if (lowerQuestion.includes('রসায়ন') || lowerQuestion.includes('chemistry')) {
      return 'রসায়ন নিয়ে প্রশ্ন! জৈব নাকি অজৈব রসায়ন নিয়ে জানতে চান?';
    } else if (lowerQuestion.includes('জীব') || lowerQuestion.includes('biology')) {
      return 'জীববিজ্ঞান খুব গুরুত্বপূর্ণ বিষয়। কোন টপিক নিয়ে আলোচনা করতে চান?';
    } else {
      return 'দুঃখিত, আমি এখনো শিখছি। আরো নির্দিষ্ট প্রশ্ন করলে ভালো সাহায্য করতে পারবো।';
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
        size="lg"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    }`}>
      <Card className="h-full bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
        <CardHeader className="pb-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bot className="h-4 w-4 mr-2 text-blue-600" />
              AI শিক্ষক
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="flex flex-col h-full p-4 pt-0">
            {/* API Key Input */}
            {!apiKey && (
              <div className="mb-2">
                <Input
                  placeholder="OpenAI API Key (ঐচ্ছিক)"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="text-xs"
                />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-48">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-lg text-xs ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-8'
                      : 'bg-gray-100 text-gray-800 mr-8'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 text-gray-800 mr-8 p-2 rounded-lg text-xs">
                  লিখছি...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="প্রশ্ন করুন..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIToggle;
