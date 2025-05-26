
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Star, MessageCircle, BookOpen, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { firebaseService, UserProfile } from '@/services/firebaseService';
import { useAuth } from '@/contexts/AuthContext';

const Community = () => {
  const [topContributors, setTopContributors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const contributors = await firebaseService.getLeaderboard(10);
        setTopContributors(contributors);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Gold':
      case 'গোল্ড':
        return 'bg-yellow-500 text-black';
      case 'Silver':
      case 'সিলভার':
        return 'bg-gray-400 text-black';
      case 'Bronze':
      case 'ব্রোঞ্জ':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getBadgeText = (badge: string) => {
    const badgeMap: { [key: string]: string } = {
      'Gold': 'গোল্ড',
      'Silver': 'সিলভার',
      'Bronze': 'ব্রোঞ্জ',
      'Platinum': 'প্লাটিনাম'
    };
    return badgeMap[badge] || badge;
  };

  const recentActivities = [
    { user: 'রাহুল আহমেদ', action: 'নতুন নোট আপলোড করেছে', subject: 'গণিত - Class 9', time: '২ ঘণ্টা আগে' },
    { user: 'সারা খান', action: 'নোটে কমেন্ট করেছে', subject: 'পদার্থবিজ্ঞান - Class 11', time: '৩ ঘণ্টা আগে' },
    { user: 'তানিয়া রহমান', action: 'নোট পছন্দ করেছে', subject: 'বাংলা - Class 8', time: '৫ ঘণ্টা আগে' },
    { user: 'করিম উদ্দিন', action: 'প্রশ্ন করেছে AI শিক্ষককে', subject: 'রসায়ন - Class 10', time: '৬ ঘণ্টা আগে' }
  ];

  const handleSocialLink = (platform: string) => {
    const links = {
      discord: 'https://discord.gg/fakibaz-community',
      whatsapp: 'https://chat.whatsapp.com/fakibaz-group',
      messenger: 'https://m.me/fakibaz.community'
    };
    
    window.open(links[platform as keyof typeof links], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">ফাকিবাজ কমিউনিটি</h1>
          <p className="text-gray-300 text-lg">সবার সাথে যুক্ত হও এবং একসাথে শেখো</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">{topContributors.length || '১২,৫০০'}+</h3>
              <p className="text-gray-300">সক্রিয় সদস্য</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">৮,৭৫০+</h3>
              <p className="text-gray-300">শেয়ার করা নোট</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">২৫,০০০+</h3>
              <p className="text-gray-300">প্রশ্ন উত্তর</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">৯৮%</h3>
              <p className="text-gray-300">সন্তুষ্টির হার</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                লিডারবোর্ড
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-300 py-8">
                    লোড হচ্ছে...
                  </div>
                ) : topContributors.length > 0 ? (
                  topContributors.map((contributor, index) => (
                    <div key={contributor.uid} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{contributor.fullName}</h4>
                          <p className="text-gray-300 text-sm">{contributor.notesUploaded} টি নোট • {contributor.questionsUploaded} টি প্রশ্ন</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{contributor.points} পয়েন্ট</div>
                        <div className={`text-xs px-2 py-1 rounded ${getBadgeColor(contributor.badge)}`}>
                          {getBadgeText(contributor.badge)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-300 py-8">
                    এখনো কোন ডেটা নেই
                  </div>
                )}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                সম্পূর্ণ লিস্ট দেখো
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
                সাম্প্রতিক কার্যকলাপ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-blue-300 text-sm">{activity.subject}</p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                আরো দেখো
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Join Community CTA */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border-white/20 mt-8">
          <CardContent className="pt-8 text-center">
            <Users className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              ফাকিবাজ কমিউনিটিতে যোগ দাও!
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              হাজারো ছাত্রছাত্রীর সাথে যুক্ত হয়ে নোট শেয়ার করো, প্রশ্ন করো এবং একসাথে শেখো।
              তোমার জ্ঞান ভাগ করে নাও এবং অন্যদের সাহায্য করো।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                onClick={() => handleSocialLink('discord')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Discord এ যোগ দাও
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                onClick={() => handleSocialLink('whatsapp')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp গ্রুপ
              </Button>
              <Button 
                variant="outline" 
                className="bg-blue-600 hover:bg-blue-700 border-blue-500/20 text-white px-8 py-3"
                onClick={() => handleSocialLink('messenger')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Messenger
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
