
import React, { useState } from 'react';
import { Send, BookOpen, Users, Search, Upload, MessageCircle, Sparkles, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import { useNavigate } from 'react-router-dom';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [query, setQuery] = useState('');
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

  const handleAskQuestion = () => {
    if (!query.trim()) {
      toast({
        title: "প্রশ্ন লিখুন",
        description: "অনুগ্রহ করে আপনার প্রশ্ন লিখুন",
        variant: "destructive"
      });
      return;
    }

    requireAuth(() => {
      toast({
        title: "AI প্রশ্ন প্রক্রিয়াকরণ",
        description: "আপনার প্রশ্নের উত্তর খুঁজে দেওয়া হচ্ছে..."
      });
      console.log('Asking question:', query, 'Class:', selectedClass, 'Subject:', selectedSubject);
    });
  };

  const handleNavigateToNotes = () => {
    navigate('/notes');
  };

  const handleNavigateToUpload = () => {
    requireAuth(() => {
      navigate('/notes');
      // Focus on upload tab after navigation
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-56 h-56 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-yellow-400 mr-4 animate-pulse" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              ফাকিবাজ
            </h1>
            <Heart className="h-12 w-12 text-red-400 ml-4 animate-pulse" />
          </div>
          <p className="text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            বাংলাদেশের প্রথম <span className="text-blue-400 font-semibold">AI-চালিত</span> শিক্ষা প্ল্যাটফর্ম
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            NCTB পাঠ্যক্রম সহায়ক ও P2P নোট শেয়ারিং সিস্টেম
          </p>
        </div>

        {/* Main AI Assistant Card */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
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
                  <SelectTrigger className="bg-white/10 border-white/30 text-white h-14 text-lg rounded-xl backdrop-blur-lg">
                    <SelectValue placeholder="🎓 ক্লাস নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#28282B] border-white/20 rounded-xl">
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls} className="text-white hover:bg-white/10 rounded-lg">
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white h-14 text-lg rounded-xl backdrop-blur-lg">
                    <SelectValue placeholder="📚 বিষয় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#28282B] border-white/20 rounded-xl">
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10 rounded-lg">
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
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-300 h-20 text-xl pr-20 rounded-xl backdrop-blur-lg"
                />
                <Button 
                  className="absolute right-3 top-3 h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
                  size="icon"
                  onClick={handleAskQuestion}
                >
                  <Send className="h-6 w-6" />
                </Button>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-white hover:bg-green-500/30 h-16 rounded-xl backdrop-blur-lg"
                  onClick={handleNavigateToNotes}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  নোট দেখো
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-white hover:bg-blue-500/30 h-16 rounded-xl backdrop-blur-lg"
                  onClick={handleNavigateToUpload}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  নোট আপলোড
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-white hover:bg-purple-500/30 h-16 rounded-xl backdrop-blur-lg"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  খুঁজে দেখো
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 text-white hover:bg-orange-500/30 h-16 rounded-xl backdrop-blur-lg"
                  onClick={handleNavigateToCommunity}
                >
                  <Users className="mr-2 h-5 w-5" />
                  কমিউনিটি
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Component */}
        <AIAssistant selectedClass={selectedClass} selectedSubject={selectedSubject} />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-blue-400/30 hover:border-blue-300/50 transition-all duration-500 cursor-pointer group rounded-2xl" onClick={() => requireAuth(() => console.log('AI feature clicked'))}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-500/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-12 w-12 text-blue-400" />
              </div>
              <CardTitle className="text-white text-2xl">AI শিক্ষক</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 text-lg leading-relaxed">
                ২৪/৭ AI সহায়ক যে NCTB বই থেকে তোমার সব প্রশ্নের উত্তর দিবে বাংলায়
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-400/30 hover:border-green-300/50 transition-all duration-500 cursor-pointer group rounded-2xl" onClick={handleNavigateToNotes}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-500/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
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

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-400/30 hover:border-purple-300/50 transition-all duration-500 cursor-pointer group rounded-2xl" onClick={handleNavigateToCommunity}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-500/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                <Users className="h-12 w-12 text-purple-400" />
              </div>
              <CardTitle className="text-white text-2xl">কমিউনিটি</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 text-lg leading-relaxed">
                সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হও এবং একসাথে পড়াশোনা করো
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-blue-400 mb-2">১০০০+</div>
              <div className="text-gray-200">শিক্ষার্থী</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-green-400 mb-2">৫০০০+</div>
              <div className="text-gray-200">শেয়ারকৃত নোট</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-purple-400 mb-2">২৪/৭</div>
              <div className="text-gray-200">AI সহায়তা</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
