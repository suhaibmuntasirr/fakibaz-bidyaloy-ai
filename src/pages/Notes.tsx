import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Filter, BookOpen, FileText, Download, Eye, Heart, Share2, User, Clock, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import { notesService } from '@/services/notesService';
import { Note } from '@/types/common';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [likedNotes, setLikedNotes] = useState<string[]>([]);
  const [comments, setComments] = useState<{[key: string]: string[]}>({});
  const [newComment, setNewComment] = useState('');
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const { toast } = useToast();

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'বাংলা', 'English', 'গণিত', 'বিজ্ঞান', 'সামাজিক বিজ্ঞান', 
    'ICT', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত'
  ];

  const tags = ['Chapter Summary', 'Question Bank', 'Formula Sheet', 'Practice Problems', 'Exam Tips'];

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedClass, selectedSubject, selectedTag, sortBy]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await notesService.getAllNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "ত্রুটি",
        description: "নোট লোড করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = [...notes];

    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedClass && selectedClass !== 'all') {
      filtered = filtered.filter(note => note.class === selectedClass);
    }

    if (selectedSubject && selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'latest':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

    setFilteredNotes(filtered);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedClass && selectedClass !== 'all') params.set('class', selectedClass);
    if (selectedSubject && selectedSubject !== 'all') params.set('subject', selectedSubject);
    setSearchParams(params);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleLike = async (noteId: string) => {
    try {
      if (likedNotes.includes(noteId)) {
        setLikedNotes(likedNotes.filter(id => id !== noteId));
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId 
              ? { ...note, likes: Math.max((note.likes || 0) - 1, 0) }
              : note
          )
        );
        toast({
          title: "লাইক সরানো হয়েছে",
          description: "নোট থেকে লাইক সরিয়ে দেওয়া হয়েছে",
        });
      } else {
        setLikedNotes([...likedNotes, noteId]);
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId 
              ? { ...note, likes: (note.likes || 0) + 1 }
              : note
          )
        );
        toast({
          title: "লাইক করা হয়েছে",
          description: "নোটটি লাইক করা হয়েছে",
        });
      }
    } catch (error) {
      console.error('Error liking note:', error);
      toast({
        title: "ত্রুটি",
        description: "লাইক করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  };

  const handleComment = (noteId: string) => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [noteId]: [...(prev[noteId] || []), newComment.trim()]
      }));
      setNewComment('');
      setActiveCommentBox(null);
      toast({
        title: "মন্তব্য যোগ করা হয়েছে",
        description: "আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে",
      });
    }
  };

  const handleShare = (note: Note) => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "লিংক কপি করা হয়েছে",
        description: "নোটের লিংক ক্লিপবোর্ডে কপি করা হয়েছে",
      });
    }
  };

  const handleDownload = (note: Note) => {
    window.open(note.fileUrl, '_blank');
    toast({
      title: "ডাউনলোড শুরু",
      description: "নোট ডাউনলোড শুরু হয়েছে",
    });
  };

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📚 নোট শেয়ারিং হাব
          </h1>
          <p className="text-gray-300 text-lg">
            সারা দেশের ছাত্রছাত্রীদের নোট এক জায়গায় - শেখো এবং শেখাও
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-lg border border-white/10">
            <TabsTrigger value="browse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
              <Search className="mr-2 h-4 w-4" />
              নোট ব্রাউজ করো
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600">
              <Upload className="mr-2 h-4 w-4" />
              নোট আপলোড করো
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter Section */}
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  খুঁজে দেখো
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="নোট খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                  />
                  
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-black/30 border-white/20 text-white">
                      <SelectValue placeholder="ক্লাস নির্বাচন" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="all" className="text-white">সব ক্লাস</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls} className="text-white hover:bg-white/10">
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-black/30 border-white/20 text-white">
                      <SelectValue placeholder="বিষয় নির্বাচন" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="all" className="text-white">সব বিষয়</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-black/30 border-white/20 text-white">
                      <SelectValue placeholder="সাজানো" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="latest" className="text-white">নতুন আগে</SelectItem>
                      <SelectItem value="popular" className="text-white">জনপ্রিয়</SelectItem>
                      <SelectItem value="alphabetical" className="text-white">A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag('')}
                    className="bg-black/30 border-white/20"
                  >
                    সব ট্যাগ
                  </Button>
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                      className="bg-black/30 border-white/20"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>

                <Button onClick={handleSearch} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Search className="mr-2 h-4 w-4" />
                  খুঁজুন
                </Button>
              </CardContent>
            </Card>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="bg-black/20 backdrop-blur-lg border border-white/10 animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-600 rounded mb-4"></div>
                      <div className="h-3 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <Card key={note.id} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                            {note.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {note.description}
                          </p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-400 ml-2" />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-600/30">
                          {note.class}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-600/30">
                          {note.subject}
                        </Badge>
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-gray-300 border-gray-600 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {note.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(note.uploadDate).toLocaleDateString('bn-BD')}
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(note.id);
                              }}
                              className={`flex items-center transition-colors ${
                                likedNotes.includes(note.id) 
                                  ? 'text-red-400' 
                                  : 'text-gray-400 hover:text-red-400'
                              }`}
                              aria-label={`${note.title} লাইক করুন`}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${likedNotes.includes(note.id) ? 'fill-current' : ''}`} />
                              {note.likes || 0}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCommentBox(activeCommentBox === note.id ? null : note.id);
                              }}
                              className="flex items-center text-gray-400 hover:text-blue-400 transition-colors"
                              aria-label={`${note.title} এ মন্তব্য করুন`}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {(comments[note.id] || []).length}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(note);
                              }}
                              className="flex items-center text-gray-400 hover:text-blue-400 transition-colors"
                              aria-label={`${note.title} শেয়ার করুন`}
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNote(note);
                              }}
                              className="bg-black/30 border-white/20 text-white hover:bg-white/10"
                              aria-label={`${note.title} দেখুন`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              দেখুন
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(note);
                              }}
                              className="bg-black/30 border-white/20 text-white hover:bg-white/10"
                              aria-label={`${note.title} ডাউনলোড করুন`}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              ডাউনলোড
                            </Button>
                          </div>
                        </div>

                        {/* Comment Box */}
                        {activeCommentBox === note.id && (
                          <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex gap-2">
                              <Input
                                placeholder="মন্তব্য লিখুন..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleComment(note.id);
                                  }
                                }}
                                aria-label="মন্তব্য লিখুন"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleComment(note.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                                aria-label="মন্তব্য পোস্ট করুন"
                              >
                                পোস্ট
                              </Button>
                            </div>
                            {/* Display Comments */}
                            {comments[note.id] && comments[note.id].length > 0 && (
                              <div className="mt-3 space-y-2">
                                {comments[note.id].map((comment, index) => (
                                  <div key={index} className="p-2 bg-black/20 rounded text-gray-300 text-sm">
                                    {comment}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2">কোন নোট পাওয়া যায়নি</h3>
                  <p className="text-gray-400">অন্য ফিল্টার ব্যবহার করে আবার চেষ্টা করুন</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  📤 নতুন নোট শেয়ার করুন
                </CardTitle>
                <p className="text-gray-300 text-center">
                  আপনার নোট আপলোড করে অন্য ছাত্রছাত্রীদের সাহায্য করুন
                </p>
              </CardHeader>
              <CardContent>
                <PDFUpload 
                  type="note"
                  onUploadSuccess={() => {
                    fetchNotes();
                    toast({
                      title: "সফল!",
                      description: "নোট সফলভাবে আপলোড হয়েছে",
                    });
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* PDF Viewer Modal */}
        {selectedNote && (
          <PDFViewer
            item={selectedNote}
            type="note"
            onClose={() => setSelectedNote(null)}
            onLike={() => handleLike(selectedNote.id)}
            onDownload={() => handleDownload(selectedNote)}
            isLiked={likedNotes.includes(selectedNote.id)}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
