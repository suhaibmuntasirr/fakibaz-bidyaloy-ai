
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Star, Award, Users, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClassSelection from '@/components/ClassSelection';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import AIToggle from '@/components/AIToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "খালি সার্চ",
        description: "অনুগ্রহ করে কিছু লিখে সার্চ করুন",
        variant: "destructive"
      });
      return;
    }

    // Navigate to notes page with search query
    navigate(`/notes?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] text-white">
      <Navbar />
      
      {/* Ad Banner below navbar */}
      <AdBanner 
        imageUrl="/lovable-uploads/e283b105-0747-4859-9cef-ef35fb06dd9d.png"
        altText="বিশেষ অফার"
        onClick={() => console.log('Ad clicked')}
      />

      {/* Hero Section with Full Width Gradient Background */}
      <section className="relative py-12 px-4 text-center">
        {/* Full Width Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-indigo-900/30"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            কি শিখতে চাও?
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            AI শিক্ষক, নোট শেয়ারিং, প্রশ্ন ব্যাংক এবং কমিউনিটি - সবকিছু এক জায়গায়
          </p>

          {/* Search Section with reduced spacing */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-4 h-6 w-6 text-white/70" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="কি খুঁজছেন? (যেমন: পদার্থবিজ্ঞান নোট, গণিত প্রশ্ন)"
              className="pl-12 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl backdrop-blur-lg"
            />
            <Button 
              onClick={handleSearch}
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700"
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

      {/* Class Selection with better spacing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-12">যে কোন ক্লাসের নোট পাও এখানেই</h2>
          <ClassSelection />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">আমাদের বৈশিষ্ট্য</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">নোট এবং সারাংশ</h3>
              <p className="text-gray-300">
                সহজ ভাষায় লেখা নোট এবং সারাংশ।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">প্রশ্ন ব্যাংক</h3>
              <p className="text-gray-300">
                বিভিন্ন পরীক্ষার প্রশ্নপত্র।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">কমিউনিটি</h3>
              <p className="text-gray-300">
                অন্যান্য শিক্ষার্থীদের সাথে আলোচনা।
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
      
      <AIToggle />
    </div>
  );
};

export default Index;
