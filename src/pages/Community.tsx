import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Heart, Share2, Users, Plus, Search, Clock, HelpCircle, Lightbulb, Target, Send, Image, X, Copy, MessageSquare, Facebook, Twitter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrendingTopics from '@/components/TrendingTopics';
import CommunityStats from '@/components/CommunityStats';
import StudyGroups from '@/components/StudyGroups';
import { useToast } from '@/hooks/use-toast';
import heroBackground from '@/assets/hero-background.png';

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
  images?: string[];
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showShareDialog, setShowShareDialog] = useState<{[key: string]: boolean}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files].slice(0, 3)); // Max 3 images
      
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

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
      likedBy: [],
      images: imagePreviewUrls.length > 0 ? imagePreviewUrls : undefined
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedTags([]);
    setSelectedImages([]);
    setImagePreviewUrls([]);
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

  const handleCopyLink = async (post: Post) => {
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "লিংক কপি হয়েছে",
        description: "পোস্টের লিংক ক্লিপবোর্ডে কপি করা হয়েছে",
      });
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const handleShareToSocial = (post: Post, platform: string) => {
    const shareText = `${post.content}\n\n- ${post.author.name}, ${post.author.class}\n\nFakibaz বিদ্যালয় কমিউনিটি`;
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    
    let socialUrl = '';
    
    switch (platform) {
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        socialUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
    }
    
    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
      toast({
        title: "শেয়ার করা হচ্ছে",
        description: `${platform} এ পোস্ট শেয়ার করা হচ্ছে...`,
      });
    }
  };

  const handleNativeShare = async (post: Post) => {
    const shareText = `${post.content}\n\n- ${post.author.name}, ${post.author.class}\n\nFakibaz বিদ্যালয় কমিউনিটি`;
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ফাকিবাজ বিদ্যালয় - কমিউনিটি পোস্ট',
          text: shareText,
          url: shareUrl
        });
        toast({
          title: "শেয়ার করা হয়েছে",
          description: "পোস্টটি সফলভাবে শেয়ার করা হয়েছে",
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback to copy link
      handleCopyLink(post);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>
      
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
                    
                    {/* Image Preview */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          disabled={selectedImages.length >= 3}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          ছবি যোগ করুন ({selectedImages.length}/3)
                        </Button>
                      </div>
                    </div>
                    
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

                            {/* Post Images */}
                            {post.images && post.images.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                {post.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                      // Open image in modal or lightbox
                                      window.open(image, '_blank');
                                    }}
                                  />
                                ))}
                              </div>
                            )}

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
                                
                                {/* Enhanced Share Button */}
                                <Dialog open={showShareDialog[post.id]} onOpenChange={(open) => 
                                  setShowShareDialog(prev => ({ ...prev, [post.id]: open }))
                                }>
                                  <DialogTrigger asChild>
                                    <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
                                      <Share2 className="h-4 w-4" />
                                      <span>শেয়ার</span>
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-white/95 backdrop-blur-lg border-white/20 max-w-md">
                                    <DialogHeader>
                                      <DialogTitle className="text-gray-800">পোস্ট শেয়ার করুন</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                      <Button
                                        onClick={() => handleNativeShare(post)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        সরাসরি শেয়ার করুন
                                      </Button>
                                      
                                      <Button
                                        onClick={() => handleCopyLink(post)}
                                        variant="outline"
                                        className="w-full bg-white/70 border-gray-300 text-gray-700 hover:bg-gray-50"
                                      >
                                        <Copy className="mr-2 h-4 w-4" />
                                        লিংক কপি করুন
                                      </Button>
                                      
                                      <div className="grid grid-cols-3 gap-2">
                                        <Button
                                          onClick={() => handleShareToSocial(post, 'facebook')}
                                          variant="outline"
                                          size="sm"
                                          className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                                        >
                                          <Facebook className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          onClick={() => handleShareToSocial(post, 'twitter')}
                                          variant="outline"
                                          size="sm"
                                          className="bg-sky-500 text-white hover:bg-sky-600 border-sky-500"
                                        >
                                          <Twitter className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          onClick={() => handleShareToSocial(post, 'whatsapp')}
                                          variant="outline"
                                          size="sm"
                                          className="bg-green-500 text-white hover:bg-green-600 border-green-500"
                                        >
                                          <MessageSquare className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
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
      
      <Footer />
    </div>
  );
};

export default Community;
