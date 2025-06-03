
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, Award } from 'lucide-react';

const CommunityStats = () => {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: 'মোট সদস্য',
      value: '12,543',
      change: '+234',
      color: 'text-blue-400',
      increment: 2
    },
    {
      icon: BookOpen,
      label: 'শেয়ার করা নোট',
      value: '3,421',
      change: '+87',
      color: 'text-green-400',
      increment: 1
    },
    {
      icon: MessageSquare,
      label: 'আজকের আলোচনা',
      value: '567',
      change: '+45',
      color: 'text-purple-400',
      increment: 3
    },
    {
      icon: Award,
      label: 'সমাধান হওয়া প্রশ্ন',
      value: '8,932',
      change: '+156',
      color: 'text-yellow-400',
      increment: 5
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          const currentValue = parseInt(stat.value.replace(',', ''));
          const newValue = currentValue + stat.increment;
          const change = parseInt(stat.change.replace('+', '')) + stat.increment;
          
          return {
            ...stat,
            value: newValue.toLocaleString(),
            change: `+${change}`
          };
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
              <div key={index} className="text-center p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors cursor-pointer">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-white font-bold text-lg animate-pulse">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
                <div className="text-green-400 text-xs font-semibold">{stat.change}</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400 mb-2">লাইভ আপডেট</div>
          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityStats;
