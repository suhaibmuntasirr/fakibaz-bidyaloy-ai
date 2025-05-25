
import React, { useState } from 'react';
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

interface Question {
  id: string;
  title: string;
  subject: string;
  class: string;
  school: string;
  year: number;
  examType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  uploader: string;
  views: number;
  likes: number;
  answers: number;
  hasAnswerKey: boolean;
  uploadDate: Date;
  verified: boolean;
}

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

  // Mock data
  const mockQuestions: Question[] = [
    {
      id: '1',
      title: 'গণিত প্রি-টেস্ট পরীক্ষা - দ্বিঘাত সমীকরণ',
      subject: 'গণিত',
      class: 'Class 9',
      school: 'ঢাকা কলেজিয়েট স্কুল',
      year: 2024,
      examType: 'Pre-test',
      difficulty: 'Medium',
      marks: 50,
      uploader: 'রাহুল আহমেদ',
      views: 245,
      likes: 34,
      answers: 12,
      hasAnswerKey: true,
      uploadDate: new Date('2024-01-15'),
      verified: true
    },
    {
      id: '2',
      title: 'Physics Final Examination - Mechanics',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      school: 'Notre Dame College',
      year: 2023,
      examType: 'Final',
      difficulty: 'Hard',
      marks: 100,
      uploader: 'সারা খান',
      views: 189,
      likes: 28,
      answers: 8,
      hasAnswerKey: false,
      uploadDate: new Date('2024-01-10'),
      verified: true
    },
    {
      id: '3',
      title: 'বাংলা সাহিত্য অর্ধবার্ষিক পরীক্ষা',
      subject: 'বাংলা',
      class: 'Class 10',
      school: 'ভিকারুননিসা নূন স্কুল',
      year: 2024,
      examType: 'Half-yearly',
      difficulty: 'Easy',
      marks: 75,
      uploader: 'তানিয়া রহমান',
      views: 312,
      likes: 45,
      answers: 18,
      hasAnswerKey: true,
      uploadDate: new Date('2024-01-20'),
      verified: true
    }
  ];

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
  const examTypes = ['Pre-test', 'Half-yearly', 'Final', 'Model Test', 'Weekly Test'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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

        <Tabs defaultValue="questions" className="space-y-8">
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
                  
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="বছর" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
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
              {mockQuestions.map((question) => (
                <Card key={question.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-white text-lg leading-tight">
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
                        >
                          <Download className="h-4 w-4 mr-1" />
                          ডাউনলোড
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          দেখুন
                        </Button>
                        {question.hasAnswerKey && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-green-600/20 border-green-500/20 text-green-300 hover:bg-green-600/30"
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
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  প্রশ্ন ও উত্তর আপলোড করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    placeholder="স্কুলের নাম"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="পরীক্ষার বছর" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="text-white hover:bg-white/10">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="পরীক্ষার ধরন" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#28282B] border-white/20">
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input 
                  placeholder="প্রশ্নের শিরোনাম"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">প্রশ্নপত্র আপলোড</h3>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">প্রশ্নপত্র ড্র্যাগ করুন বা ক্লিক করে আপলোড করুন</p>
                      <p className="text-sm text-gray-400 mt-2">PDF, JPG, PNG সাপোর্টেড</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">উত্তরপত্র আপলোড (ঐচ্ছিক)</h3>
                    <div className="border-2 border-dashed border-green-500/20 rounded-lg p-8 text-center">
                      <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-300">উত্তরপত্র আপলোড করুন</p>
                      <p className="text-sm text-gray-400 mt-2">এটি অন্যদের আরো সাহায্য করবে</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                  <Upload className="mr-2 h-5 w-5" />
                  আপলোড করুন
                </Button>
              </CardContent>
            </Card>
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
      </div>
    </div>
  );
};

export default QuestionBank;
