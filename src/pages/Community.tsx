import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Heart, Share2, Users, Plus, Search, Clock, Image, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import heroBackground from '@/assets/hero-background.png';
import CommunityStats from '@/components/CommunityStats';
import TrendingTopics from '@/components/TrendingTopics';
import StudyGroups from '@/components/StudyGroups';

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
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  tags: string[];
  likedBy: string[];
  images?: string[];
}

const Community = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'groups'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const postTags = ['প্রশ্ন', 'আলোচনা', 'স্টাডি টিপস', 'পরীক্ষা', 'গণিত', 'বিজ্ঞান', 'ইংরেজি', 'বাংলা'];

  useEffect(() => {
    setPosts([
      {
        id: '1',
        author: { name: 'সাকিব আহমেদ', class: 'Class 10' },
        content: 'কেউ কি গণিতের দ্বিঘাত সমীকরণের সহজ পদ্ধতি জানেন? পরীক্ষায় সময় কম থাকলে কিভাবে দ্রুত সমাধান করব?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        comments: [],
        tags: ['গণিত', 'প্রশ্ন'],
        likedBy: []
      },
      {
        id: '2',
        author: { name: 'ফাতিমা খান', class: 'Class 12' },
        content: 'HSC পদার্থবিজ্ঞানের জন্য দারুণ একটা স্টাডি প্ল্যান বানিয়েছি। ৩ মাসে সিলেবাস শেষ করার গ্যারান্টি!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 25,
        comments: [],
        tags: ['স্টাডি টিপস'],
        likedBy: []
      }
    ]);
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newImages = [...selectedImages, ...files].slice(0, 3);
      setSelectedImages(newImages);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviewUrls(prev => [...prev, e.target?.result as string].slice(0, 3));
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
      author: { name: 'আপনি', class: 'Class 10' },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      tags: selectedTags,
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
              likes: post.likedBy.includes('current-user') ? post.likes - 1 : post.likes + 1,
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
    if (!commentText?.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'আপনি',
      content: commentText,
      timestamp: new Date()
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
      )
    );

    setNewComment(prev => ({ ...prev, [postId]: '' }));
    toast({
      title: "মন্তব্য যোগ করা হয়েছে",
      description: "আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে",
    });
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
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
            সারাদেশের ছাত্রছাত্রীদের সাথে যুক্ত হোন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Posts & Groups */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 h-12 rounded-2xl transition-all ${
                  activeTab === 'posts' 
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                পোস্ট ও আলোচনা
              </Button>
              <Button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 h-12 rounded-2xl transition-all ${
                  activeTab === 'groups' 
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Study Group
              </Button>
            </div>

            {activeTab === 'posts' && (
              <>
                {/* Search Bar */}
                <Card className="bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-3xl">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="পোস্ট খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl h-12"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Create Post Card */}
                <Card className="bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center text-left">
                      <Plus className="mr-2 h-5 w-5" />
                      নতুন পোস্ট লিখুন
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="আপনার প্রশ্ন, মতামত বা সাহায্যের অনুরোধ লিখুন..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px] rounded-2xl"
                    />
                    
                    {/* Image Preview */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
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
                    
                    <div className="flex flex-wrap gap-2">
                      {postTags.map(tag => (
                        <Button
                          key={tag}
                          size="sm"
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          onClick={() => {
                            setSelectedTags(prev =>
                              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                            );
                          }}
                          className={`rounded-full ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
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
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full"
                        disabled={selectedImages.length >= 3}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        ছবি যোগ করুন (সর্বোচ্চ ৩টি)
                      </Button>
                      <Button
                        onClick={handleCreatePost}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white rounded-full px-6"
                      >
                        পোস্ট প্রকাশ করুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-3xl">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-start mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {post.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{post.author.name}</h4>
                              <p className="text-gray-400 text-sm">{post.author.class}</p>
                            </div>
                            <Badge variant="outline" className="text-gray-400 border-gray-600 rounded-full">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.floor((Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60))} ঘন্টা আগে
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-200 mb-4">{post.content}</p>

                      {/* Post Images */}
                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {post.images.map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}

                      {/* Post Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-500/20 text-blue-300 rounded-full">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className={`rounded-full ${
                            post.likedBy.includes('current-user') ? 'text-pink-500' : 'text-gray-400'
                          } hover:text-pink-500`}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.likedBy.includes('current-user') ? 'fill-pink-500' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComments(post.id)}
                          className="text-gray-400 hover:text-blue-400 rounded-full"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments.length}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 rounded-full">
                          <Share2 className="h-4 w-4 mr-1" />
                          শেয়ার
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {showComments[post.id] && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="bg-white/5 p-3 rounded-2xl">
                              <div className="flex items-center mb-1">
                                <span className="text-white text-sm font-semibold mr-2">{comment.author}</span>
                                <span className="text-gray-500 text-xs">
                                  {Math.floor((Date.now() - comment.timestamp.getTime()) / (1000 * 60))} মিনিট আগে
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">{comment.content}</p>
                            </div>
                          ))}
                          
                          <div className="flex gap-2 mt-3">
                            <Input
                              placeholder="মন্তব্য লিখুন..."
                              value={newComment[post.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl"
                              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            />
                            <Button
                              onClick={() => handleAddComment(post.id)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 rounded-full"
                            >
                              পাঠান
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {activeTab === 'groups' && (
              <StudyGroups />
            )}
          </div>

          {/* Sidebar */}
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