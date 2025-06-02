
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Upload, FileText, Timer, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { chatGPTService } from '@/services/chatgptService';

const ExamSystem = ({ questionPaper }: { questionPaper: any }) => {
  const [showExamModal, setShowExamModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Set timer based on question type (MCQ: 30 min, CQ: 3 hours)
  const examDuration = questionPaper.title.toLowerCase().includes('mcq') ? 30 : 180;

  const startExam = () => {
    setTimeLeft(examDuration * 60); // Convert to seconds
    setExamStarted(true);
    setExamCompleted(false);
    setUserAnswer('');
    setEvaluation(null);
    setShowExamModal(true);
    
    toast({
      title: "পরীক্ষা শুরু হয়েছে",
      description: `${examDuration} মিনিটের পরীক্ষা শুরু হয়েছে`,
    });
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "ত্রুটি",
        description: "দয়া করে আপনার উত্তর লিখুন",
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
        const evaluationPrompt = `
          প্রশ্নপত্র: ${questionPaper.title}
          বিষয়: ${questionPaper.subject}
          ক্লাস: ${questionPaper.class}
          
          শিক্ষার্থীর উত্তর: ${userAnswer}
          
          দয়া করে এই উত্তরটি মূল্যায়ন করুন এবং:
          1. নম্বর প্রদান করুন (${questionPaper.marks} এর মধ্যে)
          2. ভালো দিকগুলো উল্লেখ করুন
          3. উন্নতির জন্য পরামর্শ দিন
          4. সঠিক উত্তরের দিকনির্দেশনা দিন
          
          বাংলায় বিস্তারিত ফিডব্যাক দিন।
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
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && timeLeft === 0) {
      submitAnswer();
    }
  }, [examStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentUser) {
    return (
      <Button disabled className="bg-gray-600">
        <FileText className="mr-2 h-4 w-4" />
        পরীক্ষা দিতে লগইন করুন
      </Button>
    );
  }

  return (
    <>
      <Button 
        onClick={startExam}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <FileText className="mr-2 h-4 w-4" />
        পরীক্ষা দিন
      </Button>

      <Dialog open={showExamModal} onOpenChange={setShowExamModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{questionPaper.title}</span>
              {examStarted && !examCompleted && (
                <Badge className="bg-red-600/20 text-red-300 border-red-600/30 flex items-center">
                  <Timer className="mr-1 h-3 w-3" />
                  {formatTime(timeLeft)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Viewer Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">প্রশ্নপত্র</h3>
              <div className="bg-white rounded-lg p-4 h-96 flex items-center justify-center">
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
              
              <div className="text-sm text-gray-400">
                <p>সময়: {examDuration} মিনিট</p>
                <p>পূর্ণমান: {questionPaper.marks} নম্বর</p>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">আপনার উত্তর</h3>
              
              {!examCompleted ? (
                <div className="space-y-4">
                  {!examStarted ? (
                    <div className="text-center">
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
                      <Textarea
                        placeholder="এখানে আপনার উত্তর লিখুন..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
                      />
                      
                      <Button 
                        onClick={submitAnswer}
                        className="w-full bg-blue-600 hover:bg-blue-700"
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
                  </div>
                  
                  {!apiKey && (
                    <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">AI মূল্যায়নের জন্য OpenAI API Key দিন:</h4>
                      <input
                        type="password"
                        placeholder="আপনার OpenAI API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-2 bg-black/30 border border-white/20 rounded text-white"
                      />
                      <Button 
                        onClick={submitAnswer}
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
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
                    <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">AI মূল্যায়ন:</h4>
                      <div className="whitespace-pre-wrap text-sm">{evaluation}</div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => {
                      setShowExamModal(false);
                      setExamCompleted(false);
                    }}
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
