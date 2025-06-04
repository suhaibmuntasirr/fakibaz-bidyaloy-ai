
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
  ThumbsUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/types/common';

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
        title: 'পদার্থবিজ্ঞান - নিউটনের সূত্র',
        class: 'Class 11',
        subject: 'পদার্থবিজ্ঞান',
        chapter: 'গতিবিদ্যা',
        description: 'নিউটনের তিনটি সূত্রের বিস্তারিত ব্যাখ্যা এবং উদাহরণ',
        author: 'রহিম স্যার',
        authorId: 'teacher1',
        fileUrl: '/sample-physics.pdf',
        fileName: 'newton-laws.pdf',
        fileSize: 2500000,
        uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 45,
        likedBy: [],
        downloads: 120,
        comments: 8,
        rating: 4.5,
        verified: true,
        tags: ['নিউটন', 'গতিবিদ্যা', 'পদার্থবিজ্ঞান']
      },
      {
        id: '2',
        title: 'গণিত - ক্যালকুলাস মূলনীতি',
        class: 'Class 12',
        subject: 'গণিত',
        chapter: 'অবকলন',
        description: 'ক্যালকুলাসের মূল ধারণা এবং অবকলনের নিয়মাবলী',
        author: 'করিম স্যার',
        authorId: 'teacher2',
        fileUrl: '/sample-math.pdf',
        fileName: 'calculus-basics.pdf',
        fileSize: 1800000,
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        likes: 32,
        likedBy: [],
        downloads: 89,
        comments: 12,
        rating: 4.2,
        verified: true,
        tags: ['ক্যালকুলাস', 'অবকলন', 'গণিত']
      },
      {
        id: '3',
        title: 'রসায়ন - জৈব যৌগের বৈশিষ্ট্য',
        class: 'Class 10',
        subject: 'রসায়ন',
        chapter: 'জৈব রসায়ন',
        description: 'বিভিন্ন জৈব যৌগের গঠন এবং ধর্ম',
        author: 'সালমা ম্যাডাম',
        authorId: 'teacher3',
        fileUrl: '/sample-chemistry.pdf',
        fileName: 'organic-compounds.pdf',
        fileSize: 3200000,
        uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 28,
        likedBy: [],
        downloads: 67,
        comments: 5,
        rating: 4.0,
        verified: false,
        tags: ['জৈব', 'যৌগ', 'রসায়ন']
      }
    ];
    setNotes(sampleNotes);
    setFilteredNotes(sampleNotes);

    // Load liked notes from localStorage
    const savedLikes = localStorage.getItem('likedNotes');
    if (savedLikes) {
      setLikedNotes(JSON.parse(savedLikes));
    }

    // Load comments from localStorage
    const savedComments = localStorage.getItem('noteComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
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

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedClass, selectedSubject]);

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
    localStorage.setItem('noteComments', JSON.stringify(newComments));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            নোট সংগ্রহ
          </h1>
          <p className="text-gray-300 text-lg">
            সেরা মানের নোট খুঁজুন এবং ডাউনলোড করুন
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="নোট খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="">সব ক্লাস</option>
                {classes.map(cls => (
                  <option key={cls} value={cls} className="bg-gray-800">{cls}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="">সব বিষয়</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="bg-gray-800">{subject}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Upload Button */}
        <div className="mb-8 text-center">
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            নোট আপলোড করুন
          </Button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:border-white/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{note.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-blue-600/20 text-blue-300">{note.class}</Badge>
                      <Badge className="bg-green-600/20 text-green-300">{note.subject}</Badge>
                      {note.verified && (
                        <Badge className="bg-yellow-600/20 text-yellow-300">✓ যাচাইকৃত</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{note.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {note.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">{note.author}</p>
                      <p className="text-gray-400 text-xs">
                        {Math.floor((Date.now() - note.uploadDate.getTime()) / (1000 * 60 * 60 * 24))} দিন আগে
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {(note.fileSize / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-gray-400 border-gray-600 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(note.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        likedNotes.includes(note.id) ? 'text-red-400' : 'hover:text-red-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedNotes.includes(note.id) ? 'fill-current' : ''}`} />
                      <span>{note.likes}</span>
                    </button>
                    <button
                      onClick={() => setShowComments(prev => ({ ...prev, [note.id]: !prev[note.id] }))}
                      className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{note.comments}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{note.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(note.id, star)}
                        className={`hover:text-yellow-400 transition-colors ${
                          (ratings[note.id] || note.rating) >= star ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        <Star className={`h-3 w-3 ${(ratings[note.id] || note.rating) >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[note.id] && (
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    {comments[note.id]?.map((comment) => (
                      <div key={comment.id} className="bg-black/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{comment.author}</span>
                          <span className="text-gray-500 text-xs">
                            {Math.floor((Date.now() - comment.timestamp.getTime()) / (1000 * 60))}m ago
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <Input
                        placeholder="মন্তব্য লিখুন..."
                        value={newComment[note.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [note.id]: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(note.id);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(note.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={() => handlePreview(note)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    প্রিভিউ
                  </Button>
                  <Button
                    onClick={() => handleDownload(note)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    ডাউনলোড
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
        <DialogContent className="max-w-4xl bg-[#28282B] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">নোট আপলোড করুন</DialogTitle>
          </DialogHeader>
          <PDFUpload onClose={() => setShowUpload(false)} />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-[#28282B] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{selectedNote?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedNote && (
            <PDFViewer 
              note={selectedNote} 
              onBack={() => setShowPreview(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;
