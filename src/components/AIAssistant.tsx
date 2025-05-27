
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, BookOpen, Lightbulb, Key } from 'lucide-react';
import { chatGPTService } from '@/services/chatgptService';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  selectedClass: string;
  selectedSubject: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  references?: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ selectedClass, selectedSubject }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'আসসালামু আলাইকুম! আমি তোমার AI শিক্ষক। NCTB বই থেকে যেকোনো প্রশ্ন করতে পারো। আমি বাংলা ও ইংরেজি দুই ভাষায়ই উত্তর দিতে পারি। প্রথমে তোমার OpenAI API Key দিয়ে AI সেবা চালু করো।',
      timestamp: new Date(),
      references: []
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const { toast } = useToast();

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key প্রয়োজন",
        description: "অনুগ্রহ করে OpenAI API Key প্রদান করুন",
        variant: "destructive"
      });
      return;
    }
    
    chatGPTService.setApiKey(apiKey);
    setShowApiKeyInput(false);
    localStorage.setItem('openai_api_key', apiKey);
    
    toast({
      title: "API Key সেট করা হয়েছে",
      description: "এখন আপনি AI শিক্ষকের সাথে কথা বলতে পারেন!"
    });
  };

  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      chatGPTService.setApiKey(savedApiKey);
      setShowApiKeyInput(false);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (showApiKeyInput) {
      toast({
        title: "API Key প্রয়োজন",
        description: "প্রথমে OpenAI API Key সেট করুন",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await chatGPTService.sendMessage(newMessage, {
        class: selectedClass,
        subject: selectedSubject
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        references: selectedClass && selectedSubject ? [`${selectedClass} - ${selectedSubject}`] : []
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: error instanceof Error ? error.message : "কিছু ভুল হয়েছে",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'সমীকরণ কিভাবে সমাধান করবো?',
    'How to solve quadratic equations?',
    'সালোকসংশ্লেষণ কি?',
    'বাংলা ব্যাকরণে সমাস কয় প্রকার?'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-white/30 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-t-lg">
          <CardTitle className="flex items-center text-white text-2xl">
            <Bot className="mr-3 h-8 w-8 text-blue-400" />
            AI শিক্ষক - NCTB সহায়ক
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center mb-3">
                <Key className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-white font-medium">OpenAI API Key প্রয়োজন</span>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button onClick={handleSetApiKey} className="bg-yellow-600 hover:bg-yellow-700">
                  সেট করুন
                </Button>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                API Key শুধুমাত্র আপনার ব্রাউজারে সংরক্ষিত হবে
              </p>
            </div>
          )}

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-black/20 rounded-xl p-4 border border-white/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-white/20 to-white/10 text-white border border-white/20 shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 text-blue-400" />}
                    {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.references && message.references.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.references.map((ref, index) => (
                            <div key={index} className="flex items-center text-xs text-blue-300">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {ref}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-white/20 to-white/10 text-white border border-white/20 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="তোমার প্রশ্ন লেখো..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={showApiKeyInput}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || showApiKeyInput}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Questions */}
            {!showApiKeyInput && (
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
                  নমুনা প্রশ্ন:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs justify-start rounded-xl"
                      onClick={() => setNewMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
