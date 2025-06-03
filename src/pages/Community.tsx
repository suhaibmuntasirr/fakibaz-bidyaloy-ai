
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Heart, Share2, Users, Plus, Search, Clock, HelpCircle, Lightbulb, Target, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import TrendingTopics from '@/components/TrendingTopics';
import CommunityStats from '@/components/CommunityStats';
import StudyGroups from '@/components/StudyGroups';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    class: string;
    school: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  tags: string[];
  type: 'question' | 'discussion' | 'study-tip' | 'achievement';
  likedBy: string[];
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const postTags = ['প্রশ্ন', 'আলোচনা', 'স্টাডি টিপস', 'পরীক্ষা', 'গণিত', 'বিজ্ঞান', 'ইংরেজি', 'বাংলা'];

  useEffect(() => {
    setPosts([
      {
        id: '1',
        author: {
          name: 'সাকিব আহমেদ',
          class: 'Class 10',
          school: 'ঢাকা কলেজিয়েট স্কুল'
        },
        content: 'কেউ কি গণিতের দ্বিঘাত সমীকরণের সহজ পদ্ধতি জানেন? পরীক্ষায় সময় কম থাকলে কিভাবে দ্রুত সমাধান করব?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        comments: [
          {
            id: 'c1',
            author: 'রহিম উদ্দিন',
            content: 'সূত্র মুখস্থ করে নিয়ে প্রচুর অনুশীলন করো। ১০-১৫ সেকেন্ডে সমাধান করতে পারবে।',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
          }
        ],
        tags: ['গণিত', 'প্রশ্ন'],
        type: 'question',
        likedBy: []
      },
      {
        id: '2',
        author: {
          name: 'ফাতিমা খান',
          class: 'Class 12',
          school: 'ভিকারুননিসা নূন স্কুল'
        },
        content: 'HSC পদার্থবিজ্ঞানের জন্য দারুণ একটা স্টাডি প্ল্যান বানিয়েছি। ৩ মাসে সিলেবাস শেষ করার গ্যারান্টি! কে কে আগ্রহী?',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 25,
        comments: [],
        tags: ['স্টাডি টিপস', 'পদার্থবিজ্ঞান'],
        type: 'study-tip',
        likedBy: []
      },
      {
        id: '3',
        author: {
          name: 'রাশেদ হাসান',
          class: 'Class 9',
          school: 'নটরডেম কলেজ'
        },
        content: 'আজ আমার প্রথম টেস্ট পরীক্ষায় A+ পেয়েছি! এই কমিউনিটির সবার সাহায্যের জন্য ধন্যবাদ 🎉',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 45,
        comments: [],
        tags: ['পরীক্ষা'],
        type: 'achievement',
        likedBy: []
      }
    ]);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "পোস্ট লিখুন",
        description: "অনুগ্রহ করে আপনার পোস্ট লিখুন",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'আপনি',
        class: 'Class 10',
        school: 'আপনার স্কুল'
      },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      tags: selectedTags,
      type: 'discussion',
      likedBy: []
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedTags([]);
    toast({
      title: "পোস্ট প্রকাশিত হয়েছে",
      description: "আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { 
              ...post, 
              likes: post.likedBy.includes('current-user') 
                ? post.likes - 1 
                : post.likes + 1,
              likedBy: post.likedBy.includes('current-user')
                ? post.likedBy.filter(id => id !== 'current-user')
                : [...post.likedBy, 'current-user']
            }
          : post
      )
    );
  };

  const handleAddComment = (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) {
      toast({
        title: "মন্তব্য লিখুন",
        description: "অনুগ্রহ করে আপনার মন্তব্য লিখুন",
        variant: "destructive"
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'আপনি',
      content: commentText,
      timestamp: new Date()
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    setNewComment(prev => ({ ...prev, [postId]: '' }));
    
    toast({
      title: "মন্তব্য যোগ করা হয়েছে",
      description: "আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে",
    });
  };

  const handleSharePost = (post: Post) => {
    const shareText = `${post.content}\n\n- ${post.author.name}, ${post.author.class}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'ফাকিবাজ বিদ্যালয় - কমিউনিটি পোস্ট',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "কপি করা হয়েছে",
        description: "পোস্টটি ক্লিপবোর্ডে কপি করা হয়েছে",
      });
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getPostIcon = (type: Post['type']) => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-5 w-5 text-blue-400" />;
      case 'study-tip':
        return <Lightbulb className="h-5 w-5 text-yellow-400" />;
      case 'achievement':
        return <Target className="h-5 w-5 text-green-400" />;
      default:
        return <MessageCircle className="h-5 w-5 text-purple-400" />;
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            ছাত্রছাত্রী কমিউনিটি
          </h1>
          <p className="text-gray-300 text-lg">
            সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হোন - প্রশ্ন করুন, সাহায্য করুন, একসাথে শিখুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg border border-white/20">
                <TabsTrigger value="posts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  পোস্ট ও আলোচনা
                </TabsTrigger>
                <TabsTrigger value="groups" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600">
                  <Users className="mr-2 h-4 w-4" />
                  স্টাডি গ্রুপ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                {/* Search */}
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="পোস্ট খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Create Post */}
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Plus className="mr-2 h-5 w-5" />
                      নতুন পোস্ট লিখুন
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="আপনার প্রশ্ন, মতামত বা সাহায্যের অনুরোধ লিখুন..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    />
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">ট্যাগ যোগ করুন:</p>
                      <div className="flex flex-wrap gap-2">
                        {postTags.map((tag) => (
                          <Button
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              setSelectedTags(prev =>
                                prev.includes(tag)
                                  ? prev.filter(t => t !== tag)
                                  : [...prev, tag]
                              );
                            }}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleCreatePost}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      পোস্ট প্রকাশ করুন
                    </Button>
                  </CardContent>
                </Card>

                {/* Posts List */}
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-semibold">{post.author.name}</h4>
                                <p className="text-gray-400 text-sm">
                                  {post.author.class} • {post.author.school}
                                </p>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm">
                                {getPostIcon(post.type)}
                                <Clock className="h-3 w-3 ml-2 mr-1" />
                                {Math.floor((Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60))}h ago
                              </div>
                            </div>

                            <p className="text-gray-200 leading-relaxed">{post.content}</p>

                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-gray-300 border-gray-600 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                              <div className="flex items-center space-x-6">
                                <button
                                  onClick={() => handleLikePost(post.id)}
                                  className={`flex items-center space-x-1 transition-colors ${
                                    post.likedBy.includes('current-user') 
                                      ? 'text-red-400' 
                                      : 'text-gray-400 hover:text-red-400'
                                  }`}
                                >
                                  <Heart className={`h-4 w-4 ${post.likedBy.includes('current-user') ? 'fill-current' : ''}`} />
                                  <span>{post.likes}</span>
                                </button>
                                <button 
                                  onClick={() => toggleComments(post.id)}
                                  className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments.length}</span>
                                </button>
                                <button 
                                  onClick={() => handleSharePost(post)}
                                  className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                                >
                                  <Share2 className="h-4 w-4" />
                                  <span>শেয়ার</span>
                                </button>
                              </div>
                            </div>

                            {/* Comments Section */}
                            {showComments[post.id] && (
                              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                                {post.comments.map((comment) => (
                                  <div key={comment.id} className="flex space-x-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-gray-600 text-white text-xs">
                                        {comment.author.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-white text-sm font-medium">{comment.author}</span>
                                        <span className="text-gray-500 text-xs">
                                          {Math.floor((Date.now() - comment.timestamp.getTime()) / (1000 * 60))}m ago
                                        </span>
                                      </div>
                                      <p className="text-gray-300 text-sm">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Add Comment */}
                                <div className="flex space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                                      আ
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 flex space-x-2">
                                    <Input
                                      placeholder="মন্তব্য লিখুন..."
                                      value={newComment[post.id] || ''}
                                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleAddComment(post.id);
                                        }
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddComment(post.id)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Send className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <StudyGroups />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <CommunityStats />
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
