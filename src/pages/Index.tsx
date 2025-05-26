import React, { useState } from 'react';
import { Send, BookOpen, Users, Search, Upload, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            ফাকিবাজ
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            বাংলাদেশের প্রথম AI-চালিত শিক্ষা প্ল্যাটফর্ম - NCTB পাঠ্যক্রম সহায়ক ও P2P নোট শেয়ারিং সিস্টেম
          </p>
        </div>

        {/* Main AI Assistant Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-4xl font-bold text-white mb-2">
                কী শিখতে চাও?
              </CardTitle>
              <p className="text-gray-300">
                প্রশ্ন করো বাংলায় অথবা ইংরেজিতে
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Class and Subject Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                    <SelectValue placeholder="Class" />
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
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                    <SelectValue placeholder="Subject" />
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
                  placeholder="তোমার প্রশ্ন লেখো..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-16 text-lg pr-16"
                />
                <Button 
                  className="absolute right-2 top-2 h-12 w-12 bg-blue-600 hover:bg-blue-700"
                  size="icon"
                  onClick={handleAskQuestion}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  onClick={handleNavigateToNotes}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  নোট দেখো
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  onClick={handleNavigateToUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  নোট আপলোড
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  খুঁজে দেখো
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  onClick={handleNavigateToCommunity}
                >
                  <Users className="mr-2 h-4 w-4" />
                  কমিউনিটি
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Component */}
        <AIAssistant selectedClass={selectedClass} selectedSubject={selectedSubject} />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer" onClick={() => requireAuth(() => console.log('AI feature clicked'))}>
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">AI শিক্ষক</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                ২৪/৭ AI সহায়ক যে NCTB বই থেকে তোমার সব প্রশ্নের উত্তর দিবে বাংলায়
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer" onClick={handleNavigateToNotes}>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">নোট শেয়ারিং</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                অন্য ছাত্রছাত্রীদের সাথে নোট শেয়ার করো এবং একসাথে শেখো
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer" onClick={handleNavigateToCommunity}>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">কমিউনিটি</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হও এবং একসাথে পড়াশোনা করো
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
