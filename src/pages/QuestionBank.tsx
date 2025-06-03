
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Star, 
  Clock, 
  User, 
  BookOpen,
  FileText,
  GraduationCap,
  TrendingUp,
  Calendar,
  ThumbsUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFViewer, { Question } from '@/components/PDFViewer';
import PDFUpload from '@/components/PDFUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ExamSystem from '@/components/ExamSystem';

const QuestionBank = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<Question | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [likedQuestions, setLikedQuestions] = useState<string[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Sample question papers data
  const [questionPapers] = useState<Question[]>([
    {
      id: '1',
      title: 'HSC Physics MCQ - 2024',
      subject: 'পদার্থবিজ্ঞান',
      class: 'HSC',
      school: 'ঢাকা কলেজ',
      year: 2024,
      examType: 'বার্ষিক পরীক্ষা',
      difficulty: 'Medium',
      marks: 50,
      uploader: 'শিক্ষক রহমান',
      uploaderId: 'teacher1',
      views: 1250,
      likes: 85,
      answers: 12,
      hasAnswerKey: true,
      uploadDate: new Date('2024-01-15'),
      verified: true,
      questionFileUrl: '/sample-mcq.pdf',
      answerFileUrl: '/sample-mcq-answers.pdf',
      fileName: 'HSC_Physics_MCQ_2024.pdf',
      answerFileName: 'HSC_Physics_MCQ_2024_Answers.pdf',
      likedBy: []
    },
    {
      id: '2',
      title: 'SSC Mathematics CQ - 2023',
      subject: 'গণিত',
      class: 'SSC',
      school: 'চট্টগ্রাম কলেজিয়েট স্কুল',
      year: 2023,
      examType: 'নির্বাচনী পরীক্ষা',
      difficulty: 'Hard',
      marks: 100,
      uploader: 'শিক্ষক করিম',
      uploaderId: 'teacher2',
      views: 890,
      likes: 63,
      answers: 8,
      hasAnswerKey: false,
      uploadDate: new Date('2023-12-20'),
      verified: true,
      questionFileUrl: '/sample-cq.pdf',
      fileName: 'SSC_Mathematics_CQ_2023.pdf',
      likedBy: []
    },
    {
      id: '3',
      title: 'Class 10 Chemistry Model Test',
      subject: 'রসায়ন',
      class: 'Class 10',
      school: 'সিলেট সরকারি উচ্চ বিদ্যালয়',
      year: 2024,
      examType: 'মডেল টেস্ট',
      difficulty: 'Easy',
      marks: 75,
      uploader: 'শিক্ষক আলম',
      uploaderId: 'teacher3',
      views: 567,
      likes: 45,
      answers: 15,
      hasAnswerKey: true,
      uploadDate: new Date('2024-02-10'),
      verified: false,
      questionFileUrl: '/sample-mixed.pdf',
      answerFileUrl: '/sample-mixed-answers.pdf',
      fileName: 'Class10_Chemistry_Model_2024.pdf',
      answerFileName: 'Class10_Chemistry_Model_2024_Answers.pdf',
      likedBy: []
    }
  ]);

  const classes = ['All', 'HSC', 'SSC', 'Class 10', 'Class 9', 'Class 8'];
  const subjects = ['All', 'গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'বাংলা', 'ইংরেজি'];

  const filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === '' || selectedClass === 'All' || paper.class === selectedClass;
    const matchesSubject = selectedSubject === '' || selectedSubject === 'All' || paper.subject === selectedSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  const handleDownload = (paper: Question) => {
    toast({
      title: "ডাউনলোড শুরু হয়েছে",
      description: `"${paper.title}" ডাউনলোড হচ্ছে`,
    });
  };

  const handleView = (paper: Question) => {
    setSelectedPaper(paper);
  };

  const handleLike = (questionId: string) => {
    setLikedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
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
      case 'mcq': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'cq': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'mixed': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              প্রশ্ন ব্যাংক
            </h1>
            <p className="text-gray-300">বিভিন্ন বোর্ড ও পরীক্ষার প্রশ্নপত্র</p>
          </div>
          
          {currentUser && (
            <Button 
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <FileText className="mr-2 h-4 w-4" />
              প্রশ্ন আপলোড করুন
            </Button>
          )}
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="browse" className="text-white data-[state=active]:bg-white/20">
              <Search className="mr-2 h-4 w-4" />
              খুঁজে দেখুন
            </TabsTrigger>
            <TabsTrigger value="popular" className="text-white data-[state=active]:bg-white/20">
              <TrendingUp className="mr-2 h-4 w-4" />
              জনপ্রিয়
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-white data-[state=active]:bg-white/20">
              <Calendar className="mr-2 h-4 w-4" />
              সাম্প্রতিক
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="প্রশ্নপত্র খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md px-3 py-2"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls === 'All' ? '' : cls} className="bg-slate-800">
                    {cls === 'All' ? 'সব ক্লাস' : cls}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md px-3 py-2"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject === 'All' ? '' : subject} className="bg-slate-800">
                    {subject === 'All' ? 'সব বিষয়' : subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Papers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <Card key={paper.id} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all group">
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                          {paper.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className={getTypeColor(paper.examType)}>
                            {paper.examType}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(paper.difficulty)}>
                            {paper.difficulty}
                          </Badge>
                          {paper.likes > 50 && (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              <Star className="mr-1 h-3 w-3" />
                              জনপ্রিয়
                            </Badge>
                          )}
                          {paper.views > 1000 && (
                            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              ট্রেন্ডিং
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {paper.class}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {paper.subject}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {paper.year}
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {paper.marks} নম্বর
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {paper.uploader}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Download className="mr-1 h-3 w-3" />
                          {paper.views}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {paper.likes}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleView(paper)}
                        className="flex-1 bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        দেখুন
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(paper)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        ডাউনলোড
                      </Button>
                      <ExamSystem questionPaper={paper} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            {/* Popular questions with likes > 50 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionPapers.filter(paper => paper.likes > 50).map((paper) => (
                
                <Card key={paper.id} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                          {paper.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className={getTypeColor(paper.examType)}>
                            {paper.examType}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(paper.difficulty)}>
                            {paper.difficulty}
                          </Badge>
                          {paper.likes > 50 && (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              <Star className="mr-1 h-3 w-3" />
                              জনপ্রিয়
                            </Badge>
                          )}
                          {paper.views > 1000 && (
                            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              ট্রেন্ডিং
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {paper.class}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {paper.subject}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {paper.year}
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {paper.marks} নম্বর
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {paper.uploader}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Download className="mr-1 h-3 w-3" />
                          {paper.views}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {paper.likes}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleView(paper)}
                        className="flex-1 bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        দেখুন
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(paper)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        ডাউনলোড
                      </Button>
                      <ExamSystem questionPaper={paper} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            {/* Recent questions sorted by upload date */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionPapers.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).map((paper) => (
                
                <Card key={paper.id} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                          {paper.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className={getTypeColor(paper.examType)}>
                            {paper.examType}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(paper.difficulty)}>
                            {paper.difficulty}
                          </Badge>
                          {paper.likes > 50 && (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              <Star className="mr-1 h-3 w-3" />
                              জনপ্রিয়
                            </Badge>
                          )}
                          {paper.views > 1000 && (
                            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              ট্রেন্ডিং
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {paper.class}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {paper.subject}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {paper.year}
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {paper.marks} নম্বর
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {paper.uploader}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Download className="mr-1 h-3 w-3" />
                          {paper.views}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {paper.likes}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleView(paper)}
                        className="flex-1 bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        দেখুন
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(paper)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        ডাউনলোড
                      </Button>
                      <ExamSystem questionPaper={paper} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPaper && (
        <PDFViewer
          item={selectedPaper}
          type="question"
          onClose={() => setSelectedPaper(null)}
          onLike={() => handleLike(selectedPaper.id)}
          onDownload={() => handleDownload(selectedPaper)}
          isLiked={likedQuestions.includes(selectedPaper.id)}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-4">প্রশ্ন আপলোড করুন</h3>
            <PDFUpload 
              type="question"
              onUploadSuccess={() => {
                setShowUpload(false);
                toast({
                  title: "আপলোড সফল!",
                  description: "আপনার প্রশ্নপত্র সফলভাবে আপলোড হয়েছে",
                });
              }}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
