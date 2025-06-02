import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, FileText, X, CheckCircle, AlertCircle, 
  BookOpen, School, Calendar, User, Tags, Star,
  Image as ImageIcon, Video, FileImage
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PDFUploadProps {
  type: 'note' | 'question';
  onUploadSuccess: () => void;
  onCancel: () => void;
}

const PDFUpload = ({ type, onUploadSuccess, onCancel }: PDFUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [marks, setMarks] = useState('');
  const [hasAnswerKey, setHasAnswerKey] = useState(false);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const answerFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const subjects = [
    'গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'বাংলা', 'ইংরেজি',
    'ইতিহাস', 'ভূগোল', 'অর্থনীতি', 'পৌরনীতি', 'যুক্তিবিদ্যা', 'মনোবিজ্ঞান',
    'সমাজবিজ্ঞান', 'ইসলামের ইতিহাস', 'আরবি', 'সংস্কৃত', 'ICT'
  ];

  const examTypes = ['মাসিক পরীক্ষা', 'ত্রৈমাসিক পরীক্ষা', 'অর্ধবার্ষিক পরীক্ষা', 'বার্ষিক পরীক্ষা', 'টেস্ট পরীক্ষা'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: "ভুল ফাইল টাইপ",
          description: "শুধুমাত্র PDF ফাইল আপলোড করুন",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "ভুল ফাইল টাইপ",
        description: "শুধুমাত্র PDF ফাইল আপলোড করুন",
        variant: "destructive"
      });
    }
  };

  const handleAnswerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setAnswerFile(file);
    } else {
      toast({
        title: "ভুল ফাইল টাইপ",
        description: "শুধুমাত্র PDF ফাইল আপলোড করুন",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    if (!selectedFile) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "আপলোড করার জন্য একটি PDF ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
      return false;
    }

    if (!title.trim()) {
      toast({
        title: "শিরোনাম প্রয়োজন",
        description: "একটি শিরোনাম দিন",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedClass) {
      toast({
        title: "ক্লাস নির্বাচন করুন",
        description: "একটি ক্লাস নির্বাচন করুন",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedSubject) {
      toast({
        title: "বিষয় নির্বাচন করুন",
        description: "একটি বিষয় নির্বাচন করুন",
        variant: "destructive"
      });
      return false;
    }

    if (type === 'note' && !chapter.trim()) {
      toast({
        title: "অধ্যায় প্রয়োজন",
        description: "অধ্যায়ের নাম দিন",
        variant: "destructive"
      });
      return false;
    }

    if (type === 'question') {
      if (!school.trim()) {
        toast({
          title: "স্কুল নাম প্রয়োজন",
          description: "স্কুলের নাম দিন",
          variant: "destructive"
        });
        return false;
      }

      if (!year) {
        toast({
          title: "বছর নির্বাচন করুন",
          description: "পরীক্ষার বছর নির্বাচন করুন",
          variant: "destructive"
        });
        return false;
      }

      if (!examType) {
        toast({
          title: "পরীক্ষার ধরণ নির্বাচন করুন",
          description: "পরীক্ষার ধরণ নির্বাচন করুন",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Here you would typically upload to your backend/storage service
      console.log('Uploading:', {
        file: selectedFile,
        title,
        description,
        class: selectedClass,
        subject: selectedSubject,
        chapter: type === 'note' ? chapter : undefined,
        tags: type === 'note' ? tags : undefined,
        school: type === 'question' ? school : undefined,
        year: type === 'question' ? year : undefined,
        examType: type === 'question' ? examType : undefined,
        difficulty: type === 'question' ? difficulty : undefined,
        marks: type === 'question' ? marks : undefined,
        hasAnswerKey: type === 'question' ? hasAnswerKey : undefined,
        answerFile: type === 'question' ? answerFile : undefined,
        author: currentUser?.displayName || 'Anonymous'
      });

      toast({
        title: "সফলভাবে আপলোড হয়েছে!",
        description: `${type === 'note' ? 'নোট' : 'প্রশ্ন'} সফলভাবে আপলোড হয়েছে`,
      });

      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setSelectedClass('');
      setSelectedSubject('');
      setChapter('');
      setTags([]);
      setCurrentTag('');
      setSchool('');
      setYear('');
      setExamType('');
      setDifficulty('');
      setMarks('');
      setHasAnswerKey(false);
      setAnswerFile(null);
      
      onUploadSuccess();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "আপলোড ব্যর্থ",
        description: "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cancel Button */}
      <div className="mb-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-black/30 border-white/20 text-white hover:bg-white/10"
        >
          <X className="mr-2 h-4 w-4" />
          ফিরে যান
        </Button>
      </div>

      <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white mb-2">
            {type === 'note' ? 'নোট আপলোড করুন' : 'প্রশ্ন আপলোড করুন'}
          </CardTitle>
          <p className="text-gray-300">
            {type === 'note' 
              ? 'আপনার তৈরি নোট সবার সাথে শেয়ার করুন এবং শিক্ষার্থীদের সাহায্য করুন'
              : 'প্রশ্নপত্র আপলোড করে অন্যদের পরীক্ষার প্রস্তুতিতে সাহায্য করুন'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-semibold">
              {type === 'note' ? 'নোট ফাইল' : 'প্রশ্ন ফাইল'}
            </Label>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-300 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <X className="mr-2 h-4 w-4" />
                    ফাইল পরিবর্তন করুন
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">
                      PDF ফাইল এখানে ড্র্যাগ করুন বা ক্লিক করুন
                    </p>
                    <p className="text-gray-400 text-sm">
                      সর্বোচ্চ সাইজ: 25MB | শুধুমাত্র PDF ফাইল
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    ফাইল নির্বাচন করুন
                  </Button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                শিরোনাম *
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'note' ? 'নোটের শিরোনাম' : 'প্রশ্নের শিরোনাম'}
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                বিষয় *
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue placeholder="বিষয় নির্বাচন করুন" />
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

            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                ক্লাস *
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-[#28282B] border-white/20">
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls} className="text-white hover:bg-white/10">
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {type === 'note' && (
              <div className="space-y-2">
                <Label className="text-white flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  অধ্যায় *
                </Label>
                <Input
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="অধ্যায়ের নাম"
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            )}
          </div>

          {/* Question specific fields */}
          {type === 'question' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white flex items-center">
                  <School className="mr-2 h-4 w-4" />
                  স্কুল/কলেজ *
                </Label>
                <Input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="স্কুল/কলেজের নাম"
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  বছর *
                </Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white">
                    <SelectValue placeholder="বছর নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#28282B] border-white/20">
                    {[2024, 2023, 2022, 2021, 2020].map((yr) => (
                      <SelectItem key={yr} value={yr.toString()} className="text-white hover:bg-white/10">
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">পরীক্ষার ধরণ *</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white">
                    <SelectValue placeholder="পরীক্ষার ধরণ নির্বাচন করুন" />
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

              <div className="space-y-2">
                <Label className="text-white">কঠিনতা</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white">
                    <SelectValue placeholder="কঠিনতা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#28282B] border-white/20">
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff} className="text-white hover:bg-white/10">
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">পূর্ণমান</Label>
                <Input
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="পূর্ণমান"
                  type="number"
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasAnswerKey"
                    checked={hasAnswerKey}
                    onChange={(e) => setHasAnswerKey(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="hasAnswerKey" className="text-white">
                    উত্তর সহ
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Answer file upload for questions */}
          {type === 'question' && hasAnswerKey && (
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">উত্তর ফাইল</Label>
              
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center bg-white/5">
                {answerFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{answerFile.name}</p>
                      <p className="text-gray-300 text-sm">
                        {(answerFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setAnswerFile(null)}
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <X className="mr-2 h-4 w-4" />
                      ফাইল পরিবর্তন করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-white">উত্তর PDF ফাইল আপলোড করুন</p>
                    <Button
                      onClick={() => answerFileInputRef.current?.click()}
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      উত্তর ফাইল নির্বাচন করুন
                    </Button>
                  </div>
                )}
              </div>

              <input
                ref={answerFileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleAnswerFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-white">বিবরণ</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'note' ? 'নোট সম্পর্কে কিছু বলুন...' : 'প্রশ্ন সম্পর্কে কিছু বলুন...'}
              className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
            />
          </div>

          {/* Tags for notes */}
          {type === 'note' && (
            <div className="space-y-4">
              <Label className="text-white flex items-center">
                <Tags className="mr-2 h-4 w-4" />
                ট্যাগ (সর্বোচ্চ 5টি)
              </Label>
              
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="ট্যাগ লিখুন"
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  onClick={addTag}
                  disabled={!currentTag.trim() || tags.length >= 5}
                  variant="outline"
                  className="bg-black/30 border-white/20 text-white hover:bg-white/10"
                >
                  যোগ করুন
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white">
                <span>আপলোড হচ্ছে...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={uploading || !selectedFile}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg font-semibold"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  {type === 'note' ? 'নোট আপলোড করুন' : 'প্রশ্ন আপলোড করুন'}
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <Card className="bg-blue-600/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-blue-300 font-medium">টিপস:</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• স্পষ্ট এবং বর্ণনামূলক শিরোনাম ব্যবহার করুন</li>
                    <li>• ফাইলের সাইজ 25MB এর নিচে রাখুন</li>
                    <li>• সঠিক ক্লাস এবং বিষয় নির্বাচন করুন</li>
                    {type === 'note' && <li>• প্রাসঙ্গিক ট্যাগ ব্যবহার করুন যাতে অন্যরা সহজে খুঁজে পায়</li>}
                    {type === 'question' && <li>• উত্তর থাকলে অবশ্যই আপলোড করুন</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFUpload;
