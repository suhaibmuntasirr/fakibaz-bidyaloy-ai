
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Search, ThumbsUp, MessageCircle, Download, Star, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Note {
  id: string;
  title: string;
  subject: string;
  class: string;
  chapter: string;
  author: string;
  likes: number;
  comments: number;
  downloads: number;
  rating: number;
  tags: string[];
  uploadDate: Date;
  verified: boolean;
}

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const mockNotes: Note[] = [
    {
      id: '1',
      title: 'গণিত - দ্বিঘাত সমীকরণ সমাধান',
      subject: 'গণিত',
      class: 'Class 9',
      chapter: 'Chapter 3',
      author: 'রাহুল আহমেদ',
      likes: 45,
      comments: 12,
      downloads: 89,
      rating: 4.8,
      tags: ['সমীকরণ', 'গণিত', 'অধ্যায়-৩'],
      uploadDate: new Date('2024-01-15'),
      verified: true
    },
    {
      id: '2',
      title: 'Physics - Motion in a Straight Line',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      chapter: 'Chapter 2',
      author: 'সারা খান',
      likes: 32,
      comments: 8,
      downloads: 67,
      rating: 4.5,
      tags: ['motion', 'physics', 'kinematics'],
      uploadDate: new Date('2024-01-10'),
      verified: false
    },
    {
      id: '3',
      title: 'বাংলা ব্যাকরণ - সমাস',
      subject: 'বাংলা',
      class: 'Class 8',
      chapter: 'Chapter 5',
      author: 'তানিয়া রহমান',
      likes: 78,
      comments: 23,
      downloads: 156,
      rating: 4.9,
      tags: ['ব্যাকরণ', 'সমাস', 'বাংলা'],
      uploadDate: new Date('2024-01-20'),
      verified: true
    }
  ];

  const [notes] = useState<Note[]>(mockNotes);

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'বাংলা', 'English', 'গণিত', 'বিজ্ঞান', 'সামাজিক বিজ্ঞান', 
    'ICT', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">নোট শেয়ারিং সিস্টেম</h1>
          <p className="text-gray-300 text-lg">সবার সাথে নোট শেয়ার করো এবং একসাথে শেখো</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              নোট আপলোড করো
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
              
              <Select>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
              
              <Input 
                placeholder="অধ্যায় নাম"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="mr-2 h-4 w-4" />
                আপলোড করো
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
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
              
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="ক্লাস" />
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
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="বিষয়" />
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
          {notes.map((note) => (
            <Card key={note.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-lg leading-tight">
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
                    >
                      <Download className="h-4 w-4 mr-1" />
                      ডাউনলোড
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
