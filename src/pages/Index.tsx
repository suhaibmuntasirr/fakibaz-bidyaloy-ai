
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, BookOpen, Users, Brain, Star, ArrowRight, Search, X, Send, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';
import ClassSelection from '@/components/ClassSelection';
import AccessibleButton from '@/components/AccessibleButton';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'ai'}[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/notes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAIChat = () => {
    setShowAIChat(true);
  };

  const sendAIMessage = () => {
    if (aiMessage.trim()) {
      setChatMessages(prev => [...prev, { text: aiMessage, sender: 'user' }]);
      // Simulate AI response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: `আপনার প্রশ্নের উত্তর: "${aiMessage}" - এই বিষয়ে আমি আপনাকে সাহায্য করতে পারি। আরো বিস্তারিত জানতে চাইলে প্রশ্ন করুন।`, 
          sender: 'ai' 
        }]);
      }, 1000);
      setAiMessage('');
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setChatMessages(prev => [...prev, { 
      text: `${subject} বিষয়ে আপনার প্রশ্ন করুন। আমি সাহায্য করতে প্রস্তুত!`, 
      sender: 'ai' 
    }]);
  };

  const subjects = [
    { name: 'কী শিখতে চাও?', icon: '🎓' },
    { name: 'বিষয় নির্বাচন করুন', icon: '📚' },
    { name: 'নোট দেখা', icon: '📝' },
    { name: 'নোট আপলোড', icon: '📤' },
    { name: 'খুঁজে দেখো', icon: '🔍' },
    { name: 'কমিউনিটি', icon: '👥' }
  ];

  const features = [
    {
      id: '1',
      icon: MessageCircle,
      title: 'AI শিক্ষক',
      description: 'যেকোনো বিষয়ে প্রশ্ন করুন এবং তাৎক্ষণিক উত্তর পান',
      path: '/',
      gradient: 'from-blue-600 to-cyan-600',
      action: handleAIChat
    },
    {
      id: '2',
      icon: BookOpen,
      title: 'নোট শেয়ার',
      description: 'সারা দেশের ছাত্রছাত্রীদের নোট এক জায়গায়',
      path: '/notes',
      gradient: 'from-green-600 to-teal-600',
      action: () => navigate('/notes')
    },
    {
      id: '3',
      icon: Brain,
      title: 'প্রশ্ন ব্যাংক',
      description: 'বিগত বছরের প্রশ্ন ও সমাধান',
      path: '/questionbank',
      gradient: 'from-purple-600 to-pink-600',
      action: () => navigate('/questionbank')
    },
    {
      id: '4',
      icon: Users,
      title: 'কমিউনিটি',
      description: 'অন্য শিক্ষার্থীদের সাথে আলোচনা করুন',
      path: '/community',
      gradient: 'from-orange-600 to-red-600',
      action: () => navigate('/community')
    }
  ];

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      {/* Ad Banner */}
      <AdBanner 
        imageUrl="/lovable-uploads/394575bd-0e65-4fc0-8982-c7aeb2363127.png"
        altText="শিক্ষামূলক বিজ্ঞাপন"
        onClick={() => toast({ title: "বিজ্ঞাপন", description: "বিজ্ঞাপনে ক্লিক করা হয়েছে" })}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ফাকিবাজ বিদ্যালয়
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI শিক্ষক, নোট শেয়ারিং, প্রশ্ন ব্যাংক এবং কমিউনিটি - সবকিছু এক জায়গায়
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex gap-2">
              <Input
                placeholder="কী খুঁজছেন? (যেমন: পদার্থবিজ্ঞান নোট, গণিত প্রশ্ন)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 text-lg py-6"
                aria-label="সার্চ করুন"
              />
              <AccessibleButton
                onClick={handleSearch}
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                ariaLabel="সার্চ করুন"
              >
                <Search className="h-5 w-5" />
              </AccessibleButton>
            </div>
          </div>
        </div>
      </section>

      {/* Class Selection Section */}
      <ClassSelection />

      {/* Features Grid */}
      <section className="py-16 px-4" aria-labelledby="features-heading">
        <div className="container mx-auto">
          <h2 id="features-heading" className="text-3xl font-bold text-center text-white mb-12">
            প্রধান ফিচারসমূহ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={feature.action}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      feature.action();
                    }
                  }}
                  aria-label={`${feature.title}: ${feature.description}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20" role="region" aria-labelledby="cta-heading">
        <div className="container mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl font-bold text-white mb-6">
            আজই শুরু করুন আপনার শেখার যাত্রা
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            লাখো ছাত্রছাত্রীর সাথে যুক্ত হয়ে আপনার স্বপ্নের লক্ষ্য অর্জন করুন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AccessibleButton 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-3"
              ariaLabel="বিনামূল্যে যোগ দিন"
            >
              বিনামূল্যে যোগ দিন
              <ArrowRight className="ml-2 h-5 w-5" />
            </AccessibleButton>
            <AccessibleButton 
              size="lg"
              variant="outline"
              onClick={() => navigate('/subscription')}
              className="bg-black/30 border-white/20 text-white hover:bg-white/10 px-8 py-3"
              ariaLabel="প্রিমিয়াম প্ল্যান দেখুন"
            >
              <Star className="mr-2 h-5 w-5" />
              প্রিমিয়াম প্ল্যান
            </AccessibleButton>
          </div>
        </div>
      </section>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AccessibleButton
          onClick={handleAIChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          ariaLabel="AI শিক্ষক চ্যাট"
        >
          <MessageSquare className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </AccessibleButton>
      </div>

      {/* Enhanced AI Chat Slide Panel */}
      {showAIChat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-[#28282B] border-l border-white/10 transform transition-transform duration-300 ${showAIChat ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
                AI শিক্ষক
              </h3>
              <AccessibleButton
                variant="ghost"
                size="icon"
                onClick={() => setShowAIChat(false)}
                className="text-white hover:bg-white/10"
                ariaLabel="চ্যাট বন্ধ করুন"
              >
                <X className="h-5 w-5" />
              </AccessibleButton>
            </div>
            
            <div className="p-4 border-b border-white/10">
              <p className="text-gray-300 text-center mb-4">
                প্রশ্ন করো বাংলায় অথবা ইংরেজিতে
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {subjects.map((subject, index) => (
                  <AccessibleButton
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubjectSelect(subject.name)}
                    className="bg-black/30 border-white/20 text-white hover:bg-white/10 text-xs justify-start"
                    ariaLabel={subject.name}
                  >
                    <span className="mr-2">{subject.icon}</span>
                    {subject.name}
                  </AccessibleButton>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <p>উপরের বিষয়গুলো থেকে বেছে নিন অথবা সরাসরি প্রশ্ন করুন!</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-white'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    placeholder="তোমার প্রশ্ন লেখো..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                    aria-label="প্রশ্ন লিখুন"
                  />
                  <AccessibleButton
                    onClick={sendAIMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                    ariaLabel="প্রশ্ন পাঠান"
                  >
                    <Send className="h-4 w-4" />
                  </AccessibleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
