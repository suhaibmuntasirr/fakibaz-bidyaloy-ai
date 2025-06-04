
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, BookOpen, Download, Eye, Calendar, User, Heart, MessageSquare, Star, Upload, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFViewer from '@/components/PDFViewer';
import PDFUpload from '@/components/PDFUpload';
import AIToggle from '@/components/AIToggle';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/types/common';

const Notes = () => {
  const [searchParams] = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [showViewer, setShowViewer] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  // Sample data
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'পদার্থবিজ্ঞান - গতি',
        class: 'Class 11',
        subject: 'পদার্থবিজ্ঞান',
        chapter: 'Chapter 2',
        description: 'সরলরৈখিক গতি এবং ত্বরণ সম্পর্কে বিস্তারিত আলোচনা',
        author: 'রফিক স্যার',
        authorId: 'teacher1',
        fileUrl: '/sample-note.pdf',
        fileName: 'physics-motion.pdf',
        fileSize: 1024000,
        uploadDate: new Date('2023-11-15'),
        likes: 45,
        likedBy: [],
        downloads: 120,
        comments: 8,
        rating: 4.5,
        verified: true,
        tags: ['গতি', 'ত্বরণ', 'বেগ']
      },
      {
        id: '2',
        title: 'গণিত - বীজগণিত',
        class: 'Class 10',
        subject: 'গণিত',
        chapter: 'Chapter 1',
        description: 'বীজগণিতের মূল ধারণা এবং সমীকরণ',
        author: 'সালমা ম্যাম',
        authorId: 'teacher2',
        fileUrl: '/sample-math.pdf',
        fileName: 'math-algebra.pdf',
        fileSize: 2048000,
        uploadDate: new Date('2023-11-10'),
        likes: 32,
        likedBy: [],
        downloads: 89,
        comments: 5,
        rating: 4.2,
        verified: true,
        tags: ['বীজগণিত', 'সমীকরণ', 'গুণনীয়ক']
      }
    ];
    setNotes(sampleNotes);
  }, []);

  const filteredNotes = notes.filter(note => {
    return (
      (searchQuery === '' || 
       note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedClass === 'all' || note.class === selectedClass) &&
      (selectedSubject === 'all' || note.subject === selectedSubject) &&
      (selectedChapter === 'all' || note.chapter === selectedChapter)
    );
  });

  const handleLike = (noteId: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const isLiked = note.likedBy.includes('current-user');
        return {
          ...note,
          likes: isLiked ? note.likes - 1 : note.likes + 1,
          likedBy: isLiked 
            ? note.likedBy.filter(id => id !== 'current-user')
            : [...note.likedBy, 'current-user']
        };
      }
      return note;
    }));
    
    toast({
      title: "লাইক আপডেট হয়েছে",
      description: "আপনার প্রতিক্রিয়া সংরক্ষিত হয়েছে"
    });
  };

  const handleComment = (noteId: string) => {
    const comment = prompt('আপনার মন্তব্য লিখুন:');
    if (comment) {
      setNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, comments: note.comments + 1 }
          : note
      ));
      
      toast({
        title: "মন্তব্য যোগ করা হয়েছে",
        description: "আপনার মন্তব্য সফলভাবে যোগ হয়েছে"
      });
    }
  };

  const handleRating = (noteId: string, rating: number) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, rating }
        : note
    ));
    
    toast({
      title: "রেটিং দেওয়া হয়েছে",
      description: `আপনি ${rating} স্টার রেটিং দিয়েছেন`
    });
  };

  const handleDownload = (note: Note) => {
    setNotes(prev => prev.map(n => 
      n.id === note.id 
        ? { ...n, downloads: n.downloads + 1 }
        : n
    ));
    
    toast({
      title: "ডাউনলোড শুরু হয়েছে",
      description: `${note.title} ডাউনলোড হচ্ছে...`,
    });
  };

  const handlePreview = (note: Note) => {
    setSelectedNote(note);
    setShowViewer(true);
  };

  const handleUploadSuccess = () => {
    toast({
      title: "নোট আপলোড সম্পন্ন",
      description: "আপনার নোট সফলভাবে আপলোড হয়েছে এবং পর্যালোচনার জন্য পাঠানো হয়েছে।",
    });
    setShowUploadDialog(false);
  };

  const handleUploadCancel = () => {
    setShowUploadDialog(false);
  };

  if (showViewer && selectedNote) {
    return (
      <>
        <PDFViewer 
          item={selectedNote}
          type="note"
          onClose={() => {
            setShowViewer(false);
            setSelectedNote(null);
          }}
          onLike={() => handleLike(selectedNote.id)}
          onDownload={() => handleDownload(selectedNote)}
          isLiked={selectedNote.likedBy.includes('current-user')}
        />
        <AIToggle />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            নোট লাইব্রেরি
          </h1>
          <p className="text-gray-700 text-lg">
            সব বিষয়ের নোট এবং সারাংশ এক জায়গায়
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <Upload className="mr-2 h-4 w-4" />
                নোট আপলোড করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-800">নোট আপলোড করুন</DialogTitle>
              </DialogHeader>
              <PDFUpload 
                type="note"
                onUploadSuccess={handleUploadSuccess}
                onCancel={handleUploadCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-lg border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              খুঁজে নিন
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="নোট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 border-gray-200"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-white/60 border-gray-200">
                  <SelectValue placeholder="ক্লাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব ক্লাস</SelectItem>
                  <SelectItem value="Class 6">Class 6</SelectItem>
                  <SelectItem value="Class 7">Class 7</SelectItem>
                  <SelectItem value="Class 8">Class 8</SelectItem>
                  <SelectItem value="Class 9">Class 9</SelectItem>
                  <SelectItem value="Class 10">Class 10</SelectItem>
                  <SelectItem value="Class 11">Class 11</SelectItem>
                  <SelectItem value="Class 12">Class 12</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-white/60 border-gray-200">
                  <SelectValue placeholder="বিষয়" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব বিষয়</SelectItem>
                  <SelectItem value="গণিত">গণিত</SelectItem>
                  <SelectItem value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</SelectItem>
                  <SelectItem value="রসায়ন">রসায়ন</SelectItem>
                  <SelectItem value="জীববিজ্ঞান">জীববিজ্ঞান</SelectItem>
                  <SelectItem value="ইংরেজি">ইংরেজি</SelectItem>
                  <SelectItem value="বাংলা">বাংলা</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="bg-white/60 border-gray-200">
                  <SelectValue placeholder="চ্যাপটার" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব চ্যাপটার</SelectItem>
                  <SelectItem value="Chapter 1">Chapter 1</SelectItem>
                  <SelectItem value="Chapter 2">Chapter 2</SelectItem>
                  <SelectItem value="Chapter 3">Chapter 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="bg-white/70 backdrop-blur-lg border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-800 line-clamp-2">
                  {note.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">{note.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{note.subject} • {note.class}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="mr-2 h-4 w-4" />
                    <span>{note.author}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{note.uploadDate.toLocaleDateString('bn-BD')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Engagement Actions */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(note.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        note.likedBy.includes('current-user') 
                          ? 'text-red-500' 
                          : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${
                        note.likedBy.includes('current-user') ? 'fill-current' : ''
                      }`} />
                      <span>{note.likes}</span>
                    </button>
                    <button
                      onClick={() => handleComment(note.id)}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{note.comments}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{note.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">রেটিং দিন:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(note.id, star)}
                        className={`text-lg transition-colors ${
                          star <= note.rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(note)}
                    className="flex-1 bg-white/70 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    প্রিভিউ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(note)}
                    className="flex-1 bg-white/70 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Download className="mr-1 h-3 w-3" />
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">কোনো নোট পাওয়া যায়নি</h3>
            <p className="text-gray-500">অন্য ফিল্টার ব্যবহার করে চেষ্টা করুন</p>
          </div>
        )}
      </div>
      
      <AIToggle />
    </div>
  );
};

export default Notes;
