
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Brain, Download, Star, TrendingUp, Award, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';

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
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            স্বাগতম 
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {" "}শিক্ষার্থী বন্ধুরা
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            আপনার পড়াশোনার সম্পূর্ণ সমাধান এক জায়গায়। নোট, প্রশ্ন ব্যাংক, এবং সহপাঠীদের সাথে যোগাযোগ।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              <Link to="/notes">
                <BookOpen className="mr-2 h-5 w-5" />
                নোট দেখুন
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
              <Link to="/community">
                <Users className="mr-2 h-5 w-5" />
                কমিউনিটিতে যোগ দিন
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/10 p-8">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-white mb-4">
                আজই শুরু করুন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-300 mb-8">
                হাজারো ছাত্রছাত্রীর সাথে যুক্ত হোন এবং আপনার পড়াশোনায় এগিয়ে থাকুন
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 text-lg">
                <Link to="/auth">
                  একাউন্ট তৈরি করুন
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Index;
