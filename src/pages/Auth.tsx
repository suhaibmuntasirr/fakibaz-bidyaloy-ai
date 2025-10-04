import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Users, Star, Target, Shield, Zap } from 'lucide-react';
import heroBackground from '@/assets/hero-background.png';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');

  const handleAuthSuccess = () => {
    // Handle successful authentication - could redirect to dashboard
    console.log('Authentication successful');
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-400" />,
      title: 'বিনামূল্যে নোট অ্যাক্সেস',
      description: 'হাজারো নোট এবং প্রশ্নব্যাংকে বিনামূল্যে প্রবেশাধিকার পান'
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: 'কমিউনিটি সাপোর্ট',
      description: 'সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হয়ে একসাথে শিখুন'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: 'AI শিক্ষা সহায়ক',
      description: '২৪/৭ AI সহায়ক যে আপনার সব প্রশ্নের উত্তর দিবে বাংলায়'
    },
    {
      icon: <Star className="h-8 w-8 text-purple-400" />,
      title: 'ব্যক্তিগত প্রগ্রেস ট্র্যাকিং',
      description: 'আপনার শিক্ষার অগ্রগতি ট্র্যাক করুন এবং লক্ষ্য নির্ধারণ করুন'
    },
    {
      icon: <Target className="h-8 w-8 text-red-400" />,
      title: 'লক্ষ্য অর্জনের সহায়তা',
      description: 'আপনার একাডেমিক লক্ষ্য পূরণে পরিকল্পিত গাইডলাইন পান'
    },
    {
      icon: <Shield className="h-8 w-8 text-cyan-400" />,
      title: 'নিরাপদ ও বিশ্বস্ত',
      description: 'আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয়তা সুরক্ষিত'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                ফাকিবাজে স্বাগতম
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                বাংলাদেশের সবচেয়ে বড় শিক্ষা প্ল্যাটফর্মে যোগ দিন এবং আপনার শিক্ষার যাত্রা শুরু করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className={`bg-gradient-to-br ${
                  index === 0 ? 'from-black/40 to-blue-900/30' :
                  index === 1 ? 'from-black/40 to-green-900/30' :
                  index === 2 ? 'from-black/40 to-yellow-900/30' :
                  index === 3 ? 'from-black/40 to-purple-900/30' :
                  index === 4 ? 'from-black/40 to-red-900/30' :
                  'from-black/40 to-cyan-900/30'
                } backdrop-blur-lg border-2 border-transparent bg-clip-padding relative
                  before:absolute before:inset-0 before:-z-10 before:rounded-lg before:p-[2px]
                  before:bg-gradient-to-r before:from-white before:via-blue-400 before:via-blue-600 before:via-purple-600 before:via-pink-500 before:to-pink-400
                  hover:border-white/20 transition-all duration-300`}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Section */}
            <Card className="bg-gradient-to-br from-black/40 to-indigo-900/30 backdrop-blur-lg border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  আমাদের কমিউনিটি
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">১০,০০০+</div>
                    <div className="text-gray-300 text-sm">শিক্ষার্থী</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">৫০,০০০+</div>
                    <div className="text-gray-300 text-sm">শেয়ারকৃত নোট</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">২৪/৭</div>
                    <div className="text-gray-300 text-sm">AI সহায়তা</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-transparent backdrop-blur-xl border-2 border-transparent bg-clip-padding relative shadow-2xl
              before:absolute before:inset-0 before:-z-10 before:rounded-lg before:p-[2px]
              before:bg-gradient-to-r before:from-white before:via-blue-400 before:via-blue-600 before:via-purple-600 before:via-pink-500 before:to-pink-400">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {activeTab === 'login' ? 'লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
                </CardTitle>
                <p className="text-gray-300">
                  {activeTab === 'login' 
                    ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' 
                    : 'ফ্রি অ্যাকাউন্ট তৈরি করে শুরু করুন'}
                </p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-lg border border-white/10">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white"
                    >
                      লগইন
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 text-white"
                    >
                      রেজিস্ট্রেশন
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="mt-6">
                    <LoginForm onSuccess={handleAuthSuccess} />
                  </TabsContent>
                  
                  <TabsContent value="register" className="mt-6">
                    <RegisterForm onSuccess={handleAuthSuccess} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-black/40 to-emerald-900/30 backdrop-blur-lg border border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-emerald-400 text-4xl mb-4">"</div>
              <p className="text-gray-200 text-lg mb-4 max-w-3xl mx-auto">
                ফাকিবাজ ব্যবহার করে আমার পড়াশোনায় অনেক উন্নতি হয়েছে। AI শিক্ষক সবসময় সাহায্য করে এবং অন্য ছাত্রছাত্রীদের নোট পেয়ে অনেক উপকার হয়েছে।
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  আ
                </div>
                <div>
                  <h4 className="text-white font-semibold">আহমেদ হাসান</h4>
                  <p className="text-gray-400 text-sm">Class 10, মতিঝিল সরকারি উচ্চ বিদ্যালয়</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
