
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, Award } from 'lucide-react';

const CommunityStats = () => {
  const stats = [
    {
      icon: Users,
      label: 'মোট সদস্য',
      value: '12,543',
      change: '+234',
      color: 'text-blue-400'
    },
    {
      icon: BookOpen,
      label: 'শেয়ার করা নোট',
      value: '3,421',
      change: '+87',
      color: 'text-green-400'
    },
    {
      icon: MessageSquare,
      label: 'আজকের আলোচনা',
      value: '567',
      change: '+45',
      color: 'text-purple-400'
    },
    {
      icon: Award,
      label: 'সমাধান হওয়া প্রশ্ন',
      value: '8,932',
      change: '+156',
      color: 'text-yellow-400'
    }
  ];

  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">কমিউনিটি পরিসংখ্যান</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-3 bg-black/30 rounded-lg">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
                <div className="text-green-400 text-xs">+{stat.change}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityStats;
