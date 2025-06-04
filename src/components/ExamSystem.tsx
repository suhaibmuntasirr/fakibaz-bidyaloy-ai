import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Clock, Upload, FileText, Timer, CheckCircle, File, AlertCircle, Play, Pause, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { chatGPTService } from '@/services/chatgptService';
import { Question } from '@/types/common';

interface ExamSystemProps {
  questionPaper: Question;
  onExit?: () => void;
}

const ExamSystem = ({ questionPaper, onExit }: ExamSystemProps) => {
  const [showExamModal, setShowExamModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examPaused, setExamPaused] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Set timer based on question duration
  const examDuration = parseInt(questionPaper.duration.replace(/[^\d]/g, '')) * 60 || 180 * 60;
  const totalTime = examDuration;

  const startExam = () => {
    setTimeLeft(totalTime);
    setExamStarted(true);
    setExamPaused(false);
    setExamCompleted(false);
    setUserAnswer('');
    setAnswerFile(null);
    setEvaluation(null);
    setShowExamModal(true);
    setShowWarning(false);
    
    toast({
      title: "পরীক্ষা শুরু হয়েছে",
      description: `${questionPaper.duration} পরীক্ষা শুরু হয়েছে`,
    });
  };

  const handleExitExam = () => {
    setShowExamModal(false);
    if (onExit) {
      onExit();
    }
  };

  const pauseExam = () => {
    setExamPaused(true);
    toast({
      title: "পরীক্ষা বিরতি",
      description: "পরীক্ষা সাময়িক বন্ধ করা হয়েছে",
    });
  };

  const resumeExam = () => {
    setExamPaused(false);
    toast({
      title: "পরীক্ষা পুনরায় শুরু",
      description: "পরীক্ষা আবার চালু করা হয়েছে",
    });
  };

  const resetExam = () => {
    setExamStarted(false);
    setExamPaused(false);
    setExamCompleted(false);
    setTimeLeft(totalTime);
    setUserAnswer('');
    setAnswerFile(null);
    setEvaluation(null);
    toast({
      title: "পরীক্ষা রিসেট",
      description: "পরীক্ষা নতুন করে শুরু করুন",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setAnswerFile(file);
      toast({
        title: "ফাইল আপলোড হয়েছে",
        description: `${file.name} সফলভাবে আপলোড হয়েছে`,
      });
    } else {
      toast({
        title: "ত্রুটি",
        description: "শুধুমাত্র PDF ফাইল আপলোড করুন",
        variant: "destructive"
      });
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() && !answerFile) {
      toast({
        title: "ত্রুটি",
        description: "দয়া করে আপনার উত্তর লিখুন অথবা PDF ফাইল আপলোড করুন",
        variant: "destructive"
      });
      return;
    }

    setExamStarted(false);
    setExamCompleted(true);

    toast({
      title: "উত্তর জমা দেওয়া হয়েছে",
      description: "আপনার উত্তর সফলভাবে জমা হয়েছে",
    });
  };

  // Timer effect
  useEffect(() => {
    if (examStarted && !examPaused && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Show warning when 5 minutes left
        if (timeLeft === 300) {
          setShowWarning(true);
          toast({
            title: "সময় সতর্কতা",
            description: "মাত্র ৫ মিনিট বাকি!",
            variant: "destructive"
          });
        }
        
        // Show final warning when 1 minute left
        if (timeLeft === 60) {
          toast({
            title: "চূড়ান্ত সতর্কতা",
            description: "মাত্র ১ মিনিট বাকি!",
            variant: "destructive"
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && !examPaused && timeLeft === 0) {
      submitAnswer();
      toast({
        title: "সময় শেষ",
        description: "পরীক্ষার সময় শেষ! আপনার উত্তর স্বয়ংক্রিয়ভাবে জমা হয়েছে",
        variant: "destructive"
      });
    }
  }, [examStarted, examPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = () => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!currentUser) {
    return (
      <Button disabled className="bg-gray-600 text-xs px-2 py-1">
        <FileText className="mr-1 h-3 w-3" />
        পরীক্ষা দিতে লগইন করুন
      </Button>
    );
  }

  return (
    <>
      <Button 
        onClick={startExam}
        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
      >
        <FileText className="mr-1 h-3 w-3" />
        পরীক্ষা দিন
      </Button>

      <Dialog open={showExamModal} onOpenChange={handleExitExam}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-gray-700 text-white max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span className="text-xl font-bold">{questionPaper.title}</span>
              <div className="flex items-center space-x-4">
                {examStarted && !examCompleted && (
                  <>
                    <Badge className={`${showWarning ? 'animate-pulse bg-red-600/30 border-red-500' : 'bg-blue-600/20 border-blue-500'} text-white flex items-center`}>
                      <Timer className="mr-1 h-3 w-3" />
                      <span className={getTimeColor()}>{formatTime(timeLeft)}</span>
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {!examPaused ? (
                        <Button size="sm" variant="outline" onClick={pauseExam} className="border-gray-600 text-white hover:bg-gray-700">
                          <Pause className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={resumeExam} className="border-gray-600 text-white hover:bg-gray-700">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={resetExam} className="border-gray-600 text-white hover:bg-gray-700">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={handleExitExam} className="border-gray-600 text-white hover:bg-gray-700">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </DialogTitle>
            {examStarted && !examCompleted && (
              <div className="mt-4">
                <Progress 
                  value={(timeLeft / totalTime) * 100} 
                  className="h-3 bg-gray-700"
                />
                {examPaused && (
                  <p className="text-yellow-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    পরীক্ষা বিরতিতে রয়েছে
                  </p>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* PDF Viewer Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">প্রশ্নপত্র</h3>
              <div className="bg-white rounded-lg p-6 h-[500px] flex items-center justify-center shadow-lg">
                {questionPaper.questionFileUrl || questionPaper.fileUrl ? (
                  <iframe
                    src={questionPaper.questionFileUrl || questionPaper.fileUrl}
                    className="w-full h-full border-0 rounded"
                    title="Question Paper"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">প্রশ্নপত্র লোড হচ্ছে...</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-green-400">পরীক্ষার তথ্য:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>সময়: {questionPaper.duration}</div>
                  <div>পূর্ণমান: {questionPaper.marks} নম্বর</div>
                  <div>বিষয়: {questionPaper.subject}</div>
                  <div>ক্লাস: {questionPaper.class}</div>
                  <div>প্রতিষ্ঠান: {questionPaper.school}</div>
                  <div>বছর: {questionPaper.year}</div>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">আপনার উত্তর</h3>
              
              {!examCompleted ? (
                <div className="space-y-6">
                  {!examStarted ? (
                    <div className="text-center space-y-6">
                      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg p-6">
                        <h4 className="text-xl font-semibold mb-4 text-blue-400">পরীক্ষার নিয়মাবলী</h4>
                        <ul className="text-sm text-gray-300 space-y-2 text-left">
                          <li className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-yellow-400" />
                            সময়: {questionPaper.duration}
                          </li>
                          <li className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-green-400" />
                            পূর্ণমান: {questionPaper.marks} নম্বর
                          </li>
                          <li className="flex items-center">
                            <Upload className="mr-2 h-4 w-4 text-blue-400" />
                            উত্তর লিখুন অথবা PDF আপলোড করুন
                          </li>
                          <li className="flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4 text-red-400" />
                            সময় শেষ হলে স্বয়ংক্রিয়ভাবে জমা হবে
                          </li>
                        </ul>
                      </div>
                      <Button 
                        onClick={() => setExamStarted(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        পরীক্ষা শুরু করুন
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">লিখিত উত্তর:</label>
                          <Textarea
                            placeholder="এখানে আপনার উত্তর লিখুন..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[250px] focus:border-blue-500"
                            disabled={examPaused}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">অথবা PDF আপলোড করুন:</label>
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="answer-upload"
                              disabled={examPaused}
                            />
                            <label htmlFor="answer-upload" className={`cursor-pointer ${examPaused ? 'opacity-50' : ''}`}>
                              <File className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                              <p className="text-sm text-gray-300">
                                {answerFile ? answerFile.name : 'PDF ফাইল আপলোড করতে ক্লিক করুন'}
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={submitAnswer}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                        disabled={examPaused}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        উত্তর জমা দিন
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-600/30 rounded-lg p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-xl text-green-400 font-semibold mb-2">উত্তর জমা হয়েছে!</h4>
                    <p className="text-gray-300 mb-2">
                      ব্যয়িত সময়: {formatTime(totalTime - timeLeft)}
                    </p>
                    {answerFile && (
                      <p className="text-sm text-gray-400">
                        আপলোড করা ফাইল: {answerFile.name}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleExitExam}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                  >
                    পরীক্ষা শেষ করুন
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExamSystem;
