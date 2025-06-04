
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
  Play
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import ExamSystem from '@/components/ExamSystem';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/types/common';

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [examQuestion, setExamQuestion] = useState<Question | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Sample questions data
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
        fileSize: 2500000
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
        fileSize: 1800000
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
        fileSize: 3200000
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

    setFilteredQuestions(filtered);
  }, [questions, searchQuery, selectedClass, selectedSubject, selectedExamType]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="প্রশ্নপত্র খুঁজুন..."
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
            প্রশ্নপত্র আপলোড করুন
          </Button>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:border-white/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{question.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-blue-600/20 text-blue-300">{question.class}</Badge>
                      <Badge className="bg-green-600/20 text-green-300">{question.subject}</Badge>
                      <Badge className="bg-purple-600/20 text-purple-300">
                        {getExamTypeLabel(question.examType)}
                      </Badge>
                      {question.verified && (
                        <Badge className="bg-yellow-600/20 text-yellow-300">✓ যাচাইকৃত</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{question.school}</p>
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
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
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

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-4xl bg-[#28282B] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">প্রশ্নপত্র আপলোড করুন</DialogTitle>
          </DialogHeader>
          <PDFUpload onClose={() => setShowUpload(false)} />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-[#28282B] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{selectedQuestion?.title}</span>
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
          {selectedQuestion && (
            <div className="max-h-[80vh] overflow-auto">
              <PDFViewer 
                note={selectedQuestion} 
                onBack={() => setShowPreview(false)} 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exam Dialog */}
      <Dialog open={showExam} onOpenChange={setShowExam}>
        <DialogContent className="max-w-6xl max-h-[95vh] bg-[#28282B] border-white/20 text-white">
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
    </div>
  );
};

export default QuestionBank;
