
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, MessageCircle, Heart, Share2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrendingTopics = () => {
  const { toast } = useToast();
  const [trendingTopics, setTrendingTopics] = useState([
    {
      id: 1,
      title: 'পদার্থবিজ্ঞান - নিউটনের সূত্র',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      discussions: 234,
      likes: 156,
      trending: true,
      likedBy: [],
      comments: [
        'খুবই গুরুত্বপূর্ণ টপিক!',
        'নিউটনের তৃতীয় সূত্র নিয়ে কনফিউশন আছে'
      ]
    },
    {
      id: 2,
      title: 'গণিত - ক্যালকুলাস সমাধান',
      subject: 'গণিত',
      class: 'Class 12',
      discussions: 187,
      likes: 132,
      trending: true,
      likedBy: [],
      comments: [
        'ক্যালকুলাস অনেক কঠিন লাগে',
        'অনুশীলনী ৫.২ কেউ সমাধান করেছেন?'
      ]
    },
    {
      id: 3,
      title: 'রসায়ন - জৈব যৌগ',
      subject: 'রসায়ন',
      class: 'Class 10',
      discussions: 145,
      likes: 98,
      trending: false,
      likedBy: [],
      comments: [
        'জৈব যৌগের নামকরণ কঠিন',
        'মনে রাখার কোন সহজ উপায় আছে?'
      ]
    }
  ]);

  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [newComment, setNewComment] = useState<{[key: number]: string}>({});

  const handleLike = (topicId: number) => {
    const userId = 'current-user-id';
    
    setTrendingTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        const isLiked = topic.likedBy.includes(userId);
        return {
          ...topic,
          likes: isLiked ? topic.likes - 1 : topic.likes + 1,
          likedBy: isLiked 
            ? topic.likedBy.filter(id => id !== userId)
            : [...topic.likedBy, userId]
        };
      }
      return topic;
    }));

    toast({
      title: "লাইক আপডেট",
      description: "আপনার লাইক সফলভাবে আপডেট হয়েছে",
    });
  };

  const handleComment = (topicId: number) => {
    setShowComments(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleAddComment = (topicId: number) => {
    const comment = newComment[topicId];
    if (!comment?.trim()) return;

    setTrendingTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          discussions: topic.discussions + 1,
          comments: [...topic.comments, comment]
        };
      }
      return topic;
    }));

    setNewComment(prev => ({
      ...prev,
      [topicId]: ''
    }));

    toast({
      title: "মন্তব্য যোগ হয়েছে",
      description: "আপনার মন্তব্য সফলভাবে যোগ হয়েছে",
    });
  };

  const handleShare = async (topic: any) => {
    const shareData = {
      title: topic.title,
      text: `${topic.subject} - ${topic.class} এর উপর আলোচনা`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "শেয়ার সম্পন্ন",
          description: "টপিকটি সফলভাবে শেয়ার হয়েছে",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
        toast({
          title: "লিংক কপি হয়েছে",
          description: "টপিকের লিংক ক্লিপবোর্ডে কপি হয়েছে",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "শেয়ার ত্রুটি",
        description: "শেয়ার করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
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
        {trendingTopics.map((topic) => {
          const isLiked = topic.likedBy.includes('current-user-id');
          
          return (
            <div
              key={topic.id}
              className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors">
                  {topic.title}
                </h3>
                {topic.trending && (
                  <Badge className="bg-yellow-600/20 text-yellow-300 text-xs animate-pulse">
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

              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleComment(topic.id)}
                    className="p-1 hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {topic.discussions}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(topic.id)}
                    className={`p-1 transition-colors ${
                      isLiked ? 'text-red-400' : 'hover:text-red-400'
                    }`}
                  >
                    <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    {topic.likes}
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(topic)}
                  className="p-1 hover:text-blue-400 transition-colors"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Comments Section */}
              {showComments[topic.id] && (
                <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/10">
                  <div className="space-y-2 mb-3 max-h-24 overflow-y-auto">
                    {topic.comments.map((comment, idx) => (
                      <div key={idx} className="text-xs text-gray-300 bg-black/30 rounded p-2">
                        <span className="text-blue-300 font-medium">ব্যবহারকারী:</span> {comment}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="মন্তব্য করুন..."
                      value={newComment[topic.id] || ''}
                      onChange={(e) => setNewComment(prev => ({...prev, [topic.id]: e.target.value}))}
                      className="bg-black/20 border-white/10 text-white text-xs"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(topic.id)}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(topic.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-2"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
