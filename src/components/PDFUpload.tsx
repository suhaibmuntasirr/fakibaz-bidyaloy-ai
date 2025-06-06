
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Star,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseService } from '@/services/firebaseService';
import { analyticsService } from '@/services/analyticsService';
import PointsSystem from '@/components/PointsSystem';

interface PDFUploadProps {
  type: 'note' | 'question';
  onUploadSuccess: () => void;
  onCancel: () => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ type, onUploadSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    chapter: '',
    school: '',
    year: '',
    examType: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    marks: '',
    description: '',
    tags: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { currentUser, userProfile } = useAuth();

  // Sample data for points preview
  const samplePoints = {
    rating: 4.6,
    downloads: 45,
    likes: 28
  };

  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'ইংরেজি', 'বাংলা', 'ইতিহাস', 'ভূগোল'];
  const examTypes = [
    { value: 'test', label: 'টেস্ট' },
    { value: 'annual', label: 'বার্ষিক' },
    { value: 'half-yearly', label: 'অর্ধবার্ষিক' },
    { value: 'model', label: 'মডেল টেস্ট' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'main' | 'answer') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "ভুল ফাইল টাইপ",
        description: "শুধুমাত্র PDF ফাইল আপলোড করুন",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!currentUser || !userProfile) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "আপলোড করতে প্রথমে লগইন করুন",
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
        title: "তথ্য অসম্পূর্ণ",
        description: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      let uploadId: string;
      
      if (type === 'note') {
        // Upload Note
        const noteData = {
          title: formData.title,
          class: formData.class,
          subject: formData.subject,
          chapter: formData.chapter || 'অধ্যায় নির্দিষ্ট করা হয়নি',
          description: formData.description || '',
          authorId: currentUser.uid,
          authorName: userProfile.fullName || currentUser.email || 'Unknown User',
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        };

        uploadId = await firebaseService.uploadNote(noteData, selectedFile);

        // Track analytics
        await analyticsService.trackUpload('note', formData.subject, formData.class, currentUser.uid);
        
        toast({
          title: "নোট আপলোড সফল!",
          description: "আপনার নোট সফলভাবে আপলোড হয়েছে এবং আপনি পয়েন্ট পেয়েছেন",
        });
      } else {
        // Upload Question
        if (!formData.marks) {
          toast({
            title: "নম্বর প্রয়োজন",
            description: "প্রশ্নপত্রের জন্য নম্বর উল্লেখ করুন",
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }

        const questionData = {
          title: formData.title,
          class: formData.class,
          subject: formData.subject,
          school: formData.school || 'স্কুল নির্দিষ্ট করা হয়নি',
          year: formData.year || new Date().getFullYear().toString(),
          examType: formData.examType || 'test',
          difficulty: formData.difficulty,
          marks: formData.marks,
          description: formData.description || '',
          authorId: currentUser.uid,
          authorName: userProfile.fullName || currentUser.email || 'Unknown User',
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        };

        uploadId = await firebaseService.uploadQuestion(questionData, selectedFile, answerFile || undefined);

        // Track analytics
        await analyticsService.trackUpload('question', formData.subject, formData.class, currentUser.uid);
        
        toast({
          title: "প্রশ্নপত্র আপলোড সফল!",
          description: "আপনার প্রশ্নপত্র সফলভাবে আপলোড হয়েছে এবং আপনি পয়েন্ট পেয়েছেন",
        });
      }

      // Track page view for uploaded content
      await analyticsService.trackPageView(`upload_${type}_success`, currentUser.uid);
      
      // Reset form
      setSelectedFile(null);
      setAnswerFile(null);
      setFormData({
        title: '',
        class: '',
        subject: '',
        chapter: '',
        school: '',
        year: '',
        examType: '',
        difficulty: 'Medium',
        marks: '',
        description: '',
        tags: ''
      });
      
      // Clear file inputs
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (answerInputRef.current) answerInputRef.current.value = '';

      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "আপলোড ব্যর্থ",
        description: "আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileType: 'main' | 'answer') => {
    if (fileType === 'main') {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setAnswerFile(null);
      if (answerInputRef.current) answerInputRef.current.value = '';
    }
  };

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">লগইন প্রয়োজন</h3>
        <p className="text-gray-400 mb-4">
          {type === 'note' ? 'নোট' : 'প্রশ্নপত্র'} আপলোড করতে প্রথমে লগইন করুন
        </p>
        <Button onClick={onCancel} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
          ফিরে যান
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                {type === 'note' ? 'নোট আপলোড' : 'প্রশ্নপত্র আপলোড'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-white">
                  {type === 'note' ? 'নোট ফাইল' : 'প্রশ্নপত্র ফাইল'} *
                </Label>
                <div 
                  className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        <span className="text-white">{selectedFile.name}</span>
                        <Badge className="bg-green-600/20 text-green-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile('main');
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">PDF ফাইল নির্বাচন করুন</p>
                      <p className="text-xs text-gray-500 mt-1">সর্বোচ্চ ১০ MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e, 'main')}
                  className="hidden"
                />
              </div>

              {/* Answer File (for questions only) */}
              {type === 'question' && (
                <div className="space-y-2">
                  <Label className="text-white">উত্তরপত্র ফাইল (ঐচ্ছিক)</Label>
                  <div 
                    className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-white/40 transition-colors"
                    onClick={() => answerInputRef.current?.click()}
                  >
                    {answerFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-green-400" />
                          <span className="text-white text-sm">{answerFile.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile('answer');
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-400 text-sm">উত্তরপত্র আপলোড করুন</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={answerInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileSelect(e, 'answer')}
                    className="hidden"
                  />
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">শিরোনাম *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="নোট/প্রশ্নের শিরোনাম"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label className="text-white">ক্লাস *</Label>
                  <select
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="">ক্লাস নির্বাচন করুন</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls} className="bg-gray-800">{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-white">বিষয় *</Label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="">বিষয় নির্বাচন করুন</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject} className="bg-gray-800">{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-white">
                    {type === 'note' ? 'অধ্যায়' : 'স্কুল/কলেজ'}
                  </Label>
                  <Input
                    value={type === 'note' ? formData.chapter : formData.school}
                    onChange={(e) => handleInputChange(type === 'note' ? 'chapter' : 'school', e.target.value)}
                    placeholder={type === 'note' ? 'অধ্যায়ের নাম' : 'প্রতিষ্ঠানের নাম'}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                {type === 'question' && (
                  <>
                    <div>
                      <Label className="text-white">সাল</Label>
                      <Input
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        placeholder="২০২৩"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label className="text-white">পরীক্ষার ধরণ</Label>
                      <select
                        value={formData.examType}
                        onChange={(e) => handleInputChange('examType', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                      >
                        <option value="">পরীক্ষার ধরণ নির্বাচন করুন</option>
                        {examTypes.map(type => (
                          <option key={type.value} value={type.value} className="bg-gray-800">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-white">কঠিনতা</Label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                      >
                        <option value="Easy" className="bg-gray-800">সহজ</option>
                        <option value="Medium" className="bg-gray-800">মাঝারি</option>
                        <option value="Hard" className="bg-gray-800">কঠিন</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-white">নম্বর *</Label>
                      <Input
                        value={formData.marks}
                        onChange={(e) => handleInputChange('marks', e.target.value)}
                        placeholder="১০০"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label className="text-white">বিবরণ</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="সংক্ষিপ্ত বিবরণ লিখুন..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-white">ট্যাগ</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="ট্যাগ গুলো কমা দিয়ে আলাদা করুন"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || !selectedFile}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      আপলোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      আপলোড করুন
                    </>
                  )}
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  disabled={isUploading}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  বাতিল
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points System Preview */}
        <div className="lg:col-span-1">
          <PointsSystem 
            rating={samplePoints.rating}
            downloads={samplePoints.downloads}
            likes={samplePoints.likes}
            uploadType={type}
          />
          
          {/* Upload Guidelines */}
          <Card className="mt-4 bg-blue-900/20 border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 flex items-center text-sm">
                <AlertCircle className="mr-2 h-4 w-4" />
                আপলোড গাইডলাইন
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-gray-300 space-y-1">
                <p>• স্পষ্ট এবং পড়ার যোগ্য হ্যান্ডরাইটিং</p>
                <p>• সম্পূর্ণ এবং সঠিক তথ্য</p>
                <p>• উচ্চ মানের স্ক্যান/ছবি</p>
                <p>• কপিরাইট মুক্ত কন্টেন্ট</p>
                <p>• প্রাসঙ্গিক ট্যাগ ব্যবহার</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
