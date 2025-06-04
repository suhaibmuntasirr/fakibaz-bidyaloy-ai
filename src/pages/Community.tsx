
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, TrendingUp, Plus, Search, Heart, Share2, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CommunityStats from '@/components/CommunityStats';
import TrendingTopics from '@/components/TrendingTopics';
import StudyGroups from '@/components/StudyGroups';
import StudyGroupManager from '@/components/StudyGroupManager';
import AIToggle from '@/components/AIToggle';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  likes: number;
  comments: number;
  tags: string[];
  likedBy: string[];
}

const Community = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'HSC পদার্থবিজ্ঞানের কঠিন সমস্যা সমাধান',
      content: 'নিউটনের গতিসূত্র নিয়ে একটি জটিল সমস্যার সমাধান করতে গিয়ে আটকে গেছি। কেউ সাহায্য করতে পারবেন?',
      author: 'রাহুল আহমেদ',
      authorAvatar: '/avatar1.jpg',
      timestamp: new Date('2023-11-15T10:30:00'),
      likes: 15,
      comments: 8,
      tags: ['পদার্থবিজ্ঞান', 'HSC', 'নিউটনের-সূত্র'],
      likedBy: []
    },
    {
      id: '2',
      title: 'গণিতের ক্যালকুলাস টিপস',
      content: 'ক্যালকুলাসের কিছু শর্টকাট টেকনিক শেয়ার করছি যা পরীক্ষায় অনেক কাজে আসবে।',
      author: 'সারা খান',
      authorAvatar: '/avatar2.jpg',
      timestamp: new Date('2023-11-14T15:20:00'),
      likes: 24,
      comments: 12,
      tags: ['গণিত', 'ক্যালকুলাস', 'টিপস'],
      likedBy: []
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes('current-user');
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== 'current-user')
            : [...post.likedBy, 'current-user']
        };
      }
      return post;
    }));

    toast({
      title: "লাইক আপডেট",
      description: "আপনার প্রতিক্রিয়া সংরক্ষিত হয়েছে"
    });
  };

  const handleComment = (postId: string) => {
    const comment = prompt('আপনার মন্তব্য লিখুন:');
    if (comment && comment.trim()) {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));

      toast({
        title: "মন্তব্য যোগ করা হয়েছে",
        description: "আপনার মন্তব্য সফলভাবে পোস্ট হয়েছে"
      });
    }
  };

  const handleShare = (post: Post) => {
    const shareText = `${post.title}\n\n${post.content.substring(0, 100)}...`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: window.location.href
      }).then(() => {
        toast({
          title: "শেয়ার সম্পন্ন",
          description: "পোস্টটি সফলভাবে শেয়ার করা হয়েছে"
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
        description: "পোস্টের টেক্সট কপি করা হয়েছে"
      });
    });
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "শিরোনাম এবং বিষয়বস্তু পূরণ করুন",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'আপনি',
      authorAvatar: '/default-avatar.jpg',
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likedBy: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', tags: '' });
    setShowCreatePost(false);

    toast({
      title: "পোস্ট তৈরি হয়েছে",
      description: "আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে"
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'এখনই';
    if (minutes < 60) return `${minutes} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${days} দিন আগে`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            শিক্ষার্থী কমিউনিটি
          </h1>
          <p className="text-gray-300 text-lg">
            প্রশ্ন করুন, সমাধান দিন, একসাথে শিখুন
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
            {/* Search and Create */}
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="কমিউনিটিতে খুঁজুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    নতুন পোস্ট
                  </Button>
                </div>

                {/* Tag Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag('all')}
                    className={selectedTag === 'all' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                  >
                    সব
                  </Button>
                  {['পদার্থবিজ্ঞান', 'গণিত', 'রসায়ন', 'HSC', 'SSC'].map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                      className={selectedTag === tag ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Post Form */}
            {showCreatePost && (
              <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">নতুন পোস্ট তৈরি করুন</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="পোস্টের শিরোনাম"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <textarea
                    placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 resize-none"
                  />
                  <Input
                    placeholder="ট্যাগ (কমা দিয়ে আলাদা করুন)"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700">
                      পোস্ট করুন
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      বাতিল
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-medium">{post.author}</h3>
                          <span className="text-gray-400 text-sm flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatTimestamp(post.timestamp)}
                          </span>
                        </div>
                        
                        <h2 className="text-lg font-semibold text-white mb-2">{post.title}</h2>
                        <p className="text-gray-300 mb-4">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-blue-300 border-blue-600/30 text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1 transition-colors hover:text-red-400 ${
                              post.likedBy.includes('current-user') ? 'text-red-400' : ''
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${
                              post.likedBy.includes('current-user') ? 'fill-current' : ''
                            }`} />
                            {post.likes}
                          </button>
                          
                          <button
                            onClick={() => handleComment(post.id)}
                            className="flex items-center gap-1 transition-colors hover:text-blue-400"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {post.comments}
                          </button>
                          
                          <button
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-1 transition-colors hover:text-green-400"
                          >
                            <Share2 className="h-4 w-4" />
                            শেয়ার
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">কোনো পোস্ট পাওয়া যায়নি</h3>
                  <p className="text-gray-500">নতুন পোস্ট তৈরি করুন বা অন্য ফিল্টার ব্যবহার করুন</p>
                </CardContent>
              </Card>
            )}
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
