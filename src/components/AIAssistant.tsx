
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, BookOpen, Lightbulb } from 'lucide-react';

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
      content: 'আসসালামু আলাইকুম! আমি তোমার AI শিক্ষক। NCTB বই থেকে যেকোনো প্রশ্ন করতে পারো। আমি বাংলা ও ইংরেজি দুই ভাষায়ই উত্তর দিতে পারি।',
      timestamp: new Date(),
      references: []
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate AI response (in real implementation, this would call OpenAI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `তোমার প্রশ্ন "${newMessage}" এর উত্তর: ${selectedClass && selectedSubject ? `${selectedClass} - ${selectedSubject} অনুযায়ী` : ''} এখানে বিস্তারিত ব্যাখ্যা থাকবে NCTB বই থেকে রেফারেন্স সহ।`,
        timestamp: new Date(),
        references: ['Class 8 - Chapter 3', 'Page 45-47']
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const suggestedQuestions = [
    'সমীকরণ কিভাবে সমাধান করবো?',
    'How to solve quadratic equations?',
    'সালোকসংশ্লেষণ কি?',
    'বাংলা ব্যাকরণে সমাস কয় প্রকার?'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Bot className="mr-3 h-6 w-6 text-blue-400" />
            AI শিক্ষক - NCTB সহায়ক
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-black/20 rounded-lg p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 text-blue-400" />}
                    {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
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
                <div className="bg-white/20 text-white border border-white/10 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
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
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Questions */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <Lightbulb className="h-4 w-4 mr-2" />
                নমুনা প্রশ্ন:
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    onClick={() => setNewMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
