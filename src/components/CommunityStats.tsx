
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, Award } from 'lucide-react';

const CommunityStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 12543,
    sharedNotes: 3421,
    todayDiscussions: 567,
    solvedQuestions: 8932
  });

  const [dailyChanges, setDailyChanges] = useState({
    membersChange: 234,
    notesChange: 87,
    discussionsChange: 45,
    questionsChange: 156
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalMembers: prev.totalMembers + Math.floor(Math.random() * 5),
        sharedNotes: prev.sharedNotes + Math.floor(Math.random() * 3),
        todayDiscussions: prev.todayDiscussions + Math.floor(Math.random() * 10),
        solvedQuestions: prev.solvedQuestions + Math.floor(Math.random() * 8)
      }));

      setDailyChanges(prev => ({
        membersChange: prev.membersChange + Math.floor(Math.random() * 2),
        notesChange: prev.notesChange + Math.floor(Math.random() * 2),
        discussionsChange: prev.discussionsChange + Math.floor(Math.random() * 3),
        questionsChange: prev.questionsChange + Math.floor(Math.random() * 4)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('bn-BD');
  };

  const statsData = [
    {
      icon: Users,
      label: 'মোট সদস্য',
      value: formatNumber(stats.totalMembers),
      change: `+${dailyChanges.membersChange}`,
      color: 'text-blue-400'
    },
    {
      icon: BookOpen,
      label: 'শেয়ার করা নোট',
      value: formatNumber(stats.sharedNotes),
      change: `+${dailyChanges.notesChange}`,
      color: 'text-green-400'
    },
    {
      icon: MessageSquare,
      label: 'আজকের আলোচনা',
      value: formatNumber(stats.todayDiscussions),
      change: `+${dailyChanges.discussionsChange}`,
      color: 'text-purple-400'
    },
    {
      icon: Award,
      label: 'সমাধান হওয়া প্রশ্ন',
      value: formatNumber(stats.solvedQuestions),
      change: `+${dailyChanges.questionsChange}`,
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
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
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
