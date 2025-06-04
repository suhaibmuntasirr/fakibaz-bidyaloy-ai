
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, Users, TrendingUp, Calendar, Search, Plus, Video, MessageSquare, BookOpen, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CommunityStats from '@/components/CommunityStats';
import TrendingTopics from '@/components/TrendingTopics';
import StudyGroups from '@/components/StudyGroups';
import StudyGroupManager from '@/components/StudyGroupManager';
import AIToggle from '@/components/AIToggle';
import { useToast } from '@/hooks/use-toast';

const Community = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: 'রহিম আহমেদ',
      avatar: '/placeholder.svg',
      time: '২ ঘণ্টা আগে',
      content: 'গণিতের একটি কঠিন সমস্যা সমাধানে সাহায্য প্রয়োজন। কেউ কি দ্বিঘাত সমীকরণের সহজ পদ্ধতি জানেন?',
      likes: 15,
      comments: 8,
      shares: 3,
      liked: false,
      subject: 'গণিত',
      class: 'Class 10'
    },
    {
      id: '2',
      author: 'সালমা খাতুন',
      avatar: '/placeholder.svg',
      time: '৪ ঘণ্টা আগে',
      content: 'পদার্থবিজ্ঞানের গতি অধ্যায়ের জন্য চমৎকার একটি নোট তৈরি করেছি। সবাই দেখতে পারেন এবং মতামত দিতে পারেন।',
      likes: 32,
      comments: 12,
      shares: 7,
      liked: true,
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11'
    }
  ]);
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
    
    toast({
      title: "পোস্ট লাইক করা হয়েছে",
      description: "আপনার প্রতিক্রিয়া সংরক্ষিত হয়েছে"
    });
  };

  const handleComment = (postId: string) => {
    const comment = prompt('আপনার মন্তব্য লিখুন:');
    if (comment) {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
      
      toast({
        title: "মন্তব্য যোগ করা হয়েছে",
        description: "আপনার মন্তব্য সফলভাবে যোগ হয়েছে"
      });
    }
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    
    toast({
      title: "পোস্ট শেয়ার করা হয়েছে",
      description: "পোস্টটি সফলভাবে শেয়ার হয়েছে"
    });
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now().toString(),
        author: 'আপনি',
        avatar: '/placeholder.svg',
        time: 'এখনই',
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        subject: 'সাধারণ',
        class: 'সব ক্লাস'
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      
      toast({
        title: "পোস্ট তৈরি হয়েছে",
        description: "আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            কমিউনিটি সেন্টার
          </h1>
          <p className="text-gray-300 text-lg">
            শিক্ষার্থীদের সাথে আলোচনা, প্রশ্ন-উত্তর এবং জ্ঞান ভাগাভাগি করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <CommunityStats />
            <TrendingTopics />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  নতুন পোস্ট তৈরি করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="আপনার প্রশ্ন বা মতামত শেয়ার করুন..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                />
                <Button 
                  onClick={handleCreatePost}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  পোস্ট করুন
                </Button>
              </CardContent>
            </Card>

            {/* Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-black/20 backdrop-blur-lg border border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {post.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold">{post.author}</h3>
                          <Badge className="bg-blue-600/30 text-blue-300">
                            {post.subject}
                          </Badge>
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            {post.class}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{post.time}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">{post.content}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleComment(post.id)}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>{post.comments}</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <Share2 className="h-5 w-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StudyGroups />
            <StudyGroupManager />
          </div>
        </div>
      </div>
      
      <AIToggle />
    </div>
  );
};

export default Community;
