
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Star, Award, Users, Trophy, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClassSelection from '@/components/ClassSelection';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import heroBackground from '@/assets/hero-background.png';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "অনুসন্ধান করুন",
        description: "অনুগ্রহ করে কিছু লিখে অনুসন্ধান করুন",
        variant: "destructive"
      });
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "অনুসন্ধান করতে প্রথমে লগইন করুন",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    // Navigate to notes page with search query
    navigate(`/notes?search=${encodeURIComponent(searchQuery)}`);
    
    toast({
      title: "অনুসন্ধান চালু",
      description: `"${searchQuery}" এর জন্য ফলাফল খুঁজছি...`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="fixed inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Ad Banner below navbar with top padding */}
        <div className="pt-24">
          <AdBanner 
            imageUrl="/lovable-uploads/e283b105-0747-4859-9cef-ef35fb06dd9d.png"
            altText="বিশেষ অফার"
            onClick={() => console.log('Ad clicked')}
          />
        </div>

        {/* Hero Section with Enhanced Glass Effects */}
        <section className="relative py-12 px-4 text-center">
          {/* Additional gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            কি শিখতে চাও?
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            AI শিক্ষক, নোট শেয়ারিং, প্রশ্ন ব্যাংক এবং কমিউনিটি - সবকিছু এক জায়গায়
          </p>

          {/* Wider Glass Search Bar with Bengali Suggestions */}
          <div className="relative mb-6 max-w-4xl mx-auto">
            <Search className="absolute left-4 top-4 h-6 w-6 text-white/70" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="কি খুঁজছেন? (যেমন: পদার্থবিজ্ঞান নোট, গণিত প্রশ্ন)"
              className="pl-12 py-4 text-lg bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/50 rounded-full hover:border-white/20 focus:border-white/30 transition-all duration-300 w-full"
            />
            <Button 
              className="absolute right-2 top-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border-0 rounded-full w-10 h-10 p-0"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => navigate('/notes')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg font-medium backdrop-blur-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              নোট দেখুন
            </Button>
            
            <Button
              onClick={() => navigate('/question-bank')}
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl text-lg font-medium backdrop-blur-lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              প্রশ্ন দেখুন
            </Button>
          </div>
          </div>
        </section>

        {/* Class Selection with Enhanced Glass Effects */}
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                যে কোন ক্লাসের নোট পাও এখানেই
              </h2>
              <p className="text-lg text-gray-300/80">আপনার শিক্ষার স্তর অনুযায়ী নোট ও সম্পদ খুঁজুন</p>
            </div>
            <ClassSelection />
          </div>
        </section>

        {/* Quick Actions Glass Cards - Below Class Selection */}
        <section className="py-8 px-4 relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Upload Notes Card */}
              <div 
                className="group bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-105 rounded-2xl p-4"
                onClick={() => navigate('/notes?upload=true')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-base">আপনার নোট আপলোড করুন</h3>
                      <p className="text-gray-300/80 text-sm">আপনার নোট শেয়ার করুন</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Exam Questions Card */}
              <div 
                className="group bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-105 rounded-2xl p-4"
                onClick={() => navigate('/question-bank')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-base">স্কুলের প্রশ্নে পরীক্ষা দিন</h3>
                      <p className="text-gray-300/80 text-sm">বিভিন্ন বিষয়ের প্রশ্ন সমাধান করুন</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Group Study Card */}
              <div 
                className="group bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-105 rounded-2xl p-4"
                onClick={() => navigate('/community')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-base">গ্রুপ স্টাডি করুন</h3>
                      <p className="text-gray-300/80 text-sm">অন্যদের সাথে মিলে পড়াশোনা করুন</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">আমাদের বৈশিষ্ট্য</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            <h3 className="text-xl font-semibold mb-2">নোট ও সারাংশ</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                সহজ ভাষায় লেখা নোট এবং সারাংশ সবার জন্য উপলব্ধ।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-white" />
              </div>
            <h3 className="text-xl font-semibold mb-2">প্রশ্ন ব্যাংক</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                বিভিন্ন পরীক্ষার প্রশ্নপত্র ও সমাধান।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-white" />
              </div>
            <h3 className="text-xl font-semibold mb-2">কমিউনিটি</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                অন্যান্য শিক্ষার্থীদের সাথে আলোচনা ও সহায়তা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with gradient extending to footer */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50 relative">
        {/* Gradient that extends to footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">আজই শুরু করুন</h2>
          <p className="text-xl text-gray-300 mb-8">
            বিনামূল্যে যোগ দিন এবং আপনার পড়াশোনাকে সহজ করুন।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Star className="mr-2 h-5 w-5" />
              বিনামূল্যে যোগ দিন
            </Button>
          </div>
        </div>
      </section>

        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
