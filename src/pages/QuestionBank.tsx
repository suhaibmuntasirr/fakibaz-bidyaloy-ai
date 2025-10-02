import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Eye, 
  BookOpen, 
  Upload, 
  Clock,
  Award,
  Users,
  X,
  Play,
  School,
  Plus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import ExamSystem from '@/components/ExamSystem';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/types/common';
import heroBackground from '@/assets/hero-background.png';

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [examQuestion, setExamQuestion] = useState<Question | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Enhanced sample questions data with more institutes
    const sampleQuestions: Question[] = [
      {
        id: '1',
        title: 'HSC পদার্থবিজ্ঞান - ২০২৩',
        subject: 'পদার্থবিজ্ঞান',
        class: 'Class 12',
        school: 'ঢাকা কলেজ',
        district: 'ঢাকা',
        year: 2023,
        examType: 'annual',
        duration: '৩ ঘন্টা',
        marks: 100,
        downloadUrl: '/sample-physics-question.pdf',
        tags: ['HSC', 'পদার্থবিজ্ঞান', '২০২৩'],
        author: 'পরীক্ষা বোর্ড',
        authorId: 'board1',
        uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        likes: 45,
        likedBy: [],
        downloads: 120,
        comments: 8,
        rating: 4.5,
        verified: true,
        fileUrl: '/sample-physics-question.pdf',
        fileName: 'hsc-physics-2023.pdf',
        fileSize: 2500000,
        chapter: 'তরঙ্গ ও শব্দ',
        description: 'HSC পদার্থবিজ্ঞান বার্ষিক পরীক্ষার প্রশ্নপত্র - তরঙ্গ ও শব্দ অধ্যায়ের উপর বিস্তৃত প্রশ্ন'
      },
      {
        id: '2',
        title: 'SSC গণিত টেস্ট পেপার',
        subject: 'গণিত',
        class: 'Class 10',
        school: 'মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়',
        district: 'ঢাকা',
        year: 2023,
        examType: 'test',
        duration: '২ ঘন্টা',
        marks: 75,
        downloadUrl: '/sample-math-test.pdf',
        tags: ['SSC', 'গণিত', 'টেস্ট'],
        author: 'আব্দুর রহমান স্যার',
        authorId: 'teacher1',
        uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        likes: 32,
        likedBy: [],
        downloads: 89,
        comments: 12,
        rating: 4.2,
        verified: false,
        fileUrl: '/sample-math-test.pdf',
        fileName: 'ssc-math-test.pdf',
        fileSize: 1800000,
        chapter: 'বীজগণিত',
        description: 'SSC গণিত বীজগণিত অধ্যায়ের উপর টেস্ট পরীক্ষার প্রশ্নপত্র'
      },
      {
        id: '3',
        title: 'রসায়ন অর্ধবার্ষিক পরীক্ষা',
        subject: 'রসায়ন',
        class: 'Class 11',
        school: 'নটরডেম কলেজ',
        district: 'ঢাকা',
        year: 2023,
        examType: 'half-yearly',
        duration: '২ ঘন্টা ৩০ মিনিট',
        marks: 80,
        downloadUrl: '/sample-chemistry.pdf',
        tags: ['রসায়ন', 'অর্ধবার্ষিক'],
        author: 'সালমা আক্তার ম্যাডাম',
        authorId: 'teacher2',
        uploadDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        likes: 28,
        likedBy: [],
        downloads: 67,
        comments: 5,
        rating: 4.0,
        verified: true,
        fileUrl: '/sample-chemistry.pdf',
        fileName: 'chemistry-half-yearly.pdf',
        fileSize: 3200000,
        chapter: 'জৈব রসায়ন',
        description: 'একাদশ শ্রেণী রসায়ন জৈব রসায়ন অধ্যায়ের অর্ধবার্ষিক পরীক্ষার প্রশ্নপত্র'
      },
      {
        id: '4',
        title: 'জীববিজ্ঞান মডেল টেস্ট',
        subject: 'জীববিজ্ঞান',
        class: 'Class 11',
        school: 'রাজশাহী কলেজ',
        district: 'রাজশাহী',
        year: 2023,
        examType: 'model',
        duration: '২ ঘন্টা ৪৫ মিনিট',
        marks: 85,
        downloadUrl: '/sample-biology.pdf',
        tags: ['জীববিজ্ঞান', 'মডেল'],
        author: 'ড. করিম স্যার',
        authorId: 'teacher3',
        uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        likes: 38,
        likedBy: [],
        downloads: 95,
        comments: 15,
        rating: 4.3,
        verified: true,
        fileUrl: '/sample-biology.pdf',
        fileName: 'biology-model-test.pdf',
        fileSize: 2800000,
        chapter: 'কোষ বিভাজন',
        description: 'একাদশ শ্রেণী জীববিজ্ঞান কোষ বিভাজন অধ্যায়ের মডেল টেস্ট'
      },
      {
        id: '5',
        title: 'ইংরেজি বার্ষিক পরীক্ষা',
        subject: 'ইংরেজি',
        class: 'Class 9',
        school: 'চট্টগ্রাম কলেজিয়েট স্কুল',
        district: 'চট্টগ্রাম',
        year: 2023,
        examType: 'annual',
        duration: '৩ ঘন্টা',
        marks: 100,
        downloadUrl: '/sample-english.pdf',
        tags: ['ইংরেজি', 'বার্ষিক'],
        author: 'মিসেস রহমান',
        authorId: 'teacher4',
        uploadDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        likes: 42,
        likedBy: [],
        downloads: 110,
        comments: 18,
        rating: 4.1,
        verified: true,
        fileUrl: '/sample-english.pdf',
        fileName: 'english-annual.pdf',
        fileSize: 2200000,
        chapter: 'Grammar & Composition',
        description: 'নবম শ্রেণী ইংরেজি বার্ষিক পরীক্ষার প্রশ্নপত্র'
      }
    ];
    setQuestions(sampleQuestions);
    setFilteredQuestions(sampleQuestions);
  }, []);

  // Filter questions based on search and filters
  useEffect(() => {
    let filtered = questions;

    if (searchQuery) {
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(question => question.class === selectedClass);
    }

    if (selectedSubject) {
      filtered = filtered.filter(question => question.subject === selectedSubject);
    }

    if (selectedExamType) {
      filtered = filtered.filter(question => question.examType === selectedExamType);
    }

    if (selectedDistrict) {
      filtered = filtered.filter(question => question.district === selectedDistrict);
    }

    if (selectedSchool) {
      filtered = filtered.filter(question => question.school === selectedSchool);
    }

    setFilteredQuestions(filtered);
  }, [questions, searchQuery, selectedClass, selectedSubject, selectedExamType, selectedDistrict, selectedSchool]);

  const handleDownload = (question: Question) => {
    toast({
      title: "ডাউনলোড শুরু",
      description: `"${question.title}" ডাউনলোড হচ্ছে...`,
    });
    
    // Update download count
    setQuestions(prev => prev.map(q => 
      q.id === question.id 
        ? { ...q, downloads: q.downloads + 1 }
        : q
    ));
  };

  const handlePreview = (question: Question) => {
    setSelectedQuestion(question);
    setShowPreview(true);
  };

  const handleStartExam = (question: Question) => {
    setExamQuestion(question);
    setShowExam(true);
    toast({
      title: "পরীক্ষা শুরু",
      description: `"${question.title}" এর পরীক্ষা শুরু হচ্ছে...`,
    });
  };

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case 'test': return 'টেস্ট';
      case 'annual': return 'বার্ষিক';
      case 'half-yearly': return 'অর্ধবার্ষিক';
      case 'model': return 'মডেল টেস্ট';
      default: return 'অন্যান্য';
    }
  };

  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'ইংরেজি', 'বাংলা', 'ইতিহাস', 'ভূগোল'];
  const examTypes = [
    { value: 'test', label: 'টেস্ট' },
    { value: 'annual', label: 'বার্ষিক' },
    { value: 'half-yearly', label: 'অর্ধবার্ষিক' },
    { value: 'model', label: 'মডেল টেস্ট' }
  ];
  const districts = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];
  
  // Get unique schools from questions
  const schools = [...new Set(questions.map(q => q.school))];

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            প্রশ্ন ব্যাংক
          </h1>
          <p className="text-gray-300 text-lg">
            বিভিন্ন পরীক্ষার প্রশ্নপত্র এবং মডেল টেস্ট
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border-2 border-transparent bg-gradient-to-b from-white/20 to-transparent rounded-3xl p-[2px]">
          <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="relative md:col-span-2 lg:col-span-2">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="প্রশ্নপত্র খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white/5 backdrop-blur-lg border-2 border-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-border rounded-2xl text-white placeholder:text-gray-300 [background-clip:padding-box,border-box] [background-origin:padding-box,border-box] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05),rgba(255,255,255,0.05)),linear-gradient(to_right,white,#93c5fd,#1e3a8a,#a855f7,#ec4899)]"
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
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="">সব জেলা</option>
                {districts.map(district => (
                  <option key={district} value={district} className="bg-gray-800">{district}</option>
                ))}
              </select>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="">সব প্রতিষ্ঠান</option>
                {schools.map(school => (
                  <option key={school} value={school} className="bg-gray-800">{school}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="">সব ধরণ</option>
                {examTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-gray-800">{type.label}</option>
                ))}
              </select>
              <div className="text-white text-sm flex items-center">
                <School className="mr-1 h-3 w-3" />
                মোট {filteredQuestions.length} টি প্রশ্নপত্র পাওয়া গেছে
              </div>
            </div>
            </CardContent>
          </div>
        </Card>

        {/* Upload Button */}
        <div className="mb-8 text-center">
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-blue-900 via-purple-700 to-purple-400 hover:from-blue-950 hover:via-purple-800 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-5 w-5" />
            প্রশ্নপত্র আপলোড করুন
          </Button>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question, index) => {
            // Color palette for oval sections and borders
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
              <Card key={question.id} className={`relative bg-transparent backdrop-blur-xl overflow-hidden rounded-3xl border-2 border-transparent p-[2px] bg-gradient-to-b from-white to-${colorSet.gradient.split(' ')[1].replace('to-', '')} bg-clip-border hover:shadow-2xl transition-all duration-300`}>
                <div className="bg-gradient-to-br from-slate-900/40 to-purple-900/40 backdrop-blur-2xl rounded-3xl h-full">
                  {/* Oval colored title section - 15% of card with blur below */}
                  <div className="relative">
                    <div className={`relative h-16 bg-gradient-to-br ${colorSet.gradient} rounded-b-[3rem] flex items-center justify-center px-6`}>
                    <CardTitle className="text-white text-base font-bold text-center leading-tight">
                      {question.title}
                    </CardTitle>
                  </div>
                  {/* Enhanced blur effect below oval */}
                  <div className={`absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-b ${colorSet.gradient} blur-2xl opacity-60`}></div>
                </div>
                
                {/* Card content */}
                <CardHeader className="pt-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/20">{question.class}</Badge>
                    <Badge className="bg-green-600/20 text-green-300 border-green-400/20">{question.subject}</Badge>
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/20">
                      {getExamTypeLabel(question.examType)}
                    </Badge>
                    {question.verified && (
                      <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-400/20">✓ যাচাইকৃত</Badge>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm flex items-center">
                    <School className="mr-1 h-3 w-3" />
                    {question.school}
                  </p>
                <p className="text-gray-400 text-xs">{question.district} • {question.year}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {question.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">{question.author}</p>
                      <p className="text-gray-400 text-xs">
                        {Math.floor((Date.now() - question.uploadDate.getTime()) / (1000 * 60 * 60 * 24))} দিন আগে
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {(question.fileSize / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>

                {/* Exam Info */}
                <div className="bg-black/20 p-3 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{question.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Award className="h-3 w-3 mr-1" />
                      <span>{question.marks} নম্বর</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-gray-400 border-gray-600 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{question.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{question.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => handleStartExam(question)}
                    className="w-full bg-gradient-to-r from-red-500 via-pink-500 via-purple-500 via-blue-600 to-cyan-400 hover:opacity-90 transition-opacity rounded-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    পরীক্ষা দিন
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handlePreview(question)}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      প্রিভিউ
                    </Button>
                    <Button
                      onClick={() => handleDownload(question)}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      ডাউনলোড
                    </Button>
                  </div>
                  </div>
                </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">কোন প্রশ্নপত্র পাওয়া যায়নি</h3>
            <p className="text-gray-500">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন</p>
          </div>
        )}
      </div>

      {/* Upload Dialog - Fixed positioning */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] bg-[#28282B] border-white/20 text-white overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white">প্রশ্নপত্র আপলোড করুন</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <PDFUpload 
              type="question"
              onUploadSuccess={() => setShowUpload(false)}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {showPreview && selectedQuestion && (
        <PDFViewer 
          item={selectedQuestion}
          type="question"
          onClose={() => setShowPreview(false)}
          onLike={() => {}}
          onDownload={() => handleDownload(selectedQuestion)}
          isLiked={false}
        />
      )}

      {/* Exam Dialog */}
      <Dialog open={showExam} onOpenChange={setShowExam}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] bg-[#28282B] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>পরীক্ষা: {examQuestion?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExam(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {examQuestion && (
            <div className="max-h-[85vh] overflow-auto">
              <ExamSystem 
                questionPaper={examQuestion}
                onExit={() => setShowExam(false)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default QuestionBank;
