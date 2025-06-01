
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Users, Brain, Download, Star, TrendingUp, Award, MessageSquare, Search, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import AdBanner from '@/components/AdBanner';

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'ডিজিটাল নোট',
      description: 'সব ক্লাসের নোট একসাথে পাবেন। PDF ফরম্যাটে ডাউনলোড করুন।',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Brain,
      title: 'প্রশ্ন ব্যাংক',
      description: 'বিগত বছরের প্রশ্ন এবং নমুনা প্রশ্ন অনুশীলন করুন।',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'কমিউনিটি',
      description: 'সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হোন এবং একসাথে শিখুন।',
      color: 'from-green-500 to-teal-600'
    }
  ];

  const stats = [
    { icon: Users, label: 'মোট ছাত্রছাত্রী', value: '১০,০০০+', color: 'text-blue-400' },
    { icon: BookOpen, label: 'নোট সংগ্রহ', value: '৫,০০০+', color: 'text-green-400' },
    { icon: Download, label: 'ডাউনলোড', value: '১,০০,০০০+', color: 'text-purple-400' },
    { icon: Star, label: 'রেটিং', value: '৪.৮/৫', color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      {/* Ad Banner - Only on home screen */}
      <AdBanner 
        imageUrl="/lovable-uploads/86534693-a004-4787-8ce6-8be9d4ed7603.png"
        altText="প্রমোশনাল অ্যাড"
        onClick={() => window.open('/subscription', '_blank')}
      />
      
      {/* Hero Section with Search */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ফাকিবাজ বিদ্যালয়
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI শিক্ষক, নোট শেয়ারিং, প্রশ্ন ব্যাংক এবং কমিউনিটি - সবকিছু এক জায়গায়
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="কী খুঁজছেন? (যেমন: পদার্থবিজ্ঞান নোট, গণিত প্রশ্ন)"
                className="pl-12 pr-20 py-4 text-lg bg-black/30 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              <Link to="/notes">
                <BookOpen className="mr-2 h-5 w-5" />
                নোট দেখুন
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
              <Link to="/questionbank">
                <HelpCircle className="mr-2 h-5 w-5" />
                প্রশ্ন দেখুন
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            আমাদের বৈশিষ্ট্যসমূহ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            আমাদের পরিসংখ্যান
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="mb-4">
                    <Icon className={`h-12 w-12 mx-auto ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section with theme from attachment */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 backdrop-blur-lg border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                আজই শুরু করুন আপনার শেখার যাত্রা
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                লাখো ছাত্রছাত্রীর সাথে যুক্ত হয়ে আপনার স্বপ্নের লক্ষ্য অর্জন করুন
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold rounded-xl">
                  <Link to="/auth">
                    বিনামূল্যে যোগ দিন
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 bg-black/20 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl">
                  <Link to="/subscription">
                    <Star className="mr-2 h-5 w-5" />
                    প্রিমিয়াম প্ল্যান
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Index;
