import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Download, Eye, Calendar, Clock, School, MapPin, Upload, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import ExamSystem from '@/components/ExamSystem';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import { useToast } from '@/hooks/use-toast';

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  class: string;
  school: string;
  district: string;
  year: number;
  type: 'test' | 'annual' | 'half-yearly' | 'model';
  duration: string;
  marks: number;
  downloadUrl: string;
  previewUrl?: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uploader: string;
  uploaderId: string;
  views: number;
  likes: number;
  answers: number;
  hasAnswerKey: boolean;
  uploadDate: Date;
  verified: boolean;
  questionFileUrl: string;
  answerFileUrl?: string;
  fileName: string;
  answerFileName?: string;
  likedBy: string[];
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState<QuestionPaper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showExamSystem, setShowExamSystem] = useState(false);
  const [selectedQuestionPaper, setSelectedQuestionPaper] = useState<QuestionPaper | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<QuestionPaper | null>(null);
  const { toast } = useToast();

  // Sample data
  useEffect(() => {
    const sampleQuestions: QuestionPaper[] = [
      {
        id: '1',
        title: 'Class 10 Chemistry Model Test',
        subject: 'রসায়ন',
        class: 'Class 10',
        school: 'ঢাকা কলেজিয়েট স্কুল',
        district: 'ঢাকা',
        year: 2024,
        type: 'test',
        duration: '৩ ঘণ্টা',
        marks: 75,
        downloadUrl: '/sample-question.pdf',
        tags: ['মডেল টেস্ট', 'জৈব যৌগ'],
        difficulty: 'Easy',
        uploader: 'শিক্ষক আব্দুল',
        uploaderId: 'teacher1',
        views: 567,
        likes: 45,
        answers: 23,
        hasAnswerKey: true,
        uploadDate: new Date('2024-01-15'),
        verified: true,
        questionFileUrl: '/sample-question.pdf',
        answerFileUrl: '/sample-answer.pdf',
        fileName: 'chemistry-model-test.pdf',
        answerFileName: 'chemistry-answer-key.pdf',
        likedBy: []
      },
      {
        id: '2',
        title: 'HSC Physics MCQ - 2024',
        subject: 'পদার্থবিজ্ঞান',
        class: 'HSC',
        school: 'ভিকারুননিসা নূন স্কুল',
        district: 'ঢাকা',
        year: 2024,
        type: 'annual',
        duration: '২ ঘণ্টা',
        marks: 50,
        downloadUrl: '/sample-physics.pdf',
        tags: ['বার্ষিক পরীক্ষা', 'MCQ'],
        difficulty: 'Medium',
        uploader: 'শিক্ষক রহমান',
        uploaderId: 'teacher2',
        views: 1250,
        likes: 85,
        answers: 42,
        hasAnswerKey: true,
        uploadDate: new Date('2024-02-10'),
        verified: true,
        questionFileUrl: '/sample-physics.pdf',
        fileName: 'physics-mcq-2024.pdf',
        likedBy: []
      },
      {
        id: '3',
        title: 'SSC Mathematics CQ - 2023',
        subject: 'গণিত',
        class: 'SSC',
        school: 'নটরডেম কলেজ',
        district: 'ঢাকা',
        year: 2023,
        type: 'half-yearly',
        duration: '৩ ঘণ্টা',
        marks: 100,
        downloadUrl: '/sample-math.pdf',
        tags: ['নির্বাচনী পরীক্ষা', 'CQ'],
        difficulty: 'Hard',
        uploader: 'শিক্ষক করিম',
        uploaderId: 'teacher3',
        views: 890,
        likes: 63,
        answers: 31,
        hasAnswerKey: true,
        uploadDate: new Date('2023-12-05'),
        verified: true,
        questionFileUrl: '/sample-math.pdf',
        fileName: 'math-cq-2023.pdf',
        likedBy: []
      }
    ];
    setQuestions(sampleQuestions);
  }, []);

  const filteredQuestions = questions.filter(question => {
    return (
      (searchQuery === '' || 
       question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       question.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
       question.school.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedClass === 'all' || question.class === selectedClass) &&
      (selectedSubject === 'all' || question.subject === selectedSubject) &&
      (selectedSchool === 'all' || question.school === selectedSchool) &&
      (selectedDistrict === 'all' || question.district === selectedDistrict) &&
      (selectedYear === 'all' || question.year.toString() === selectedYear) &&
      (selectedType === 'all' || question.type === selectedType)
    );
  });

  const handleDownload = (question: QuestionPaper) => {
    // Update download count
    setQuestions(prev => prev.map(q => 
      q.id === question.id ? { ...q, views: q.views + 1 } : q
    ));
    
    toast({
      title: "ডাউনলোড শুরু হয়েছে",
      description: `${question.title} ডাউনলোড হচ্ছে...`,
    });
  };

  const handlePreview = (question: QuestionPaper) => {
    setViewingQuestion(question);
  };

  const handleStartExam = (question: QuestionPaper) => {
    setSelectedQuestionPaper(question);
    setShowExamSystem(true);
  };

  const handleUploadSuccess = () => {
    toast({
      title: "প্রশ্নপত্র আপলোড সম্পন্ন",
      description: "আপনার প্রশ্নপত্র সফলভাবে আপলোড হয়েছে এবং পর্যালোচনার জন্য পাঠানো হয়েছে।",
    });
    setShowUploadDialog(false);
  };

  const handleUploadCancel = () => {
    setShowUploadDialog(false);
  };

  const handleLike = (question: QuestionPaper) => {
    const userId = 'current-user-id';
    const isLiked = question.likedBy.includes(userId);
    
    setQuestions(prev => prev.map(q => 
      q.id === question.id 
        ? { 
            ...q, 
            likes: isLiked ? q.likes - 1 : q.likes + 1,
            likedBy: isLiked 
              ? q.likedBy.filter(id => id !== userId)
              : [...q.likedBy, userId]
          }
        : q
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-red-500/20 text-red-300';
      case 'half-yearly': return 'bg-blue-500/20 text-blue-300';
      case 'test': return 'bg-green-500/20 text-green-300';
      case 'model': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'annual': return 'বার্ষিক';
      case 'half-yearly': return 'অর্ধবার্ষিক';
      case 'test': return 'টেস্ট';
      case 'model': return 'মডেল';
      default: return type;
    }
  };

  if (showExamSystem && selectedQuestionPaper) {
    return (
      <ExamSystem 
        questionPaper={selectedQuestionPaper}
        onExit={() => {
          setShowExamSystem(false);
          setSelectedQuestionPaper(null);
        }}
      />
    );
  }

  if (viewingQuestion) {
    return (
      <PDFViewer 
        item={viewingQuestion} 
        type="question"
        onClose={() => setViewingQuestion(null)}
        onLike={() => handleLike(viewingQuestion)}
        onDownload={() => handleDownload(viewingQuestion)}
        isLiked={viewingQuestion.likedBy?.includes('current-user-id') || false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            প্রশ্ন ব্যাংক
          </h1>
          <p className="text-blue-100 text-lg">
            বিভিন্ন বোর্ড ও পরীক্ষার প্রশ্নপত্র
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 backdrop-blur-lg">
                <Upload className="mr-2 h-4 w-4" />
                প্রশ্ন আপলোড করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-800">প্রশ্নপত্র আপলোড করুন</DialogTitle>
              </DialogHeader>
              <PDFUpload 
                type="question"
                onUploadSuccess={handleUploadSuccess}
                onCancel={handleUploadCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="mr-2 h-5 w-5" />
              খুঁজে নিন
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="প্রশ্নপত্র খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="সব ক্লাস" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">সব ক্লাস</SelectItem>
                  <SelectItem value="Class 6" className="text-white">Class 6</SelectItem>
                  <SelectItem value="Class 7" className="text-white">Class 7</SelectItem>
                  <SelectItem value="Class 8" className="text-white">Class 8</SelectItem>
                  <SelectItem value="Class 9" className="text-white">Class 9</SelectItem>
                  <SelectItem value="Class 10" className="text-white">Class 10</SelectItem>
                  <SelectItem value="SSC" className="text-white">SSC</SelectItem>
                  <SelectItem value="HSC" className="text-white">HSC</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="সব বিষয়" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">সব বিষয়</SelectItem>
                  <SelectItem value="গণিত" className="text-white">গণিত</SelectItem>
                  <SelectItem value="পদার্থবিজ্ঞান" className="text-white">পদার্থবিজ্ঞান</SelectItem>
                  <SelectItem value="রসায়ন" className="text-white">রসায়ন</SelectItem>
                  <SelectItem value="জীববিজ্ঞান" className="text-white">জীববিজ্ঞান</SelectItem>
                  <SelectItem value="ইংরেজি" className="text-white">ইংরেজি</SelectItem>
                  <SelectItem value="বাংলা" className="text-white">বাংলা</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="প্রতিষ্ঠান" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব প্রতিষ্ঠান</SelectItem>
                  <SelectItem value="ঢাকা কলেজিয়েট স্কুল">ঢাকা কলেজিয়েট স্কুল</SelectItem>
                  <SelectItem value="ভিকারুননিসা নূন স্কুল">ভিকারুননিসা নূন স্কুল</SelectItem>
                  <SelectItem value="নটরডেম কলেজ">নটরডেম কলেজ</SelectItem>
                  <SelectItem value="ধানমন্ডি গভর্নমেন্ট বয়েজ হাই স্কুল">ধানমন্ডি গভর্নমেন্ট বয়েজ হাই স্কুল</SelectItem>
                  <SelectItem value="আইডিয়াল স্কুল এন্ড কলেজ">আইডিয়াল স্কুল এন্ড কলেজ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="জেলা" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব জেলা</SelectItem>
                  <SelectItem value="ঢাকা">ঢাকা</SelectItem>
                  <SelectItem value="চট্টগ্রাম">চট্টগ্রাম</SelectItem>
                  <SelectItem value="সিলেট">সিলেট</SelectItem>
                  <SelectItem value="রাজশাহী">রাজশাহী</SelectItem>
                  <SelectItem value="খুলনা">খুলনা</SelectItem>
                  <SelectItem value="বরিশাল">বরিশাল</SelectItem>
                  <SelectItem value="রংপুর">রংপুর</SelectItem>
                  <SelectItem value="ময়মনসিংহ">ময়মনসিংহ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="বছর" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব বছর</SelectItem>
                  <SelectItem value="2024">২০২৪</SelectItem>
                  <SelectItem value="2023">২০২৩</SelectItem>
                  <SelectItem value="2022">২০২২</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="ধরন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব ধরন</SelectItem>
                  <SelectItem value="annual">বার্ষিক</SelectItem>
                  <SelectItem value="half-yearly">অর্ধবার্ষিক</SelectItem>
                  <SelectItem value="test">টেস্ট</SelectItem>
                  <SelectItem value="model">মডেল</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {question.title}
                  </CardTitle>
                  <Badge className={`${getTypeColor(question.type)} border-0 text-xs`}>
                    {getTypeName(question.type)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${getDifficultyColor(question.difficulty)} text-xs border`}>
                    {question.difficulty}
                  </Badge>
                  {question.verified && (
                    <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                      জনপ্রিয়
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-blue-200">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{question.subject} • {question.class}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <School className="mr-2 h-4 w-4" />
                    <span className="line-clamp-1">{question.school}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{question.year}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{question.duration} • {question.marks} নম্বর</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-blue-300">
                  <div className="flex items-center space-x-4">
                    <span>👁️ {question.views}</span>
                    <span>📥 {question.likes}</span>
                    <span>💬 {question.answers}</span>
                  </div>
                  <span>শিক্ষক রহমান</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(question)}
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    দেখুন
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(question)}
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    ডাউনলোড
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStartExam(question)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    পরীক্ষা
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">কোনো প্রশ্নপত্র পাওয়া যায়নি</h3>
            <p className="text-blue-200">অন্য ফিল্টার ব্যবহার করে চেষ্টা করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
