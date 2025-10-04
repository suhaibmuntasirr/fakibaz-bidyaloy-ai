import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Download, 
  Eye, 
  Heart, 
  MessageSquare, 
  Star, 
  Filter,
  BookOpen,
  Upload,
  X,
  Send,
  ThumbsUp,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/types/common';
import heroBackground from '@/assets/hero-background.png';
import bookIcon from '@/assets/book-icon.png';

const Notes = () => {
  const location = useLocation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [likedNotes, setLikedNotes] = useState<string[]>([]);
  const [comments, setComments] = useState<{[key: string]: Array<{id: string, author: string, text: string, timestamp: Date}>}>({});
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('সব ধরণ');
  const { toast } = useToast();

  // Check for search query from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  useEffect(() => {
    // Sample notes data
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'বাংলা ব্যাকরণ - সমাস',
        class: 'Class 8',
        subject: 'বাংলা',
        chapter: 'Chapter 5',
        description: 'বাংলা ব্যাকরণের সমাস অংশের সম্পূর্ণ নোট',
        author: 'আফিফা রুমান',
        authorId: 'teacher1',
        fileUrl: '/sample-physics.pdf',
        fileName: 'newton-laws.pdf',
        fileSize: 2500000,
        uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 78,
        likedBy: [],
        downloads: 155,
        comments: 23,
        rating: 4.9,
        verified: true,
        tags: ['সমাস', 'ব্যাকরণ', 'বাংলা']
      },
      {
        id: '2',
        title: 'গণিত - ত্রিভুজ সমীকরণ সমাধান',
        class: 'Class 9',
        subject: 'গণিত',
        chapter: 'Chapter 3',
        description: 'ত্রিভুজ সমীকরণের বিস্তারিত সমাধান এবং উদাহরণ',
        author: 'রাশেল আহমেদ',
        authorId: 'teacher2',
        fileUrl: '/sample-math.pdf',
        fileName: 'calculus-basics.pdf',
        fileSize: 1800000,
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        likes: 45,
        likedBy: [],
        downloads: 89,
        comments: 12,
        rating: 4.8,
        verified: true,
        tags: ['ত্রিভুজ', 'সমীকরণ', 'গণিত']
      },
      {
        id: '3',
        title: 'Physics - Motion in a Straight Line',
        class: 'Class 11',
        subject: 'পদার্থবিজ্ঞান',
        chapter: 'Chapter 2',
        description: 'Complete notes on motion in a straight line with examples',
        author: 'সাবা খান',
        authorId: 'teacher3',
        fileUrl: '/sample-chemistry.pdf',
        fileName: 'organic-compounds.pdf',
        fileSize: 3200000,
        uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 32,
        likedBy: [],
        downloads: 67,
        comments: 8,
        rating: 4.5,
        verified: false,
        tags: ['motion', 'physics', 'straight line']
      }
    ];
    setNotes(sampleNotes);
    setFilteredNotes(sampleNotes);

    // Load liked notes from localStorage
    const savedLikes = localStorage.getItem('likedNotes');
    if (savedLikes) {
      setLikedNotes(JSON.parse(savedLikes));
    }

    // Load comments from localStorage and convert timestamps to Date objects
    const savedComments = localStorage.getItem('noteComments');
    if (savedComments) {
      const parsedComments = JSON.parse(savedComments);
      const commentsWithDates = Object.keys(parsedComments).reduce((acc, key) => {
        acc[key] = parsedComments[key].map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp)
        }));
        return acc;
      }, {} as {[key: string]: Array<{id: string, author: string, text: string, timestamp: Date}>});
      setComments(commentsWithDates);
    }

    // Load ratings from localStorage
    const savedRatings = localStorage.getItem('noteRatings');
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  // Filter notes based on search and filters
  useEffect(() => {
    let filtered = notes;

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(note => note.class === selectedClass);
    }

    if (selectedSubject) {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (selectedCategory !== 'সব ধরণ') {
      // Filter by category logic here
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedClass, selectedSubject, selectedCategory]);

  const handleLike = (noteId: string) => {
    const isLiked = likedNotes.includes(noteId);
    let newLikedNotes;
    
    if (isLiked) {
      newLikedNotes = likedNotes.filter(id => id !== noteId);
    } else {
      newLikedNotes = [...likedNotes, noteId];
    }
    
    setLikedNotes(newLikedNotes);
    localStorage.setItem('likedNotes', JSON.stringify(newLikedNotes));
    
    // Update note likes count
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, likes: isLiked ? note.likes - 1 : note.likes + 1 }
        : note
    ));

    toast({
      title: isLiked ? "লাইক সরানো হয়েছে" : "লাইক দেওয়া হয়েছে",
      description: `নোটটি ${isLiked ? 'থেকে লাইক সরানো হয়েছে' : 'কে লাইক দেওয়া হয়েছে'}`,
    });
  };

  const handleAddComment = (noteId: string) => {
    const commentText = newComment[noteId];
    if (!commentText?.trim()) {
      toast({
        title: "মন্তব্য লিখুন",
        description: "অনুগ্রহ করে আপনার মন্তব্য লিখুন",
        variant: "destructive"
      });
      return;
    }

    const comment = {
      id: Date.now().toString(),
      author: 'আপনি',
      text: commentText,
      timestamp: new Date()
    };

    const newComments = {
      ...comments,
      [noteId]: [...(comments[noteId] || []), comment]
    };
    
    setComments(newComments);
    
    // Convert timestamps to strings for localStorage
    const commentsForStorage = Object.keys(newComments).reduce((acc, key) => {
      acc[key] = newComments[key].map(comment => ({
        ...comment,
        timestamp: comment.timestamp.toISOString()
      }));
      return acc;
    }, {} as any);
    
    localStorage.setItem('noteComments', JSON.stringify(commentsForStorage));
    setNewComment(prev => ({ ...prev, [noteId]: '' }));
    
    // Update comment count
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, comments: note.comments + 1 }
        : note
    ));

    toast({
      title: "মন্তব্য যোগ করা হয়েছে",
      description: "আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে",
    });
  };

  const handleRate = (noteId: string, rating: number) => {
    const newRatings = { ...ratings, [noteId]: rating };
    setRatings(newRatings);
    localStorage.setItem('noteRatings', JSON.stringify(newRatings));

    // Update note rating
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, rating: rating }
        : note
    ));

    toast({
      title: "রেটিং দেওয়া হয়েছে",
      description: `আপনি ${rating} স্টার রেটিং দিয়েছেন`,
    });
  };

  const handleDownload = (note: Note) => {
    // Simulate download
    toast({
      title: "ডাউনলোড শুরু",
      description: `"${note.title}" ডাউনলোড হচ্ছে...`,
    });
    
    // Update download count
    setNotes(prev => prev.map(n => 
      n.id === note.id 
        ? { ...n, downloads: n.downloads + 1 }
        : n
    ));
  };

  const handlePreview = (note: Note) => {
    setSelectedNote(note);
    setShowPreview(true);
  };

  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'ইংরেজি', 'বাংলা', 'ইতিহাস', 'ভূগোল'];
  const categories = ['সব ধরণ', 'Chapter Summary', 'Question Bank', 'Formula Sheet', 'Practice Problems', 'Exam Tips'];

  const getGradientClass = (index: number) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500', 
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500'
    ];
    return gradients[index % gradients.length];
  };

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
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">নোট ব্যাংক</h1>
          </div>
          <p className="text-gray-300 text-lg">সহজ ভাষায় লেখা নোট এবং সারাংশ সবার জন্য উপলব্ধ</p>
        </div>

        {/* Search Bar & Upload Button */}
        <div className="mb-6">
          <div className="flex items-center max-w-4xl mx-auto gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input
                placeholder="নোট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-[#2d2d2d] border-gray-600 text-white placeholder:text-gray-400 text-lg rounded-xl"
              />
            </div>
            <Button
              onClick={() => setShowUpload(true)}
              className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              নোট আপলোড
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg rounded-3xl relative overflow-hidden"
          style={{
            border: '2px solid transparent',
            borderRadius: '24px',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), linear-gradient(135deg, rgba(255,255,255,0.8), rgba(147,197,253,0.6), rgba(59,130,246,0.6), rgba(147,51,234,0.6), rgba(236,72,153,0.6))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-white font-medium">ফিল্টার</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-2xl px-3 py-2"
              >
                <option value="">ক্লাস নির্বাচন</option>
                {classes.map(cls => (
                  <option key={cls} value={cls} className="bg-gray-800">{cls}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-2xl px-3 py-2"
              >
                <option value="">বিষয় নির্বাচন</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="bg-gray-800">{subject}</option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-2xl px-3 py-2"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">{category}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.slice(1).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 rounded-2xl" 
                    : "bg-transparent border-white/30 text-gray-300 hover:bg-white/10 hover:border-white/50 rounded-2xl"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400">{filteredNotes.length} টি নোট পাওয়া গেছে</span>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
              }
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => {
            const colors = [
              { gradient: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/50' },
              { gradient: 'from-purple-500 to-pink-600', border: 'border-purple-500/50' },
              { gradient: 'from-green-500 to-teal-600', border: 'border-green-500/50' },
              { gradient: 'from-orange-500 to-red-600', border: 'border-orange-500/50' },
              { gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-500/50' },
              { gradient: 'from-pink-500 to-rose-600', border: 'border-pink-500/50' },
            ];
            const colorSet = colors[index % colors.length];
            
            return (
              <div key={note.id} className="rounded-3xl p-[2px] relative"
                style={{
                  background: `linear-gradient(to bottom, rgba(255,255,255,0.8), ${
                    colorSet.gradient.includes('cyan') ? 'rgba(6,182,212,0.6)' : 
                    colorSet.gradient.includes('purple') ? 'rgba(168,85,247,0.6)' : 
                    colorSet.gradient.includes('green') ? 'rgba(20,184,166,0.6)' : 
                    colorSet.gradient.includes('orange') ? 'rgba(239,68,68,0.6)' : 
                    colorSet.gradient.includes('blue') ? 'rgba(99,102,241,0.6)' : 
                    'rgba(236,72,153,0.6)'
                  })`
                }}
              >
                {/* Blurred glow effect behind card */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-50 -z-10"
                  style={{
                    background: `linear-gradient(to bottom, rgba(255,255,255,0.4), ${
                      colorSet.gradient.includes('cyan') ? 'rgba(6,182,212,0.4)' : 
                      colorSet.gradient.includes('purple') ? 'rgba(168,85,247,0.4)' : 
                      colorSet.gradient.includes('green') ? 'rgba(20,184,166,0.4)' : 
                      colorSet.gradient.includes('orange') ? 'rgba(239,68,68,0.4)' : 
                      colorSet.gradient.includes('blue') ? 'rgba(99,102,241,0.4)' : 
                      'rgba(236,72,153,0.4)'
                    })`
                  }}
                />
                <div className="rounded-[22px] overflow-hidden" style={{ background: 'transparent' }}>
                {/* Top colored oval section with icon and glowing blur effect */}
                <div className="relative">
                  <div className={`h-24 bg-gradient-to-br ${colorSet.gradient} flex items-center justify-center rounded-t-3xl z-10 relative`}>
                    <img 
                      src={bookIcon} 
                      alt="Book Icon" 
                      className="w-10 h-10 filter brightness-0 invert opacity-90"
                    />
                  </div>
                  {/* Soft glowing blur effect extending downward */}
                  <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${colorSet.gradient} opacity-40 blur-2xl rounded-t-3xl -z-10`}></div>
                  <div className={`absolute top-8 left-0 right-0 h-24 bg-gradient-to-b ${colorSet.gradient.replace('to-', 'via-')} to-transparent opacity-30 blur-xl`}></div>
                </div>
                
                <CardContent className="p-6 pt-8">
                  <div className="space-y-4">
                    {/* Title and Badges */}
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">{note.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{note.chapter}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-blue-400 border-blue-400 bg-blue-400/10">
                          {note.class}
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
                          {note.subject}
                        </Badge>
                        {note.verified && (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Author and File Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{note.author}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-500 text-xs">
                        <span>{(note.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                        <span>{note.uploadDate.toLocaleDateString('bn-BD')}</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className={`h-4 w-4 ${likedNotes.includes(note.id) ? 'fill-red-400 text-red-400' : ''}`} />
                          <span>{note.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{note.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{note.downloads}</span>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 cursor-pointer transition-colors ${
                              i < (ratings[note.id] || Math.floor(note.rating)) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-600 hover:text-yellow-300'
                            }`}
                            onClick={() => handleRate(note.id, i + 1)}
                          />
                        ))}
                        <span className="text-xs ml-1">({note.rating})</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePreview(note)}
                        className="flex-1 text-white border-white/30 hover:bg-white/10 bg-white/5"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        দেখুন
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(note)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        ডাউনলোড
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(note.id)}
                        className={`${likedNotes.includes(note.id) ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                      >
                        <Heart className={`h-4 w-4 ${likedNotes.includes(note.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">কোন নোট পাওয়া যায়নি</h3>
            <p className="text-gray-500">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন</p>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-[#28282B] border-white/20 text-white overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white">নোট আপলোড করুন</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
            <PDFUpload 
              type="note"
              onUploadSuccess={() => setShowUpload(false)}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {showPreview && selectedNote && (
        <PDFViewer 
          item={selectedNote}
          type="note"
          onClose={() => setShowPreview(false)}
          onLike={() => handleLike(selectedNote.id)}
          onDownload={() => handleDownload(selectedNote)}
          onRate={(rating) => handleRate(selectedNote.id, rating)}
          onComment={(comment) => handleAddComment(selectedNote.id)}
          isLiked={likedNotes.includes(selectedNote.id)}
          comments={comments[selectedNote.id] || []}
          newComment={newComment[selectedNote.id] || ''}
          onCommentChange={(text) => setNewComment(prev => ({ ...prev, [selectedNote.id]: text }))}
          userRating={ratings[selectedNote.id]}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Notes;
