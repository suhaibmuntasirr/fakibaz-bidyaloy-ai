
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Search, ThumbsUp, MessageCircle, Download, Star, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import { notesService, Note } from '@/services/notesService';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState('browse');
  
  const { currentUser } = useAuth();
  const { requireAuth } = useAuthAction();
  const { toast } = useToast();

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'বাংলা', 'English', 'গণিত', 'বিজ্ঞান', 'সামাজিক বিজ্ঞান', 
    'ICT', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত'
  ];

  // Load notes on component mount
  useEffect(() => {
    const loadedNotes = notesService.getAllNotes();
    setNotes(loadedNotes);
    setFilteredNotes(loadedNotes);
  }, []);

  // Filter notes when search parameters change
  useEffect(() => {
    const filtered = notesService.searchNotes(searchQuery, {
      class: selectedClass,
      subject: selectedSubject,
      sortBy
    });
    setFilteredNotes(filtered);
  }, [searchQuery, selectedClass, selectedSubject, sortBy]);

  const handleNoteClick = (note: Note) => {
    requireAuth(() => {
      setSelectedNote(note);
    });
  };

  const handleLike = (noteId: string) => {
    requireAuth(() => {
      if (!currentUser) return;
      
      const liked = notesService.likeNote(noteId, currentUser.uid);
      
      // Update local state
      const updatedNotes = notes.map(note => 
        note.id === noteId ? notesService.getNoteById(noteId)! : note
      );
      setNotes(updatedNotes);
      setFilteredNotes(notesService.searchNotes(searchQuery, {
        class: selectedClass,
        subject: selectedSubject,
        sortBy
      }));

      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(notesService.getNoteById(noteId)!);
      }

      toast({
        title: liked ? "লাইক দেওয়া হয়েছে!" : "লাইক সরানো হয়েছে",
        description: liked ? "নোটটি আপনার পছন্দের তালিকায় যোগ হয়েছে" : "নোটটি পছন্দের তালিকা থেকে সরানো হয়েছে"
      });
    });
  };

  const handleDownload = (noteId: string) => {
    requireAuth(() => {
      notesService.downloadNote(noteId);
      
      // Update local state
      const updatedNotes = notes.map(note => 
        note.id === noteId ? notesService.getNoteById(noteId)! : note
      );
      setNotes(updatedNotes);
      setFilteredNotes(notesService.searchNotes(searchQuery, {
        class: selectedClass,
        subject: selectedSubject,
        sortBy
      }));

      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(notesService.getNoteById(noteId)!);
      }

      toast({
        title: "ডাউনলোড শুরু হয়েছে!",
        description: "নোটটি ডাউনলোড হচ্ছে..."
      });
    });
  };

  const handleUploadSuccess = () => {
    const loadedNotes = notesService.getAllNotes();
    setNotes(loadedNotes);
    setFilteredNotes(loadedNotes);
    setActiveTab('browse');
  };

  const isNoteLiked = (note: Note): boolean => {
    return currentUser ? note.likedBy.includes(currentUser.uid) : false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">নোট শেয়ারিং সিস্টেম</h1>
          <p className="text-gray-300 text-lg">সবার সাথে নোট শেয়ার করো এবং একসাথে শেখো</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger value="browse" className="text-white data-[state=active]:bg-white/20">
              <Eye className="mr-2 h-4 w-4" />
              নোট ব্রাউজ করুন
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-white data-[state=active]:bg-white/20">
              <Upload className="mr-2 h-4 w-4" />
              নোট আপলোড করুন
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter Section */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative md:col-span-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="নোট খুঁজে দেখো..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <Select value={selectedClass || undefined} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="ক্লাস" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">সব ক্লাস</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls} className="text-white hover:bg-white/10">
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSubject || undefined} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="বিষয়" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">সব বিষয়</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="সাজানো" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="newest" className="text-white hover:bg-white/10">নতুন</SelectItem>
                      <SelectItem value="popular" className="text-white hover:bg-white/10">জনপ্রিয়</SelectItem>
                      <SelectItem value="rating" className="text-white hover:bg-white/10">রেটিং</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-white text-lg leading-tight" onClick={() => handleNoteClick(note)}>
                        {note.title}
                      </CardTitle>
                      {note.verified && (
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          যাচাইকৃত
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span>{note.class}</span>
                      <span>•</span>
                      <span>{note.subject}</span>
                      <span>•</span>
                      <span>{note.chapter}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-300">
                        লেখক: <span className="text-white">{note.author}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="bg-blue-600/30 text-blue-300 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {note.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {note.comments}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {note.downloads}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {note.rating}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(note.id);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          ডাউনলোড
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${
                            isNoteLiked(note) 
                              ? 'bg-red-600/20 border-red-500/20 text-red-300' 
                              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(note.id);
                          }}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">কোন নোট পাওয়া যায়নি</div>
                <p className="text-gray-500">অন্য কিছু খুঁজে দেখুন বা নতুন নোট আপলোড করুন</p>
              </div>
            )}
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <PDFUpload type="note" onUploadSuccess={handleUploadSuccess} />
          </TabsContent>
        </Tabs>

        {/* PDF Viewer Modal */}
        {selectedNote && (
          <PDFViewer
            item={selectedNote}
            type="note"
            onClose={() => setSelectedNote(null)}
            onLike={() => handleLike(selectedNote.id)}
            onDownload={() => handleDownload(selectedNote.id)}
            isLiked={isNoteLiked(selectedNote)}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
