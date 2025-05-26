import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, Search, Trophy, School, Calendar, FileText, 
  Eye, Download, ThumbsUp, MessageCircle, Star, Award,
  Clock, BookOpen, Users, Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import PDFUpload from '@/components/PDFUpload';
import PDFViewer from '@/components/PDFViewer';
import { notesService, Question } from '@/services/notesService';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useToast } from '@/hooks/use-toast';

interface School {
  name: string;
  location: string;
  questionCount: number;
  rank: number;
}

const QuestionBank = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [activeTab, setActiveTab] = useState('questions');

  const { currentUser } = useAuth();
  const { requireAuth } = useAuthAction();
  const { toast } = useToast();

  const topSchools: School[] = [
    { name: 'ঢাকা কলেজিয়েট স্কুল', location: 'ঢাকা', questionCount: 89, rank: 1 },
    { name: 'Notre Dame College', location: 'ঢাকা', questionCount: 76, rank: 2 },
    { name: 'ভিকারুননিসা নূন স্কুল', location: 'ঢাকা', questionCount: 65, rank: 3 },
    { name: 'সেন্ট জোসেফ স্কুল', location: 'ঢাকা', questionCount: 54, rank: 4 },
    { name: 'হলি ক্রস কলেজ', location: 'ঢাকা', questionCount: 43, rank: 5 }
  ];

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'বাংলা', 'English', 'গণিত', 'বিজ্ঞান', 'সামাজিক বিজ্ঞান', 
    'ICT', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত'
  ];

  const years = ['2024', '2023', '2022', '2021', '2020'];

  // Load questions on component mount
  useEffect(() => {
    const loadedQuestions = notesService.getAllQuestions();
    setQuestions(loadedQuestions);
    setFilteredQuestions(loadedQuestions);
  }, []);

  // Filter questions when search parameters change
  useEffect(() => {
    const filtered = notesService.searchQuestions(searchQuery, {
      class: selectedClass,
      subject: selectedSubject,
      year: selectedYear,
      school: selectedSchool
    });
    setFilteredQuestions(filtered);
  }, [searchQuery, selectedClass, selectedSubject, selectedYear, selectedSchool]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleQuestionClick = (question: Question) => {
    requireAuth(() => {
      notesService.viewQuestion(question.id);
      setSelectedQuestion(question);
      
      // Update local state
      const updatedQuestions = questions.map(q => 
        q.id === question.id ? notesService.getQuestionById(question.id)! : q
      );
      setQuestions(updatedQuestions);
      setFilteredQuestions(notesService.searchQuestions(searchQuery, {
        class: selectedClass,
        subject: selectedSubject,
        year: selectedYear,
        school: selectedSchool
      }));
    });
  };

  const handleLike = (questionId: string) => {
    requireAuth(() => {
      if (!currentUser) return;
      
      const liked = notesService.likeQuestion(questionId, currentUser.uid);
      
      // Update local state
      const updatedQuestions = questions.map(question => 
        question.id === questionId ? notesService.getQuestionById(questionId)! : question
      );
      setQuestions(updatedQuestions);
      setFilteredQuestions(notesService.searchQuestions(searchQuery, {
        class: selectedClass,
        subject: selectedSubject,
        year: selectedYear,
        school: selectedSchool
      }));

      if (selectedQuestion && selectedQuestion.id === questionId) {
        setSelectedQuestion(notesService.getQuestionById(questionId)!);
      }

      toast({
        title: liked ? "লাইক দেওয়া হয়েছে!" : "লাইক সরানো হয়েছে",
        description: liked ? "প্রশ্নটি আপনার পছন্দের তালিকায় যোগ হয়েছে" : "প্রশ্নটি পছন্দের তালিকা থেকে সরানো হয়েছে"
      });
    });
  };

  const handleDownload = (questionId: string) => {
    requireAuth(() => {
      toast({
        title: "ডাউনলোড শুরু হয়েছে!",
        description: "প্রশ্নপত্রটি ডাউনলোড হচ্ছে..."
      });
    });
  };

  const handleUploadSuccess = () => {
    const loadedQuestions = notesService.getAllQuestions();
    setQuestions(loadedQuestions);
    setFilteredQuestions(loadedQuestions);
    setActiveTab('questions');
  };

  const isQuestionLiked = (question: Question): boolean => {
    return currentUser ? question.likedBy.includes(currentUser.uid) : false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">প্রশ্ন ব্যাংক</h1>
          <p className="text-gray-300 text-lg">সব স্কুলের প্রশ্ন ও উত্তর একসাথে - পরীক্ষার শেষ মুহূর্তের প্রস্তুতি</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="questions" className="text-white data-[state=active]:bg-white/20">
              <FileText className="mr-2 h-4 w-4" />
              প্রশ্ন ব্যাংক
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-white data-[state=active]:bg-white/20">
              <Upload className="mr-2 h-4 w-4" />
              আপলোড করুন
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-white/20">
              <Trophy className="mr-2 h-4 w-4" />
              লিডারবোর্ড
            </TabsTrigger>
            <TabsTrigger value="schools" className="text-white data-[state=active]:bg-white/20">
              <School className="mr-2 h-4 w-4" />
              স্কুল র‍্যাংকিং
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="relative md:col-span-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="প্রশ্ন খুঁজুন..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="ক্লাস" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="" className="text-white hover:bg-white/10">সব ক্লাস</SelectItem>
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
                      <SelectItem value="" className="text-white hover:bg-white/10">সব বিষয়</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="বছর" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="" className="text-white hover:bg-white/10">সব বছর</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="text-white hover:bg-white/10">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="স্কুল" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      <SelectItem value="" className="text-white hover:bg-white/10">সব স্কুল</SelectItem>
                      {topSchools.map((school) => (
                        <SelectItem key={school.name} value={school.name} className="text-white hover:bg-white/10">
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-white text-lg leading-tight" onClick={() => handleQuestionClick(question)}>
                        {question.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {question.verified && (
                          <Badge className="bg-green-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            যাচাইকৃত
                          </Badge>
                        )}
                        <Badge className={`${getDifficultyColor(question.difficulty)} text-white`}>
                          {question.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span>{question.class}</span>
                      <span>•</span>
                      <span>{question.subject}</span>
                      <span>•</span>
                      <span>{question.marks} marks</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <School className="h-4 w-4 mr-2" />
                          {question.school}
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          {question.year} • {question.examType}
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Users className="h-4 w-4 mr-2" />
                          আপলোডার: {question.uploader}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {question.views}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {question.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {question.answers}
                          </div>
                        </div>
                        {question.hasAnswerKey && (
                          <Badge className="bg-blue-600 text-white">
                            <Target className="h-3 w-3 mr-1" />
                            উত্তর আছে
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(question.id);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          ডাউনলোড
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuestionClick(question);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          দেখুন
                        </Button>
                        {question.hasAnswerKey && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-green-600/20 border-green-500/20 text-green-300 hover:bg-green-600/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(question.id);
                            }}
                          >
                            <Target className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">কোন প্রশ্ন পাওয়া যায়নি</div>
                <p className="text-gray-500">অন্য কিছু খুঁজে দেখুন বা নতুন প্রশ্ন আপলোড করুন</p>
              </div>
            )}
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <PDFUpload type="question" onUploadSuccess={handleUploadSuccess} />
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                    শীর্ষ আপলোডার
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['রাহুল আহমেদ', 'সারা খান', 'তানিয়া রহমান'].map((name, index) => (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}>
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <span className="text-white">{name}</span>
                        </div>
                        <span className="text-gray-300">{[45, 32, 28][index]} প্রশ্ন</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="mr-2 h-5 w-5 text-blue-400" />
                    সর্বোচ্চ লাইক
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['তানিয়া রহমান', 'রাহুল আহমেদ', 'সারা খান'].map((name, index) => (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}>
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <span className="text-white">{name}</span>
                        </div>
                        <span className="text-gray-300">{[145, 89, 67][index]} লাইক</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-green-400" />
                    এই মাসের স্টার
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['সারা খান', 'তানিয়া রহমান', 'রাহুল আহমেদ'].map((name, index) => (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}>
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <span className="text-white">{name}</span>
                        </div>
                        <span className="text-gray-300">{[15, 12, 8][index]} প্রশ্ন</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <School className="mr-2 h-5 w-5" />
                  স্কুল র‍্যাংকিং - প্রশ্ন অবদানের ভিত্তিতে
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSchools.map((school, index) => (
                    <Card key={school.name} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-600'
                            }`}>
                              <span className="text-white font-bold">{school.rank}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{school.name}</h3>
                              <p className="text-gray-400 text-sm">{school.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{school.questionCount}</p>
                            <p className="text-gray-400 text-sm">প্রশ্ন</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* PDF Viewer Modal */}
        {selectedQuestion && (
          <PDFViewer
            item={selectedQuestion}
            type="question"
            onClose={() => setSelectedQuestion(null)}
            onLike={() => handleLike(selectedQuestion.id)}
            onDownload={() => handleDownload(selectedQuestion.id)}
            isLiked={isQuestionLiked(selectedQuestion)}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
