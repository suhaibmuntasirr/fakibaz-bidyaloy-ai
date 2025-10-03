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
    console.log('Authentication successful');
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-400" />,
      title: 'বিনামূল্যে নোট অ্যাক্সেস',
      description: 'হাজারো নোট এবং প্রশ্নব্যাংকে বিনামূল্যে প্রবেশাধিকার পান',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: 'কমিউনিটি সাপোর্ট',
      description: 'সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হয়ে একসাথে শিখুন',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: 'AI শিক্ষা সহায়ক',
      description: '২৪/৭ AI সহায়ক যে আপনার সব প্রশ্নের উত্তর দিবে বাংলায়',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: <Star className="h-8 w-8 text-purple-400" />,
      title: 'ব্যক্তিগত প্রগ্রেস ট্র্যাকিং',
      description: 'আপনার শিক্ষার অগ্রগতি ট্র্যাক করুন এবং লক্ষ্য নির্ধারণ করুন',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: <Target className="h-8 w-8 text-red-400" />,
      title: 'লক্ষ্য অর্জনের সহায়তা',
      description: 'আপনার একাডেমিক লক্ষ্য পূরণে পরিকল্পিত গাইডলাইন পান',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Shield className="h-8 w-8 text-cyan-400" />,
      title: 'নিরাপদ ও বিশ্বস্ত',
      description: 'আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয়তা সুরক্ষিত',
      gradient: 'from-pink-500 to-rose-600'
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
              {features.map((feature, index) => {
                const colorSet = {
                  gradient: feature.gradient,
                  border: feature.gradient.includes('cyan') ? 'rgba(34,211,238,0.6)' :
                    feature.gradient.includes('purple') ? 'rgba(168,85,247,0.6)' :
                    feature.gradient.includes('green') ? 'rgba(20,184,166,0.6)' :
                    feature.gradient.includes('orange') ? 'rgba(239,68,68,0.6)' :
                    feature.gradient.includes('blue') ? 'rgba(99,102,241,0.6)' :
                    'rgba(244,63,94,0.6)'
                };

                return (
                  <Card 
                    key={index} 
                    className="relative bg-transparent backdrop-blur-xl hover:border-opacity-80 transition-all duration-300 overflow-hidden rounded-3xl"
                    style={{
                      border: '2px solid transparent',
                      borderRadius: '24px',
                      backgroundImage: `linear-gradient(#1a1a2e, #1a1a2e), 
                        linear-gradient(to bottom, rgba(255,255,255,0.8), ${colorSet.border})`,
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box'
                    }}
                  >
                    {/* Oval Header - 15% height */}
                    <div 
                      className={`relative h-[15%] min-h-[60px] bg-gradient-to-r ${colorSet.gradient} flex items-center justify-center rounded-t-3xl overflow-hidden`}
                    >
                      <div className="absolute inset-0 backdrop-blur-md"></div>
                      {/* Blur effect below oval */}
                      <div 
                        className="absolute left-0 right-0 h-20 -bottom-10"
                        style={{
                          background: `linear-gradient(to bottom, ${
                            colorSet.gradient.includes('cyan') ? 'rgba(34,211,238,0.5)' :
                            colorSet.gradient.includes('purple') ? 'rgba(168,85,247,0.5)' :
                            colorSet.gradient.includes('green') ? 'rgba(20,184,166,0.5)' :
                            colorSet.gradient.includes('orange') ? 'rgba(239,68,68,0.5)' :
                            colorSet.gradient.includes('blue') ? 'rgba(99,102,241,0.5)' :
                            'rgba(244,63,94,0.5)'
                          }, transparent)`,
                          filter: 'blur(15px)'
                        }}
                      ></div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 text-center pt-8">
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
                );
              })}
            </div>

            {/* Stats Section */}
            <Card className="bg-gradient-to-br from-black/40 to-indigo-900/30 backdrop-blur-lg border border-white/10 rounded-3xl">
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
            <Card 
              className="w-full max-w-md bg-transparent backdrop-blur-xl shadow-2xl rounded-3xl"
              style={{
                border: '2px solid transparent',
                borderRadius: '24px',
                backgroundImage: `linear-gradient(#1a1a2e, #1a1a2e), 
                  linear-gradient(135deg, rgba(255,255,255,0.8), rgba(147,197,253,0.6), rgba(59,130,246,0.6), rgba(147,51,234,0.6), rgba(236,72,153,0.6))`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
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
          <Card className="bg-gradient-to-br from-black/40 to-emerald-900/30 backdrop-blur-lg border border-white/10 rounded-3xl">
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
