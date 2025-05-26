import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, AlertCircle, Star, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseService } from '@/services/firebaseService';

interface PDFUploadProps {
  type: 'note' | 'question';
  onUploadSuccess: () => void;
}

const PDFUpload = ({ type, onUploadSuccess }: PDFUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    chapter: '',
    description: '',
    school: '',
    year: '',
    examType: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    marks: ''
  });
  const { toast } = useToast();
  const { currentUser, userProfile } = useAuth();

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'বাংলা', 'English', 'গণিত', 'বিজ্ঞান', 'সামাজিক বিজ্ঞান', 
    'ICT', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত'
  ];

  const examTypes = ['Pre-test', 'Half-yearly', 'Final', 'Model Test', 'Weekly Test'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'main' | 'answer') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "ভুল ফাইল ফরম্যাট",
        description: "শুধুমাত্র PDF ফাইল আপলোড করা যাবে",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "ফাইল খুব বড়",
        description: "ফাইলের সাইজ ১০ MB এর কম হতে হবে",
        variant: "destructive"
      });
      return;
    }

    if (fileType === 'main') {
      setSelectedFile(file);
    } else {
      setAnswerFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !userProfile) {
      toast({
        title: "অনুমতি প্রয়োজন",
        description: "আপলোড করতে লগইন করুন",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "অনুগ্রহ করে একটি PDF ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.class || !formData.subject) {
      toast({
        title: "প্রয়োজনীয় তথ্য দিন",
        description: "শিরোনাম, ক্লাস এবং বিষয় অবশ্যই দিতে হবে",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      if (type === 'note') {
        await firebaseService.uploadNote({
          title: formData.title,
          class: formData.class,
          subject: formData.subject,
          chapter: formData.chapter,
          description: formData.description,
          authorId: currentUser.uid,
          authorName: userProfile.fullName,
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          likes: 0,
          likedBy: [],
          downloads: 0,
          downloadedBy: [],
          comments: 0,
          rating: 0,
          ratingCount: 0,
          verified: false,
          tags: []
        }, selectedFile);
      } else {
        await firebaseService.uploadQuestion({
          title: formData.title,
          class: formData.class,
          subject: formData.subject,
          school: formData.school,
          year: formData.year,
          examType: formData.examType,
          difficulty: formData.difficulty,
          marks: formData.marks,
          description: formData.description,
          authorId: currentUser.uid,
          authorName: userProfile.fullName,
          questionFileUrl: '',
          answerFileUrl: '',
          questionFileName: '',
          answerFileName: '',
          fileSize: 0,
          likes: 0,
          likedBy: [],
          downloads: 0,
          downloadedBy: [],
          comments: 0,
          rating: 0,
          ratingCount: 0,
          verified: false,
          tags: []
        }, selectedFile, answerFile || undefined);
      }
      
      toast({
        title: "সফলভাবে আপলোড হয়েছে!",
        description: `${type === 'note' ? 'নোট' : 'প্রশ্ন'} সফলভাবে আপলোড হয়েছে এবং আপনি পয়েন্ট পেয়েছেন!`,
      });

      // Reset form
      setSelectedFile(null);
      setAnswerFile(null);
      setFormData({
        title: '',
        class: '',
        subject: '',
        chapter: '',
        description: '',
        school: '',
        year: '',
        examType: '',
        difficulty: 'Medium',
        marks: ''
      });

      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "আপলোড ব্যর্থ হয়েছে",
        description: "আবার চেষ্টা করুন",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileType: 'main' | 'answer') => {
    if (fileType === 'main') {
      setSelectedFile(null);
    } else {
      setAnswerFile(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Guidelines */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-[#28282B] flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-yellow-400" />
            আপলোডের নির্দেশনা - শুধুমাত্র PDF ফাইল আপলোড করুন
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="text-[#28282B] font-medium mb-2 flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-400" />
                মানসম্পন্ন নোটের বৈশিষ্ট্য
              </h4>
              <ul className="text-[#28282B] text-sm space-y-1">
                <li>• পরিষ্কার এবং সুন্দর হাতের লেখা</li>
                <li>• সঠিক ক্রমানুসারে সাজানো বিষয়বস্তু</li>
                <li>• প্রয়োজনীয় চিত্র এবং উদাহরণ</li>
                <li>• সম্পূর্ণ অধ্যায়ের আলোচনা</li>
                <li>• গুরুত্বপূর্ণ পয়েন্ট হাইলাইট করা</li>
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="text-[#28282B] font-medium mb-2 flex items-center">
                <Award className="mr-2 h-4 w-4 text-green-400" />
                পয়েন্ট সিস্টেম
              </h4>
              <ul className="text-[#28282B] text-sm space-y-1">
                <li>• নোট আপলোড: ১০ পয়েন্ট</li>
                <li>• প্রশ্ন আপলোড: ১৫ পয়েন্ট</li>
                <li>• প্রতি লাইক: ২ পয়েন্ট</li>
                <li>• প্রতি ডাউনলোড: ৫ পয়েন্ট</li>
                <li className="text-yellow-600">• নোটের মান অনুযায়ী পেমেন্ট!</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg">
            <p className="text-[#28282B] text-sm">
              <strong>গুরুত্বপূর্ণ:</strong> নোট অবশ্যই PDF ফরম্যাটে এবং ১০ MB এর কম হতে হবে। 
              নোটগুলো সিকোয়েন্সিয়াল এবং পড়ার উপযোগী হতে হবে যাতে অন্যরা সহজে বুঝতে পারে।
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            {type === 'note' ? 'নোট আপলোড করুন' : 'প্রশ্ন ও উত্তর আপলোড করুন'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={formData.class || undefined} onValueChange={(value) => setFormData({...formData, class: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="ক্লাস নির্বাচন করুন *" />
                </SelectTrigger>
                <SelectContent className="bg-[#28282B] border-white/20">
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls} className="text-white hover:bg-white/10">
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={formData.subject || undefined} onValueChange={(value) => setFormData({...formData, subject: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="বিষয় নির্বাচন করুন *" />
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

            <Input 
              placeholder={`${type === 'note' ? 'নোটের' : 'প্রশ্নের'} শিরোনাম *`}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />

            {type === 'note' ? (
              <Input 
                placeholder="অধ্যায় নাম"
                value={formData.chapter}
                onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                  placeholder="স্কুলের নাম"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                
                <Select value={formData.year || undefined} onValueChange={(value) => setFormData({...formData, year: value})}>
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

                <Select value={formData.examType || undefined} onValueChange={(value) => setFormData({...formData, examType: value})}>
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
            )}

            <Textarea 
              placeholder="বিবরণ (ঐচ্ছিক)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
            />

            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main File Upload */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">
                  {type === 'note' ? 'নোট ফাইল' : 'প্রশ্নপত্র'} আপলোড *
                </h3>
                
                {selectedFile ? (
                  <div className="border-2 border-green-500/20 rounded-lg p-4 bg-green-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-white font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-gray-300">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('main')}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">PDF ফাইল ড্র্যাগ করুন বা ক্লিক করে আপলোড করুন</p>
                    <p className="text-sm text-gray-400 mb-4">সর্বোচ্চ ১০ MB</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileSelect(e, 'main')}
                      className="hidden"
                      id="main-file-upload"
                    />
                    <label htmlFor="main-file-upload">
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700" asChild>
                        <span>ফাইল নির্বাচন করুন</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Answer File Upload (only for questions) */}
              {type === 'question' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium">উত্তরপত্র আপলোড (ঐচ্ছিক)</h3>
                  
                  {answerFile ? (
                    <div className="border-2 border-green-500/20 rounded-lg p-4 bg-green-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-green-400" />
                          <div>
                            <p className="text-white font-medium">{answerFile.name}</p>
                            <p className="text-sm text-gray-300">
                              {(answerFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('answer')}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-green-500/20 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">উত্তরপত্র আপলোড করুন</p>
                      <p className="text-sm text-gray-400 mb-4">এটি অন্যদের আরো সাহায্য করবে</p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileSelect(e, 'answer')}
                        className="hidden"
                        id="answer-file-upload"
                      />
                      <label htmlFor="answer-file-upload">
                        <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                          <span>উত্তরপত্র নির্বাচন করুন</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-5 w-5 animate-spin" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  আপলোড করুন
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFUpload;
