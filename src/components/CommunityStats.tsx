
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageCircle, Trophy, TrendingUp, Star } from 'lucide-react';

const CommunityStats = () => {
  const stats = [
    {
      icon: Users,
      label: 'সক্রিয় সদস্য',
      value: '১২,৫৪৩',
      change: '+১৮%',
      color: 'text-blue-400'
    },
    {
      icon: BookOpen,
      label: 'শেয়ারকৃত নোট',
      value: '৮,৯৮৭',
      change: '+২৫%',
      color: 'text-green-400'
    },
    {
      icon: MessageCircle,
      label: 'আলোচনা',
      value: '৪,৬৭২',
      change: '+১২%',
      color: 'text-purple-400'
    },
    {
      icon: Trophy,
      label: 'সমাধানকৃত প্রশ্ন',
      value: '৩,২১১',
      change: '+৩১%',
      color: 'text-yellow-400'
    }
  ];

  return (
    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
          কমিউনিটি পরিসংখ্যান
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-gray-700/50 ${stat.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                    <p className="text-white font-semibold text-lg">{stat.value}</p>
                  </div>
                </div>
                <div className="text-green-400 text-sm font-medium">
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CommunityStats;
