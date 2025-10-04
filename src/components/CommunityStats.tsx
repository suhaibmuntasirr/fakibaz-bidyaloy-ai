
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommunityStats = () => {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: 'মোট সদস্য',
      value: '12,543',
      change: '+234',
      color: 'text-blue-400',
      count: 12543
    },
    {
      icon: BookOpen,
      label: 'শেয়ার করা নোট',
      value: '3,421',
      change: '+87',
      color: 'text-green-400',
      count: 3421
    },
    {
      icon: MessageSquare,
      label: 'আজকের আলোচনা',
      value: '567',
      change: '+45',
      color: 'text-purple-400',
      count: 567
    },
    {
      icon: Award,
      label: 'সমাধান হওয়া প্রশ্ন',
      value: '8,932',
      change: '+156',
      color: 'text-yellow-400',
      count: 8932
    }
  ]);

  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          const increment = Math.floor(Math.random() * 3) + 1; // Random 1-3
          const newCount = stat.count + increment;
          const change = parseInt(stat.change.replace('+', '')) + increment;
          
          return {
            ...stat,
            count: newCount,
            value: newCount.toLocaleString(),
            change: `+${change}`
          };
        })
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStatClick = (statLabel: string) => {
    toast({
      title: "পরিসংখ্যান দেখা হচ্ছে",
      description: `${statLabel} এর বিস্তারিত তথ্য লোড হচ্ছে...`,
    });
  };

  return (
    <Card className="bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-white">কমিউনিটি পরিসংখ্যান</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/40 transition-all duration-200"
                onClick={() => handleStatClick(stat.label)}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
                <div className="text-green-400 text-xs">{stat.change}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityStats;
