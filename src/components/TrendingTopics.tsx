
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrendingTopics = () => {
  const [trendingTopics, setTrendingTopics] = useState([
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

  const { toast } = useToast();

  const handleLike = (topicId: number) => {
    setTrendingTopics(prev => 
      prev.map(topic => {
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
      })
    );

    const topic = trendingTopics.find(t => t.id === topicId);
    const isLiked = topic?.likedBy.includes('current-user');
    
    toast({
      title: isLiked ? "লাইক সরানো হয়েছে" : "লাইক দেওয়া হয়েছে",
      description: `"${topic?.title}" ${isLiked ? 'থেকে লাইক সরানো হয়েছে' : 'কে লাইক দেওয়া হয়েছে'}`,
    });
  };

  const handleComment = (topicId: number) => {
    const topic = trendingTopics.find(t => t.id === topicId);
    setTrendingTopics(prev => 
      prev.map(t => 
        t.id === topicId 
          ? { ...t, discussions: t.discussions + 1 }
          : t
      )
    );
    
    toast({
      title: "মন্তব্য যোগ করা হয়েছে",
      description: `"${topic?.title}" এ আপনার মন্তব্য যোগ করা হয়েছে`,
    });
  };

  const handleShare = async (topicId: number) => {
    const topic = trendingTopics.find(t => t.id === topicId);
    if (!topic) return;

    const shareText = `${topic.title} - ${topic.subject} (${topic.class})\n\nFakibaz বিদ্যালয়ে আলোচনা চলছে!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ফাকিবাজ বিদ্যালয় - ট্রেন্ডিং টপিক',
          text: shareText,
          url: window.location.href
        });
        toast({
          title: "শেয়ার করা হয়েছে",
          description: "টপিকটি সফলভাবে শেয়ার করা হয়েছে",
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyToClipboard(shareText);
        }
      }
    } else {
      handleCopyToClipboard(shareText);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "লিংক কপি হয়েছে",
        description: "টপিকের লিংক ক্লিপবোর্ডে কপি করা হয়েছে",
      });
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast({
        title: "কপি করতে সমস্যা",
        description: "লিংক কপি করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-yellow-400" />
          ট্রেন্ডিং টপিক
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingTopics.map((topic) => (
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

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleComment(topic.id)}
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {topic.discussions}
                </button>
                <button
                  onClick={() => handleLike(topic.id)}
                  className={`flex items-center transition-colors ${
                    topic.likedBy.includes('current-user') 
                      ? 'text-red-400' 
                      : 'hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-3 w-3 mr-1 ${topic.likedBy.includes('current-user') ? 'fill-current' : ''}`} />
                  {topic.likes}
                </button>
              </div>
              <button 
                onClick={() => handleShare(topic.id)}
                className="hover:text-blue-400 transition-colors"
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
