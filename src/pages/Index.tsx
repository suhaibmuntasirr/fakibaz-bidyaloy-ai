import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Star, Award, Users, Trophy, Crown, Menu, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClassSelection from '@/components/ClassSelection';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Settings, LogOut, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import NotificationPanel from '@/components/NotificationPanel';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const hasUnreadNotifications = true;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] text-white">
      <Navbar />
      
      {/* Ad Banner - Only on home page */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-white font-medium">🎉 বিশেষ অফার! প্রিমিয়াম সাবস্ক্রিপশন এখন ৫০% ছাড়ে!</span>
            <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              বিস্তারিত
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-extrabold text-white mb-6">
            আপনার শেখার যাত্রাকে সহজ করুন
          </h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            নোট, প্রশ্নপত্র এবং আরও অনেক শিক্ষামূলক সামগ্রী এক জায়গায় খুঁজুন।
            আজই শুরু করুন এবং আপনার পড়াশোনাকে আরও কার্যকর করুন।
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-xl text-lg font-medium"
          >
            বিনামূল্যে শুরু করুন
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#28282B] to-transparent"></div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">কি খুঁজছেন?</h2>
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 h-6 w-6 text-white/70" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোট, প্রশ্ন বা বিষয় খুঁজুন..."
              className="pl-12 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={() => navigate('/notes')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-medium"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              নোট দেখুন
            </Button>
            
            <Button
              onClick={() => navigate('/question-bank')}
              className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl text-lg font-medium"
            >
              <FileText className="mr-2 h-5 w-5" />
              প্রশ্ন দেখুন
            </Button>
          </div>

          <ClassSelection onSelect={setSelectedClass} />
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
                সহজ ভাষায় লেখা নোট এবং সারাংশ দিয়ে যেকোনো বিষয় সহজে বুঝুন।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">প্রশ্ন ব্যাংক</h3>
              <p className="text-gray-300">
                বিভিন্ন পরীক্ষার প্রশ্নপত্র দিয়ে নিজেকে প্রস্তুত করুন।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">কমিউনিটি</h3>
              <p className="text-gray-300">
                অন্যান্য শিক্ষার্থীদের সাথে আলোচনা করুন এবং সাহায্য পান।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {/* Stat 1 */}
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">১০,০০০+</div>
              <p className="text-gray-300">নোট আপলোড করা হয়েছে</p>
            </div>

            {/* Stat 2 */}
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">৫,০০০+</div>
              <p className="text-gray-300">প্রশ্নপত্র রয়েছে</p>
            </div>

            {/* Stat 3 */}
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">২,০০০+</div>
              <p className="text-gray-300">শিক্ষার্থী যুক্ত আছে</p>
            </div>

            {/* Stat 4 */}
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">১০০+</div>
              <p className="text-gray-300">শিক্ষক দ্বারা তৈরি</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with new theme */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/48bd98a0-c7ee-4b45-adf1-cca6b79289b4.png" 
              alt="Book Icon"
              className="w-20 h-20 mr-4"
            />
            <h2 className="text-4xl font-bold text-white">আজই শুরু করুন আপনার শেখার যাত্রা</h2>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            হাজারো নোট, প্রশ্ন এবং শিক্ষামূলক সামগ্রী এখনই আপনার হাতের মুঠোয়। 
            বিনামূল্যে যোগ দিন এবং আপনার পড়াশোনাকে আরো সহজ করুন।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Star className="mr-2 h-5 w-5" />
              বিনামূল্যে যোগ দিন
            </Button>
            
            <Button 
              onClick={() => navigate('/subscription')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Award className="mr-2 h-5 w-5" />
              প্রিমিয়াম দেখুন
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">সহজ শিক্ষা</h3>
              <p className="text-gray-300 text-sm">বিভিন্ন বিষয়ের সহজবোধ্য নোট ও ব্যাখ্যা</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">কমিউনিটি</h3>
              <p className="text-gray-300 text-sm">সহপাঠীদের সাথে জ্ঞান ভাগাভাগি করুন</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">সফলতা</h3>
              <p className="text-gray-300 text-sm">পরীক্ষায় ভাল ফলাফলের জন্য প্রস্তুতি</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
