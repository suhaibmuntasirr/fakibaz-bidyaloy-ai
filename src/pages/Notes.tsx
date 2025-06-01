
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, BookOpen, Calendar, User, Filter, Star, Upload, Grid, List } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClassSelection from '@/components/ClassSelection';
import PDFViewer from '@/components/PDFViewer';
import AIAssistant from '@/components/AIAssistant';
import AdBanner from '@/components/AdBanner';
import { useToast } from '@/hooks/use-toast';
import { notesService } from '@/services/notesService';
import { Note } from '@/types/common';

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const { toast } = useToast();

  const subjects = [
    'সব বিষয়',
    'গণিত',
    'পদার্থবিজ্ঞান',
    'রসায়ন',
    'জীববিজ্ঞান',
    'বাংলা',
    'ইংরেজি',
    'ইতিহাস',
    'ভূগোল',
    'অর্থনীতি',
    'পৌরনীতি',
    'যুক্তিবিদ্যা',
    'মনোবিজ্ঞান',
    'সমাজবিজ্ঞান',
    'ইসলামের ইতিহাস',
    'আরবি',
    'সংস্কৃত'
  ];

  const classes = [
    'সব ক্লাস',
    'Class 1',
    'Class 2', 
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12'
  ];

  const noteTypes = [
    'সব ধরণ',
    'Chapter Summary',
    'Question Bank',
    'Formula Sheet',
    'Practice Problems',
    'Exam Tips'
  ];

  const gradientColors = [
    'from-blue-500 to-cyan-600',
    'from-purple-500 to-pink-600', 
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-teal-500 to-green-600',
    'from-yellow-500 to-orange-600'
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, selectedClass, selectedSubject, searchQuery, sortBy]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = notesService.getAllNotes();
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
    let filtered = notes;

    if (selectedClass && selectedClass !== 'সব ক্লাস') {
      filtered = filtered.filter(note => note.class === selectedClass);
    }

    if (selectedSubject && selectedSubject !== 'সব বিষয়') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort notes
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    }

    setFilteredNotes(filtered);
  };

  const handleDownload = async (note: Note) => {
    try {
      notesService.downloadNote(note.id);
      
      // Update download count locally
      setNotes(prevNotes => 
        prevNotes.map(n => 
          n.id === note.id 
            ? { ...n, downloads: n.downloads + 1 }
            : n
        )
      );

      toast({
        title: "ডাউনলোড শুরু হয়েছে",
        description: `${note.title} ডাউনলোড হচ্ছে...`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "ডাউনলোড ত্রুটি",
        description: "ফাইল ডাউনলোড করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  };

  const handleLike = (note: Note) => {
    // Assuming current user ID, in real app this would come from auth context
    const userId = 'current-user-id';
    const isLiked = notesService.likeNote(note.id, userId);
    
    // Update local state
    setNotes(prevNotes => 
      prevNotes.map(n => 
        n.id === note.id 
          ? { 
              ...n, 
              likes: isLiked ? n.likes + 1 : n.likes - 1,
              likedBy: isLiked 
                ? [...n.likedBy, userId]
                : n.likedBy.filter(id => id !== userId)
            }
          : n
      )
    );
  };

  if (viewingNote) {
    return (
      <PDFViewer 
        item={viewingNote} 
        type="note"
        onClose={() => setViewingNote(null)}
        onLike={() => handleLike(viewingNote)}
        onDownload={() => handleDownload(viewingNote)}
        isLiked={viewingNote.likedBy?.includes('current-user-id') || false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      
      {/* Ad Banner */}
      <AdBanner 
        imageUrl="/lovable-uploads/86534693-a004-4787-8ce6-8be9d4ed7603.png"
        altText="প্রমোশনাল অ্যাড"
        onClick={() => window.open('/subscription', '_blank')}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Main Search and Upload Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-white" />
              <Input
                placeholder="নোট ব্রাউজ করো"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white placeholder:text-white/80 text-lg rounded-xl"
              />
            </div>
            
            {/* Upload */}
            <Button className="bg-black/30 border border-white/20 text-white hover:bg-white/10 py-3 rounded-xl">
              <Upload className="mr-2 h-5 w-5" />
              নোট আপলোড করো
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="mr-2 h-5 w-5 text-white" />
              <h3 className="text-white text-lg font-semibold">খুঁজে দেখো</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="নোট খুঁজো..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
              />
              
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue placeholder="ক্লাস নির্বাচন" />
                </SelectTrigger>
                <SelectContent className="bg-[#28282B] border-white/20">
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
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue placeholder="সাজান আগে" />
                </SelectTrigger>
                <SelectContent className="bg-[#28282B] border-white/20">
                  <SelectItem value="newest" className="text-white hover:bg-white/10">নতুন আগে</SelectItem>
                  <SelectItem value="popular" className="text-white hover:bg-white/10">জনপ্রিয়</SelectItem>
                  <SelectItem value="downloads" className="text-white hover:bg-white/10">বেশি ডাউনলোড</SelectItem>
                  <SelectItem value="rating" className="text-white hover:bg-white/10">রেটিং</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Note Type Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {noteTypes.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border-white/20 text-white hover:bg-white/10"
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Search Button */}
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-xl">
              <Search className="mr-2 h-5 w-5" />
              খুঁজুন
            </Button>
          </CardContent>
        </View>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300">
            {filteredNotes.length} টি নোট পাওয়া গেছে
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="bg-black/30 border-white/20 text-white hover:bg-white/10"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="bg-black/30 border-white/20 text-white hover:bg-white/10"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">নোট লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredNotes.map((note, index) => {
              const colorClass = gradientColors[index % gradientColors.length];
              return (
                <Card 
                  key={note.id} 
                  className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                  onClick={() => setViewingNote(note)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-full h-32 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg leading-tight">
                      {note.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`bg-gradient-to-r ${colorClass} text-white text-xs`}>
                        {note.class}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 border-gray-600 text-xs">
                        {note.subject}
                      </Badge>
                    </div>

                    <p className="text-gray-400 text-sm">{note.chapter}</p>
                    
                    {note.description && (
                      <p className="text-gray-300 text-sm line-clamp-2">{note.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {note.author}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {note.downloads}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400" />
                        {note.rating}
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(note.uploadDate).toLocaleDateString('bn-BD')}
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(note);
                      }}
                      className={`w-full bg-gradient-to-r ${colorClass} hover:opacity-90 transition-opacity`}
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      ডাউনলোড করুন
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredNotes.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">কোনো নোট পাওয়া যায়নি</h3>
            <p className="text-gray-400">অন্য ফিল্টার ব্যবহার করে আবার চেষ্টা করুন</p>
          </div>
        )}
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Notes;
