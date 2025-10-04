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
      
      <div className="container mx-auto px-4 pt-28 pb-8">
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
        <div className="mb-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-[1px]">
          <div className="p-6 bg-transparent rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="relative md:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="প্রশ্নপত্র খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-600/30 border-0 text-white placeholder:text-gray-400 rounded-full"
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-600/30 border-0 text-white rounded-full px-4 py-2"
              >
                <option value="">সব ক্লাস</option>
                {classes.map(cls => (
                  <option key={cls} value={cls} className="bg-gray-800">{cls}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-gray-600/30 border-0 text-white rounded-full px-4 py-2"
              >
                <option value="">সব বিষয়</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="bg-gray-800">{subject}</option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-gray-600/30 border-0 text-white rounded-full px-4 py-2"
              >
                <option value="">সব জেলা</option>
                {districts.map(district => (
                  <option key={district} value={district} className="bg-gray-800">{district}</option>
                ))}
              </select>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="bg-gray-600/30 border-0 text-white rounded-full px-4 py-2"
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
                className="bg-gray-600/30 border-0 text-white rounded-full px-4 py-2"
              >
                <option value="">সব ধরণ</option>
                {examTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-gray-800">{type.label}</option>
                ))}
              </select>
              <div className="flex items-center justify-between gap-4">
                <div className="text-white text-sm flex items-center">
                  <School className="mr-1 h-3 w-3" />
                  মোট {filteredQuestions.length} টি প্রশ্নপত্র পাওয়া গেছে
                </div>
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  প্রশ্নপত্র আপলোড করুন
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-card/50 backdrop-blur border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg flex-1">{question.title}</CardTitle>
                  {question.verified && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{question.class}</Badge>
                  <Badge variant="secondary">{question.subject}</Badge>
                  <Badge variant="outline">{getExamTypeLabel(question.examType)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium truncate">{question.school}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {question.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {question.marks} নম্বর
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {question.downloads}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{question.author}</p>
                    <p className="text-xs text-muted-foreground">{question.year}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStartExam(question)}
                    size="sm"
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    পরীক্ষা শুরু করুন
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(question)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(question)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
