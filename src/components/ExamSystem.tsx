
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, FileText, CheckCircle, Timer, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

interface ExamQuestion {
  id: string;
  type: 'mcq' | 'cq';
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

interface Exam {
  id: string;
  title: string;
  type: 'mcq' | 'cq';
  duration: number; // in minutes
  questions: ExamQuestion[];
  totalMarks: number;
}

const ExamSystem = ({ questionPaper }: { questionPaper: any }) => {
  const [showExamModal, setShowExamModal] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Sample exam data based on question paper type
  const createExamFromQuestionPaper = (paper: any): Exam => {
    const isMCQ = paper.type === 'mcq' || paper.title.toLowerCase().includes('mcq');
    
    if (isMCQ) {
      return {
        id: paper.id,
        title: `${paper.title} - পরীক্ষা`,
        type: 'mcq',
        duration: 30,
        totalMarks: 50,
        questions: [
          {
            id: '1',
            type: 'mcq',
            question: 'বাংলাদেশের রাজধানী কোনটি?',
            options: ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী'],
            correctAnswer: 'ঢাকা',
            marks: 2
          },
          {
            id: '2',
            type: 'mcq',
            question: 'পৃথিবীর সবচেয়ে বড় মহাদেশ কোনটি?',
            options: ['এশিয়া', 'আফ্রিকা', 'ইউরোপ', 'উত্তর আমেরিকা'],
            correctAnswer: 'এশিয়া',
            marks: 2
          }
        ]
      };
    } else {
      return {
        id: paper.id,
        title: `${paper.title} - পরীক্ষা`,
        type: 'cq',
        duration: 180,
        totalMarks: 100,
        questions: [
          {
            id: '1',
            type: 'cq',
            question: 'বাংলাদেশের মুক্তিযুদ্ধের তাৎপর্য বর্ণনা করুন।',
            marks: 20
          },
          {
            id: '2',
            type: 'cq',
            question: 'গণিতে ক্যালকুলাসের গুরুত্ব আলোচনা করুন।',
            marks: 25
          }
        ]
      };
    }
  };

  const startExam = () => {
    const exam = createExamFromQuestionPaper(questionPaper);
    setCurrentExam(exam);
    setTimeLeft(exam.duration * 60); // Convert to seconds
    setExamStarted(true);
    setExamCompleted(false);
    setAnswers({});
    setScore(null);
    setShowExamModal(true);
    
    toast({
      title: "পরীক্ষা শুরু হয়েছে",
      description: `${exam.duration} মিনিটের পরীক্ষা শুরু হয়েছে`,
    });
  };

  const submitExam = async () => {
    if (!currentExam || !currentUser) return;

    setExamStarted(false);
    setExamCompleted(true);

    // Calculate score for MCQ
    let calculatedScore = 0;
    if (currentExam.type === 'mcq') {
      currentExam.questions.forEach(question => {
        if (question.correctAnswer && answers[question.id] === question.correctAnswer) {
          calculatedScore += question.marks;
        }
      });
    } else {
      // For CQ, assign a random score between 60-90% for demo
      calculatedScore = Math.floor(currentExam.totalMarks * (0.6 + Math.random() * 0.3));
    }

    setScore(calculatedScore);

    // Save exam result to Firebase
    try {
      await addDoc(collection(db, 'examResults'), {
        userId: currentUser.uid,
        examId: currentExam.id,
        examTitle: currentExam.title,
        score: calculatedScore,
        totalMarks: currentExam.totalMarks,
        answers: answers,
        completedAt: new Date(),
        type: currentExam.type
      });

      toast({
        title: "পরীক্ষা সম্পন্ন হয়েছে",
        description: `আপনার স্কোর: ${calculatedScore}/${currentExam.totalMarks}`,
      });
    } catch (error) {
      console.error('Error saving exam result:', error);
      toast({
        title: "ত্রুটি",
        description: "পরীক্ষার ফলাফল সেভ করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  };

  // Timer effect
  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && timeLeft === 0) {
      submitExam();
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
        <DialogContent className="bg-[#28282B] border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{currentExam?.title}</span>
              {examStarted && !examCompleted && (
                <Badge className="bg-red-600/20 text-red-300 border-red-600/30 flex items-center">
                  <Timer className="mr-1 h-3 w-3" />
                  {formatTime(timeLeft)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {currentExam && (
            <div className="space-y-6">
              {!examStarted && !examCompleted && (
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-lg">পরীক্ষার তথ্য:</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-black/30 p-3 rounded">
                        <Clock className="h-4 w-4 mb-1" />
                        সময়: {currentExam.duration} মিনিট
                      </div>
                      <div className="bg-black/30 p-3 rounded">
                        <BookOpen className="h-4 w-4 mb-1" />
                        মোট নম্বর: {currentExam.totalMarks}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setExamStarted(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    পরীক্ষা শুরু করুন
                  </Button>
                </div>
              )}

              {examStarted && !examCompleted && (
                <div className="space-y-6">
                  {currentExam.questions.map((question, index) => (
                    <Card key={question.id} className="bg-black/30 border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">
                          প্রশ্ন {index + 1} ({question.marks} নম্বর)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white mb-4">{question.question}</p>
                        
                        {question.type === 'mcq' && question.options ? (
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question_${question.id}`}
                                  value={option}
                                  onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
                                  className="text-blue-600"
                                />
                                <span className="text-white">{option}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <Textarea
                            placeholder="এখানে আপনার উত্তর লিখুন..."
                            value={answers[question.id] || ''}
                            onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
                            className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={submitExam}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      পরীক্ষা জমা দিন
                    </Button>
                  </div>
                </div>
              )}

              {examCompleted && score !== null && (
                <div className="text-center space-y-4">
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-6">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">পরীক্ষা সম্পন্ন হয়েছে!</h3>
                    <p className="text-2xl font-bold text-green-400">
                      আপনার স্কোর: {score}/{currentExam.totalMarks}
                    </p>
                    <p className="text-gray-300 mt-2">
                      শতকরা নম্বর: {Math.round((score / currentExam.totalMarks) * 100)}%
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setShowExamModal(false);
                      setCurrentExam(null);
                      setExamCompleted(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    বন্ধ করুন
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExamSystem;
