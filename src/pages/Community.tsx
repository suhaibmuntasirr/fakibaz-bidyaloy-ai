
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Heart, Share2, Users, Plus, Search, TrendingUp, Clock, User, BookOpen, HelpCircle, Lightbulb, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

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
  comments: number;
  tags: string[];
  type: 'question' | 'discussion' | 'study-tip' | 'achievement';
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  class: string;
  members: number;
  isJoined: boolean;
  lastActivity: Date;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const postTags = ['প্রশ্ন', 'আলোচনা', 'স্টাডি টিপস', 'পরীক্ষা', 'গণিত', 'বিজ্ঞান', 'ইংরেজি', 'বাংলা'];

  useEffect(() => {
    // Mock data - replace with actual API calls
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
        comments: 8,
        tags: ['গণিত', 'প্রশ্ন'],
        type: 'question'
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
        comments: 15,
        tags: ['স্টাডি টিপস', 'পদার্থবিজ্ঞান'],
        type: 'study-tip'
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
        comments: 22,
        tags: ['পরীক্ষা'],
        type: 'achievement'
      }
    ]);

    setStudyGroups([
      {
        id: '1',
        name: 'SSC গণিত মাস্টার্স',
        description: 'SSC গণিতের সব অধ্যায় নিয়ে আলোচনা এবং প্র্যাকটিস',
        subject: 'গণিত',
        class: 'Class 9-10',
        members: 150,
        isJoined: false,
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'ইংরেজি গ্রামার গুরুরা',
        description: 'ইংরেজি গ্রামার এবং রাইটিং স্কিল উন্নতির জন্য',
        subject: 'ইংরেজি',
        class: 'Class 6-12',
        members: 200,
        isJoined: true,
        lastActivity: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '3',
        name: 'HSC পদার্থবিজ্ঞান চ্যালেঞ্জ',
        description: 'কঠিন পদার্থবিজ্ঞানের সমস্যা সমাধান এবং আলোচনা',
        subject: 'পদার্থবিজ্ঞান',
        class: 'Class 11-12',
        members: 89,
        isJoined: false,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
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
      comments: 0,
      tags: selectedTags,
      type: 'discussion'
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
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
          : group
      )
    );

    toast({
      title: "গ্রুপে যোগদান",
      description: "আপনি সফলভাবে গ্রুপে যোগদান করেছেন",
    });
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

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🤝 ছাত্রছাত্রী কমিউনিটি
          </h1>
          <p className="text-gray-300 text-lg">
            সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হোন - প্রশ্ন করুন, সাহায্য করুন, একসাথে শিখুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-lg border border-white/10">
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
                {/* Create Post */}
                <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
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
                      className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
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
                            className="bg-black/30 border-white/20 text-white hover:bg-white/10"
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
                  {posts.map((post) => (
                    <Card key={post.id} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
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
                                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <Heart className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
                                  <Share2 className="h-4 w-4" />
                                  <span>শেয়ার</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                {/* Search Groups */}
                <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="স্টাডি গ্রুপ খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Study Groups List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studyGroups.map((group) => (
                    <Card key={group.id} className={`bg-gradient-to-br ${
                      group.id === '1' ? 'from-black/40 to-blue-900/30' :
                      group.id === '2' ? 'from-black/40 to-green-900/30' :
                      'from-black/40 to-purple-900/30'
                    } backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{group.name}</CardTitle>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {group.subject}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{group.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.members} সদস্য
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {group.class}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            শেষ কার্যকলাপ: {Math.floor((Date.now() - group.lastActivity.getTime()) / (1000 * 60))}m ago
                          </div>
                          <Button
                            size="sm"
                            variant={group.isJoined ? 'outline' : 'default'}
                            onClick={() => handleJoinGroup(group.id)}
                            className={group.isJoined 
                              ? "bg-black/30 border-white/20 text-white hover:bg-red-600" 
                              : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                            }
                          >
                            {group.isJoined ? 'ছেড়ে দিন' : 'যোগ দিন'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="bg-gradient-to-br from-black/40 to-orange-900/30 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  ট্রেন্ডিং বিষয়
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['SSC ২০২৫ প্রস্তুতি', 'গণিত অলিম্পিয়াড', 'ইংরেজি গ্রামার', 'বিজ্ঞান প্রজেক্ট', 'পরীক্ষার টিপস'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <span className="text-gray-200 text-sm">{topic}</span>
                    <Badge variant="secondary" className="bg-orange-900/50 text-orange-300">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-black/40 to-cyan-900/30 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">কমিউনিটি পরিসংখ্যান</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">মোট সদস্য</span>
                  <span className="text-cyan-300 font-bold">৫,২৩৪</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">আজকের পোস্ট</span>
                  <span className="text-cyan-300 font-bold">১২৮</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">সক্রিয় গ্রুপ</span>
                  <span className="text-cyan-300 font-bold">৪৫</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">সমাধানকৃত প্রশ্ন</span>
                  <span className="text-cyan-300 font-bold">২,৮৯৭</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
