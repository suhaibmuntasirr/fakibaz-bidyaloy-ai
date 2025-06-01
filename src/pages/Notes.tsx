
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, BookOpen, Calendar, User, Filter, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClassSelection from '@/components/ClassSelection';
import PDFViewer from '@/components/PDFViewer';
import AIAssistant from '@/components/AIAssistant';
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
  }, [notes, selectedClass, selectedSubject, searchQuery]);

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
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📚 ডিজিটাল নোট সংগ্রহ
          </h1>
          <p className="text-gray-300 text-lg">
            সব ক্লাসের পাঠ্যবইয়ের নোট এক জায়গায় - ডাউনলোড করুন এবং পড়াশোনা করুন
          </p>
        </div>

        {/* Class Selection */}
        <ClassSelection />

        {/* Filters */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="নোট খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-[#28282B] border-white/20">
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="bg-black/30 border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  setSelectedClass('');
                  setSelectedSubject('');
                  setSearchQuery('');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                রিসেট করুন
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">নোট লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          {note.downloadCount}
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
