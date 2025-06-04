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

interface ExamSystemProps {
  questionPaper: any;
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

  // Set timer based on question type (MCQ: 30 min, CQ: 3 hours)
  const examDuration = questionPaper.title.toLowerCase().includes('mcq') ? 30 : 180;
  const totalTime = examDuration * 60;

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
      description: `${examDuration} মিনিটের পরীক্ষা শুরু হয়েছে`,
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

    if (apiKey) {
      setIsEvaluating(true);
      try {
        chatGPTService.setApiKey(apiKey);
        
        let answerContent = userAnswer;
        if (answerFile) {
          answerContent += `\n\n[PDF ফাইল আপলোড করা হয়েছে: ${answerFile.name}]`;
        }

        const evaluationPrompt = `
          প্রশ্নপত্র: ${questionPaper.title}
          বিষয়: ${questionPaper.subject}
          ক্লাস: ${questionPaper.class}
          পূর্ণমান: ${questionPaper.marks}
          সময়কাল: ${examDuration} মিনিট
          
          শিক্ষার্থীর উত্তর: ${answerContent}
          
          দয়া করে এই উত্তরটি মূল্যায়ন করুন এবং:
          1. মোট নম্বর প্রদান করুন (${questionPaper.marks} এর মধ্যে)
          2. প্রতিটি প্রশ্নের জন্য আলাদা নম্বর দিন
          3. ভালো দিকগুলো উল্লেখ করুন
          4. ভুল বা অসম্পূর্ণ উত্তরের জন্য সংশোধনী দিন
          5. উন্নতির জন্য পরামর্শ দিন
          6. সঠিক উত্তরের দিকনির্দেশনা দিন
          7. সময় ব্যবস্থাপনার মূল্যায়ন করুন
          8. প্রতিটি সেকশনের জন্য আলাদা ফিডব্যাক দিন
          
          বাংলায় বিস্তারিত ফিডব্যাক দিন এবং একটি পেশাদার মার্কিং স্কিম অনুসরণ করুন।
        `;

        const result = await chatGPTService.sendMessage(evaluationPrompt, {
          class: questionPaper.class,
          subject: questionPaper.subject
        });
        
        setEvaluation(result);
      } catch (error) {
        toast({
          title: "মূল্যায়ন করতে সমস্যা",
          description: "AI মূল্যায়ন সেবা সাময়িক অনুপলব্ধ",
          variant: "destructive"
        });
      } finally {
        setIsEvaluating(false);
      }
    }

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
        <DialogContent className="bg-[#1a1a1a] border-white/20 text-white max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{questionPaper.title}</span>
              <div className="flex items-center space-x-4">
                {examStarted && !examCompleted && (
                  <>
                    <Badge className={`${showWarning ? 'animate-pulse bg-red-600/30 border-red-500' : 'bg-blue-600/20 border-blue-500'} text-white flex items-center`}>
                      <Timer className="mr-1 h-3 w-3" />
                      <span className={getTimeColor()}>{formatTime(timeLeft)}</span>
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {!examPaused ? (
                        <Button size="sm" variant="outline" onClick={pauseExam}>
                          <Pause className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={resumeExam}>
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={resetExam}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={handleExitExam}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </DialogTitle>
            {examStarted && !examCompleted && (
              <div className="mt-2">
                <Progress 
                  value={(timeLeft / totalTime) * 100} 
                  className="h-2"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Viewer Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">প্রশ্নপত্র</h3>
              <div className="bg-white rounded-lg p-4 h-[500px] flex items-center justify-center">
                {questionPaper.questionFileUrl ? (
                  <iframe
                    src={questionPaper.questionFileUrl}
                    className="w-full h-full border-0 rounded"
                    title="Question Paper"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>প্রশ্নপত্র লোড হচ্ছে...</p>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-400 space-y-1">
                <p>সময়: {examDuration} মিনিট</p>
                <p>পূর্ণমান: {questionPaper.marks} নম্বর</p>
                <p>বিষয়: {questionPaper.subject}</p>
                <p>ক্লাস: {questionPaper.class}</p>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">আপনার উত্তর</h3>
              
              {!examCompleted ? (
                <div className="space-y-4">
                  {!examStarted ? (
                    <div className="text-center space-y-4">
                      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">পরীক্ষার নিয়মাবলী:</h4>
                        <ul className="text-sm text-gray-300 space-y-1 text-left">
                          <li>• সময়: {examDuration} মিনিট</li>
                          <li>• পূর্ণমান: {questionPaper.marks} নম্বর</li>
                          <li>• উত্তর লিখুন অথবা PDF আপলোড করুন</li>
                          <li>• সময় শেষ হলে স্বয়ংক্রিয়ভাবে জমা হবে</li>
                          <li>• পরীক্ষা বিরতি দিতে পারবেন</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={() => setExamStarted(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        পরীক্ষা শুরু করুন
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">লিখিত উত্তর:</label>
                          <Textarea
                            placeholder="এখানে আপনার উত্তর লিখুন..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
                            disabled={examPaused}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">অথবা PDF আপলোড করুন:</label>
                          <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="answer-upload"
                              disabled={examPaused}
                            />
                            <label htmlFor="answer-upload" className={`cursor-pointer ${examPaused ? 'opacity-50' : ''}`}>
                              <File className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-400">
                                {answerFile ? answerFile.name : 'PDF ফাইল আপলোড করতে ক্লিক করুন'}
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={submitAnswer}
                        className="w-full bg-blue-600 hover:bg-blue-700"
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
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="text-center text-green-400 font-semibold">উত্তর জমা হয়েছে!</h4>
                    <p className="text-center text-sm text-gray-300 mt-2">
                      সময়: {formatTime(totalTime - timeLeft)} ব্যয়িত
                    </p>
                    {answerFile && (
                      <p className="text-center text-sm text-gray-300 mt-1">
                        আপলোড করা ফাইল: {answerFile.name}
                      </p>
                    )}
                  </div>
                  
                  {!apiKey && (
                    <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">AI মূল্যায়নের জন্য OpenAI API Key দিন:</h4>
                      <input
                        type="password"
                        placeholder="আপনার OpenAI API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-2 bg-black/30 border border-white/20 rounded text-white mb-2"
                      />
                      <Button 
                        onClick={submitAnswer}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={!apiKey}
                      >
                        AI মূল্যায়ন করুন
                      </Button>
                    </div>
                  )}
                  
                  {isEvaluating && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                      <p className="mt-2">AI আপনার উত্তর মূল্যায়ন করছে...</p>
                    </div>
                  )}
                  
                  {evaluation && (
                    <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                      <h4 className="font-semibold mb-2">AI মূল্যায়ন:</h4>
                      <div className="whitespace-pre-wrap text-sm">{evaluation}</div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleExitExam}
                    className="w-full bg-gray-600 hover:bg-gray-700"
                  >
                    বন্ধ করুন
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
