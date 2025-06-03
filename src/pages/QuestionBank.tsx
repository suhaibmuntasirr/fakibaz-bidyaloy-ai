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
  const { toast } = useToast();

  // Sample data
  useEffect(() => {
    const sampleQuestions: QuestionPaper[] = [
      {
        id: '1',
        title: 'গণিত - বার্ষিক পরীক্ষা ২০২৩',
        subject: 'গণিত',
        class: 'Class 10',
        school: 'ঢাকা কলেজিয়েট স্কুল',
        district: 'ঢাকা',
        year: 2023,
        type: 'annual',
        duration: '৩ ঘণ্টা',
        marks: 100,
        downloadUrl: '/sample-question.pdf',
        tags: ['বীজগণিত', 'জ্যামিতি', 'পরিসংখ্যান']
      },
      {
        id: '2',
        title: 'পদার্থবিজ্ঞান - অর্ধবার্ষিক পরীক্ষা ২০২৩',
        subject: 'পদার্থবিজ্ঞান',
        class: 'Class 12',
        school: 'ভিকারুননিসা নূন স্কুল',
        district: 'ঢাকা',
        year: 2023,
        type: 'half-yearly',
        duration: '৩ ঘণ্টা',
        marks: 100,
        downloadUrl: '/sample-physics.pdf',
        tags: ['বলবিদ্যা', 'তাপগতিবিদ্যা', 'আলোকবিদ্যা']
      },
      {
        id: '3',
        title: 'ইংরেজি - টেস্ট পরীক্ষা ২০২৩',
        subject: 'ইংরেজি',
        class: 'Class 9',
        school: 'নটরডেম কলেজ',
        district: 'ঢাকা',
        year: 2023,
        type: 'test',
        duration: '২ ঘণ্টা',
        marks: 75,
        downloadUrl: '/sample-english.pdf',
        tags: ['Grammar', 'Composition', 'Reading Comprehension']
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
    // Simulate download
    toast({
      title: "ডাউনলোড শুরু হয়েছে",
      description: `${question.title} ডাউনলোড হচ্ছে...`,
    });
  };

  const handlePreview = (question: QuestionPaper) => {
    toast({
      title: "প্রিভিউ খোলা হচ্ছে",
      description: `${question.title} প্রিভিউ মোডে খোলা হচ্ছে...`,
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            প্রশ্ন ব্যাংক
          </h1>
          <p className="text-gray-700 text-lg">
            বিভিন্ন স্কুল ও কলেজের পরীক্ষার প্রশ্নপত্র এবং মডেল টেস্ট
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <Upload className="mr-2 h-4 w-4" />
                প্রশ্নপত্র আপলোড করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-800">প্রশ্নপত্র আপলোড করুন</DialogTitle>
              </DialogHeader>
              <PDFUpload onUploadSuccess={handleUploadSuccess} />
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
                placeholder="প্রশ্নপত্র খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 border-gray-200"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="bg-white/60 border-gray-200">
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
                <SelectTrigger className="bg-white/60 border-gray-200">
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
                <SelectTrigger className="bg-white/60 border-gray-200">
                  <SelectValue placeholder="বছর" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব বছর</SelectItem>
                  <SelectItem value="2024">২০২৪</SelectItem>
                  <SelectItem value="2023">২০২৩</SelectItem>
                  <SelectItem value="2022">২০২২</SelectItem>
                  <SelectItem value="2021">২০২১</SelectItem>
                  <SelectItem value="2020">২০২০</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/60 border-gray-200">
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
            <Card key={question.id} className="bg-white/70 backdrop-blur-lg border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-gray-800 line-clamp-2">
                    {question.title}
                  </CardTitle>
                  <Badge className={`${getTypeColor(question.type)} border-0 text-xs`}>
                    {getTypeName(question.type)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{question.subject} • {question.class}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <School className="mr-2 h-4 w-4" />
                    <span className="line-clamp-1">{question.school}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{question.district}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{question.year}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{question.duration} • {question.marks} নম্বর</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {question.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                  {question.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                      +{question.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(question)}
                    className="flex-1 bg-white/70 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    প্রিভিউ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(question)}
                    className="flex-1 bg-white/70 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    ডাউনলোড
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStartExam(question)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  >
                    পরীক্ষা দিন
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">কোনো প্রশ্নপত্র পাওয়া যায়নি</h3>
            <p className="text-gray-500">অন্য ফিল্টার ব্যবহার করে চেষ্টা করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
