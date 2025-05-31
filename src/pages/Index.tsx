import React, { useState } from 'react';
import { Send, BookOpen, Users, Search, Upload, MessageCircle, Star, GraduationCap, Target, Bot, User, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useNavigate } from 'react-router-dom';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useToast } from '@/hooks/use-toast';
import { chatGPTService } from '@/services/chatgptService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  references?: string[];
}

const Index = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const { requireAuth } = useAuthAction();
  const { toast } = useToast();

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'বাংলা', 'English', 'গণিত', 'বিজ্ঞান', 'সামাজিক বিজ্ঞান', 
    'ICT', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত'
  ];

  const gradeCategories = [
    { range: 'ক্লাস ১-৫', icon: '🎨', description: 'প্রাথমিক শিক্ষা', classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'] },
    { range: 'ক্লাস ৬-৮', icon: '📚', description: 'মাধ্যমিক প্রস্তুতি', classes: ['Class 6', 'Class 7', 'Class 8'] },
    { range: 'ক্লাস ৯-১০', icon: '🎯', description: 'SSC প্রস্তুতি', classes: ['Class 9', 'Class 10'] },
    { range: 'ক্লাস ১১-১২', icon: '🏆', description: 'HSC প্রস্তুতি', classes: ['Class 11', 'Class 12'] }
  ];

  const testimonials = [
    {
      name: "Tahiya Faiza",
      title: "Teaching Assistant, Brac University",
      content: "ফাকিবাজের প্রতিটি সেকশন থিল পর্যাপ্ত নিউট্রেলিয়া। বিশেষ করে, 'Reading' এবং 'Writing' সেকশন এডটিজ informative ছিল যা আমার জন্য Mock Test এবং Real Exam কে সহজ করে তুলেছিল।"
    },
    {
      name: "Zakirul Islam",
      title: "Businessman",
      content: "আমনারাইলে সেখার যত সময় ব্যয় উৎকণ্ঠা না তাই আমনারাইল ফোর্স কে বেছে নেওয়া। ফাকিবাজটি খুব সুন্দর করে বিভক সমসি গুরু ভেলনেভারয় আরাক কলম সেখে ছিট।"
    },
    {
      name: "Hasibur Rahman",
      title: "Online Business Owner",
      content: "আমার এক্টি অনলাইনের শেষ ছিল কিংবদন্তিটিক লিভে নিয়ে কিন্তুদর সানেল আমাহের শেহোন কিন্তুদর ইউসুফ করার কর্মটাই করেছা শিক্ষতে সেকেড।"
    }
  ];

  const handleAskQuestion = async () => {
    if (!query.trim()) {
      toast({
        title: "প্রশ্ন লিখুন",
        description: "অনুগ্রহ করে আপনার প্রশ্ন লিখুন",
        variant: "destructive"
      });
      return;
    }

    requireAuth(async () => {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: query,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setShowChat(true);
      setIsLoading(true);

      try {
        const response = await chatGPTService.sendMessage(query, {
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

      setQuery('');
    });
  };

  const handleNavigateToNotes = () => {
    navigate('/notes');
  };

  const handleNavigateToUpload = () => {
    requireAuth(() => {
      navigate('/notes');
      setTimeout(() => {
        const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
        uploadTab?.click();
      }, 100);
    });
  };

  const handleSearch = () => {
    requireAuth(() => {
      const searchParams = new URLSearchParams();
      if (query) searchParams.set('q', query);
      if (selectedClass) searchParams.set('class', selectedClass);
      if (selectedSubject) searchParams.set('subject', selectedSubject);
      
      navigate(`/notes?${searchParams.toString()}`);
    });
  };

  const handleNavigateToCommunity = () => {
    requireAuth(() => {
      navigate('/community');
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAskQuestion();
    }
  };

  const handleGradeClick = (gradeCategory: typeof gradeCategories[0]) => {
    requireAuth(() => {
      const firstClass = gradeCategory.classes[0];
      navigate(`/notes?class=${encodeURIComponent(firstClass)}`);
    });
  };

  const handleSubscribe = (planType: string) => {
    console.log(`Subscribing to ${planType} plan`);
    navigate('/subscription');
  };

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      {/* Ad Banner */}
      <AdBanner 
        imageUrl="/lovable-uploads/e283b105-0747-4859-9cef-ef35fb06dd9d.png"
        altText="ফ্রিকোর্স - After SSC English Course"
        onClick={() => window.open('https://example.com/ad-link', '_blank')}
      />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-7xl font-bold text-white">
              ফাকিবাজ
            </h1>
          </div>
          <p className="text-2xl text-gray-200 mb-8">
            বাংলাদেশের প্রথম <span className="text-blue-400 font-semibold">AI-চালিত</span> শিক্ষা প্ল্যাটফর্ম
          </p>
          <p className="text-lg text-gray-300">
            NCTB পাঠ্যক্রম সহায়ক ও P2P নোট শেয়ারিং সিস্টেম
          </p>
        </div>

        {/* Grade Selection and P2P Explanation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Side - Grade Selection */}
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <GraduationCap className="h-10 w-10 text-blue-400 mr-3" />
                <CardTitle className="text-white text-3xl">যে কোন ক্লাসের নোট পাও এখানেই</CardTitle>
              </div>
              <p className="text-gray-200 text-lg">সব ক্লাসের সম্পূর্ণ কোর্স নোট চলছে!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {gradeCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleGradeClick(category)}
                  className={`bg-gradient-to-r ${
                    index === 0 ? 'from-black/40 to-blue-900/30' :
                    index === 1 ? 'from-black/40 to-green-900/30' :
                    index === 2 ? 'from-black/40 to-purple-900/30' :
                    'from-black/40 to-orange-900/30'
                  } backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-semibold mb-1">{category.range}</h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                    <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Side - P2P System with Image */}
          <Card className="bg-black/20 backdrop-blur-lg border border-white/10 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-10 w-10 text-purple-400 mr-3" />
                <CardTitle className="text-white text-3xl">P2P নোট ও প্রশ্নব্যাংক সিস্টেম</CardTitle>
              </div>
              <p className="text-gray-200 text-lg">নিজের প্রস্তুতি নিন, অন্যদের সাহায্য করুন</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-black/40 to-blue-800/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-500/20 rounded-full p-2">
                      <BookOpen className="h-5 w-5 text-blue-300" />
                    </div>
                    <h4 className="text-white font-semibold">নোট শেয়ার করুন</h4>
                  </div>
                  <p className="text-gray-300 text-sm">আপনার তৈরি নোট আপলোড করে অন্যদের সাহায্য করুন</p>
                </div>

                <div className="bg-gradient-to-r from-black/40 to-green-800/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-green-500/20 rounded-full p-2">
                      <Users className="h-5 w-5 text-green-300" />
                    </div>
                    <h4 className="text-white font-semibold">কমিউনিটি সাপোর্ট</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">সবার সাথে মিলে পড়াশোনা করুন এবং একসাথে এগিয়ে যান</p>
                  
                  {/* Image placement */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <img 
                      src="/lovable-uploads/38c39eea-85c1-42df-a76e-abc6c534d2db.png" 
                      alt="Students collaborating"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-black/40 to-purple-800/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-purple-500/20 rounded-full p-2">
                      <Star className="h-5 w-5 text-purple-300" />
                    </div>
                    <h4 className="text-white font-semibold">লক্ষ্য অর্জন</h4>
                  </div>
                  <p className="text-gray-300 text-sm">আপনার লক্ষ্য পূরণ করুন এবং অন্যদের স্বপ্ন পূরণে সাহায্য করুন</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main AI Question Card */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
                <MessageCircle className="mr-4 h-12 w-12 text-blue-400" />
                কী শিখতে চাও?
              </CardTitle>
              <p className="text-xl text-gray-200">
                প্রশ্ন করো বাংলায় অথবা ইংরেজিতে
              </p>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Class and Subject Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-gradient-to-r from-black/40 to-blue-800/30 border-white/20 text-white h-14 text-lg backdrop-blur-lg">
                    <SelectValue placeholder="🎓 ক্লাস নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#28282B] border-white/20">
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls} className="text-white hover:bg-white/10">
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-gradient-to-r from-black/40 to-purple-800/30 border-white/20 text-white h-14 text-lg backdrop-blur-lg">
                    <SelectValue placeholder="📚 বিষয় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#28282B] border-white/20">
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Query Input */}
              <div className="relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="✨ তোমার প্রশ্ন লেখো..."
                  className="bg-gradient-to-r from-black/40 to-green-800/30 border-white/20 text-white placeholder:text-gray-300 h-20 text-xl pr-20 backdrop-blur-lg"
                />
                <Button 
                  className="absolute right-3 top-3 h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="icon"
                  onClick={handleAskQuestion}
                >
                  <Send className="h-6 w-6" />
                </Button>
              </div>

              {/* Chat Messages */}
              {showChat && (
                <div className="h-96 overflow-y-auto bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-black/40 text-white border border-white/20 backdrop-blur-lg'
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
                    <div className="flex justify-start mb-4">
                      <div className="bg-black/40 text-white border border-white/20 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-lg">
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
              )}

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-black/40 to-blue-800/30 border-white/20 text-white hover:bg-white/20 h-16 backdrop-blur-lg"
                  onClick={handleNavigateToNotes}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  নোট দেখো
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-black/40 to-green-800/30 border-white/20 text-white hover:bg-white/20 h-16 backdrop-blur-lg"
                  onClick={handleNavigateToUpload}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  নোট আপলোড
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-black/40 to-purple-800/30 border-white/20 text-white hover:bg-white/20 h-16 backdrop-blur-lg"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  খুঁজে দেখো
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-black/40 to-orange-800/30 border-white/20 text-white hover:bg-white/20 h-16 backdrop-blur-lg"
                  onClick={handleNavigateToCommunity}
                >
                  <Users className="mr-2 h-5 w-5" />
                  কমিউনিটি
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-16">
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-blue-300/40 transition-all duration-500 cursor-pointer group" onClick={() => requireAuth(() => console.log('AI feature clicked'))}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-12 w-12 text-blue-400" />
              </div>
              <CardTitle className="text-white text-2xl">AI শিক্ষক</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                ২৪/৭ AI সহায়ক যে NCTB বই থেকে তোমার সব প্রশ্নের উত্তর দিবে বাংলায়
              </p>
              {/* Image placement */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <img 
                  src="/lovable-uploads/394575bd-0e65-4fc0-8982-c7aeb2363127.png" 
                  alt="Online learning"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-green-300/40 transition-all duration-500 cursor-pointer group" onClick={handleNavigateToNotes}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-12 w-12 text-green-400" />
              </div>
              <CardTitle className="text-white text-2xl">নোট শেয়ারিং</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 text-lg leading-relaxed">
                অন্য ছাত্রছাত্রীদের সাথে নোট শেয়ার করো এবং একসাথে শেখো
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-purple-300/40 transition-all duration-500 cursor-pointer group" onClick={handleNavigateToCommunity}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <Users className="h-12 w-12 text-purple-400" />
              </div>
              <CardTitle className="text-white text-2xl">কমিউনিটি</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হও এবং একসাথে পড়াশোনা করো
              </p>
              {/* Image placement */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <img 
                  src="/lovable-uploads/8ed33e65-80c8-4458-bbae-ad121a7ef03c.png" 
                  alt="Mobile learning"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            মানুষ আমাদের সম্পর্কে কী ভাবছে
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`bg-gradient-to-br ${
                index === 0 ? 'from-black/40 to-pink-900/30' :
                index === 1 ? 'from-black/40 to-cyan-900/30' :
                'from-black/40 to-yellow-900/30'
              } backdrop-blur-xl border border-white/10`}>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="text-pink-400 text-4xl mb-4">"</div>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investors Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            আমাদের ইনভেস্টর
          </h2>
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 overflow-hidden">
            <CardContent className="py-8">
              <div className="flex animate-scroll space-x-12">
                {['TechVenture', 'Innovation Capital', 'Digital Partners', 'Future Fund', 'Growth Equity', 'Startup Ventures'].map((investor, index) => (
                  <div key={index} className="flex-shrink-0 w-24 h-24 bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/10">
                    <span className="text-white font-bold text-lg">{investor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Coverage Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-6">
            গণমাধ্যমে Fakibaz
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-4xl mx-auto">
            দৈনিক সংবাদপত্র, টেলিভিশন চ্যানেলসহ বিভিন্ন গণমাধ্যমে Fakibaz সম্পর্কে প্রকাশিত বিভিন্ন সংবাদ ও প্রতিবেদনসমূহ
          </p>
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardContent className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['দৈনিক প্রথম আলো', 'বাংলাভিশন', 'দৈনিক কালের কণ্ঠ', 'চ্যানেল আই', 'দৈনিক যুগান্তর', 'এটিএন বাংলা'].map((outlet, index) => (
                  <div key={index} className={`bg-gradient-to-r ${
                    index % 3 === 0 ? 'from-black/40 to-emerald-900/30' :
                    index % 3 === 1 ? 'from-black/40 to-indigo-900/30' :
                    'from-black/40 to-rose-900/30'
                  } backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center`}>
                    <h4 className="text-white font-semibold text-lg mb-2">{outlet}</h4>
                    <p className="text-green-300 text-sm">সংবাদপত্র</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              আমাদের সাবস্ক্রিপশন প্ল্যান
            </h2>
            <p className="text-gray-300 text-lg">
              অতি সাশ্রয়ী মূল্যে প্রিমিয়াম শিক্ষার সুবিধা পান
            </p>
          </div>

          {/* Main Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <SubscriptionCard
              title="ফ্রি প্ল্যান"
              price="৳০"
              duration="সবসময়ের জন্য"
              features={['দৈনিক ৫টি নোট দেখার সুবিধা', 'প্রশ্ন ব্যাংকে সীমিত অ্যাক্সেস', 'বেসিক কোলাবরেশন', 'বিজ্ঞাপনসহ ব্যবহার', 'কমিউনিটি সাপোর্ট']}
              isCurrentPlan={true}
              onSubscribe={() => handleSubscribe('free')}
            />
            
            <SubscriptionCard
              title="প্রিমিয়াম প্ল্যান"
              price="৳১০"
              duration="প্রতি মাসে"
              features={['সব নোট ও প্রশ্ন ব্যাংকে সীমাহীন অ্যাক্সেস', 'বিজ্ঞাপনমুক্ত অভিজ্ঞতা', 'অফলাইন অ্যাক্সেস ও সিঙ্ক', 'অ্যাডভান্সড সার্চ ও ট্যাগিং', 'কাস্টমাইজেবল টেমপ্লেট ও থিম', 'বেসিক অ্যানালিটিক্স ও প্রগ্রেস ট্র্যাকিং', 'ইমেইল ও চ্যাট সাপোর্ট', 'সীমাহীন P2P শেয়ারিং']}
              isPopular={true}
              onSubscribe={() => handleSubscribe('premium')}
            />
          </div>
        </div>

        {/* Mobile App Download Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="bg-black/20 backdrop-blur-xl border border-white/20">
            <CardContent className="pt-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                আমাদের মোবাইল অ্যাপ ডাউনলোড করুন
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                যেকোনো সময়, যেকোনো জায়গায় শিখুন
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center"
                  onClick={() => window.open('https://play.google.com/store/apps', '_blank')}
                >
                  <img src="/lovable-uploads/df2043e9-33d3-46bf-bfa7-eb0889200315.png" alt="Get it on Google Play" className="h-12" />
                </Button>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center"
                  onClick={() => window.open('https://apps.apple.com/app', '_blank')}
                >
                  <img src="/lovable-uploads/df2043e9-33d3-46bf-bfa7-eb0889200315.png" alt="Download on the App Store" className="h-12" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-black/40 to-blue-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-blue-400 mb-2">১০০০+</div>
              <div className="text-gray-200">শিক্ষার্থী</div>
            </div>
            <div className="bg-gradient-to-br from-black/40 to-green-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">৫০০০+</div>
              <div className="text-gray-200">শেয়ারকৃত নোট</div>
            </div>
            <div className="bg-gradient-to-br from-black/40 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">২৪/৭</div>
              <div className="text-gray-200">AI সহায়তা</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">
            2025 Copyright © Fakibaz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
