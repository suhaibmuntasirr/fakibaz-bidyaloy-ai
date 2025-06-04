
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrendingTopic {
  id: number;
  title: string;
  subject: string;
  class: string;
  discussions: number;
  likes: number;
  trending: boolean;
  likedBy: string[];
}

const TrendingTopics = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<TrendingTopic[]>([
    {
      id: 1,
      title: 'পদার্থবিজ্ঞান - নিউটনের সূত্র',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      discussions: 234,
      likes: 156,
      trending: true,
      likedBy: []
    },
    {
      id: 2,
      title: 'গণিত - ক্যালকুলাস সমাধান',
      subject: 'গণিত',
      class: 'Class 12',
      discussions: 187,
      likes: 132,
      trending: true,
      likedBy: []
    },
    {
      id: 3,
      title: 'রসায়ন - জৈব যৌগ',
      subject: 'রসায়ন',
      class: 'Class 10',
      discussions: 145,
      likes: 98,
      trending: false,
      likedBy: []
    }
  ]);

  const handleLike = (topicId: number) => {
    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        const isLiked = topic.likedBy.includes('current-user');
        return {
          ...topic,
          likes: isLiked ? topic.likes - 1 : topic.likes + 1,
          likedBy: isLiked 
            ? topic.likedBy.filter(id => id !== 'current-user')
            : [...topic.likedBy, 'current-user']
        };
      }
      return topic;
    }));

    toast({
      title: "পছন্দ আপডেট",
      description: "আপনার প্রতিক্রিয়া সংরক্ষিত হয়েছে"
    });
  };

  const handleComment = (topicId: number) => {
    const comment = prompt('আপনার মন্তব্য লিখুন:');
    if (comment && comment.trim()) {
      setTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, discussions: topic.discussions + 1 }
          : topic
      ));

      toast({
        title: "মন্তব্য যোগ করা হয়েছে",
        description: "আপনার মন্তব্য সফলভাবে পোস্ট হয়েছে"
      });
    }
  };

  const handleShare = (topic: TrendingTopic) => {
    const shareText = `${topic.title} - ${topic.subject} (${topic.class})`;
    
    if (navigator.share) {
      navigator.share({
        title: topic.title,
        text: shareText,
        url: window.location.href
      }).then(() => {
        toast({
          title: "শেয়ার সম্পন্ন",
          description: "টপিকটি সফলভাবে শেয়ার করা হয়েছে"
        });
      }).catch(() => {
        fallbackShare(shareText);
      });
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "ক্লিপবোর্ডে কপি হয়েছে",
        description: "টপিকের লিংক কপি করা হয়েছে"
      });
    }).catch(() => {
      toast({
        title: "শেয়ার করুন",
        description: "টপিকটি ম্যানুয়ালি শেয়ার করুন",
        variant: "destructive"
      });
    });
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-yellow-400" />
          ট্রেন্ডিং টপিক
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium text-sm">{topic.title}</h3>
              {topic.trending && (
                <Badge className="bg-yellow-600/20 text-yellow-300 text-xs">
                  ট্রেন্ডিং
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-blue-300 border-blue-600/30 text-xs">
                {topic.class}
              </Badge>
              <Badge variant="outline" className="text-green-300 border-green-600/30 text-xs">
                {topic.subject}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <button
                  onClick={() => handleLike(topic.id)}
                  className={`flex items-center space-x-1 transition-colors hover:text-red-400 ${
                    topic.likedBy.includes('current-user') ? 'text-red-400' : ''
                  }`}
                >
                  <Heart className={`h-3 w-3 ${
                    topic.likedBy.includes('current-user') ? 'fill-current' : ''
                  }`} />
                  <span>{topic.likes}</span>
                </button>
                <button
                  onClick={() => handleComment(topic.id)}
                  className="flex items-center space-x-1 transition-colors hover:text-blue-400"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>{topic.discussions}</span>
                </button>
              </div>
              <button
                onClick={() => handleShare(topic)}
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Share2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
