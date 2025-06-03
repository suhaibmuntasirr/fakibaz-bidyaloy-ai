
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Users, Star, TrendingUp, BookOpen, Share2, Send, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CommunityStats from '@/components/CommunityStats';
import TrendingTopics from '@/components/TrendingTopics';
import StudyGroups from '@/components/StudyGroups';
import AIToggle from '@/components/AIToggle';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  subject: string;
  class: string;
  likes: number;
  replies: number;
  timeAgo: string;
  tags: string[];
  likedBy: string[];
}

const Community = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'গণিতের জটিল সমস্যা সমাধানের টিপস',
      content: 'আমি গণিতের জটিল সমস্যা সমাধানে কিছু কার্যকর পদ্ধতি শেয়ার করতে চাই। প্রথমে সমস্যাটি ভাগ করে নিতে হবে...',
      author: 'আহমেদ রহমান',
      subject: 'গণিত',
      class: 'Class 10',
      likes: 45,
      replies: 12,
      timeAgo: '২ ঘন্টা আগে',
      tags: ['টিপস', 'সমাধান', 'গণিত'],
      likedBy: []
    },
    {
      id: '2',
      title: 'পদার্থবিজ্ঞানের পরীক্ষার প্রস্তুতি',
      content: 'HSC পদার্থবিজ্ঞান পরীক্ষার জন্য কিভাবে প্রস্তুতি নিতে হবে? কোন টপিকগুলো বেশি গুরুত্বপূর্ণ?',
      author: 'ফাতেমা খাতুন',
      subject: 'পদার্থবিজ্ঞান',
      class: 'HSC',
      likes: 32,
      replies: 8,
      timeAgo: '৫ ঘন্টা আগে',
      tags: ['পরীক্ষা', 'প্রস্তুতি', 'HSC'],
      likedBy: []
    },
    {
      id: '3',
      title: 'ইংরেজি গ্রামার শেখার সহজ উপায়',
      content: 'ইংরেজি গ্রামারে দুর্বল? এই পোস্টে আমি কিছু সহজ পদ্ধতি শেয়ার করব যা আমাকে অনেক সাহায্য করেছে।',
      author: 'করিম উদ্দিন',
      subject: 'ইংরেজি',
      class: 'Class 9',
      likes: 28,
      replies: 15,
      timeAgo: '১ দিন আগে',
      tags: ['গ্রামার', 'ইংরেজি', 'শিক্ষা'],
      likedBy: []
    }
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const filteredPosts = posts.filter(post => {
    return (
      (searchQuery === '' || 
       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSubject === 'all' || post.subject === selectedSubject)
    );
  });

  const handleLike = (postId: string) => {
    const userId = 'current-user-id';
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId]
        };
      }
      return post;
    }));

    toast({
      title: "লাইক আপডেট",
      description: "আপনার লাইক সফলভাবে আপডেট হয়েছে",
    });
  };

  const handleShare = async (post: Post) => {
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 100) + '...',
      url: window.location.href + `#post-${post.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "শেয়ার সম্পন্ন",
          description: "পোস্টটি সফলভাবে শেয়ার হয়েছে",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
        toast({
          title: "লিংক কপি হয়েছে",
          description: "পোস্টের লিংক ক্লিপবোর্ডে কপি হয়েছে",
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

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "শিরোনাম এবং বিষয়বস্তু উভয়ই প্রয়োজন",
        variant: "destructive"
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: 'আপনি',
      subject: 'সাধারণ',
      class: 'Class 10',
      likes: 0,
      replies: 0,
      timeAgo: 'এখনই',
      tags: ['নতুন'],
      likedBy: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);

    toast({
      title: "পোস্ট তৈরি হয়েছে",
      description: "আপনার পোস্ট সফলভাবে তৈরি হয়েছে",
    });
  };

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">কমিউনিটি</h1>
          <p className="text-gray-300 text-lg">
            শিক্ষার্থীদের সাথে আলোচনা করুন এবং জ্ঞান শেয়ার করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Create Post */}
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="কমিউনিটিতে খুঁজুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={() => setShowNewPost(!showNewPost)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    নতুন পোস্ট
                  </Button>
                </div>

                {/* New Post Form */}
                {showNewPost && (
                  <div className="space-y-4 mt-4 p-4 bg-black/30 rounded-lg border border-white/10">
                    <Input
                      placeholder="পোস্টের শিরোনাম..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <textarea
                      placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full h-32 p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 resize-none"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700">
                        পোস্ট করুন
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewPost(false)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        বাতিল
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const isLiked = post.likedBy.includes('current-user-id');
                
                return (
                  <Card key={post.id} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-lg mb-2">{post.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{post.author}</span>
                            <span>{post.timeAgo}</span>
                            <Badge variant="outline" className="text-blue-300 border-blue-600/30">
                              {post.subject}
                            </Badge>
                            <Badge variant="outline" className="text-green-300 border-green-600/30">
                              {post.class}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} className="bg-blue-600/20 text-blue-300 text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`${isLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                          >
                            <Heart className={`mr-1 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {post.replies}
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(post)}
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <Share2 className="mr-1 h-4 w-4" />
                          শেয়ার
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">কোনো পোস্ট পাওয়া যায়নি</h3>
                <p className="text-gray-400">নতুন পোস্ট তৈরি করুন বা অন্য কিছু খুঁজুন</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CommunityStats />
            <TrendingTopics />
            <StudyGroups />
          </div>
        </div>
      </div>

      <Footer />
      <AIToggle />
    </div>
  );
};

export default Community;
