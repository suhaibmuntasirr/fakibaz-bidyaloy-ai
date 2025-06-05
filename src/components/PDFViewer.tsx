
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, ThumbsUp, MessageCircle, Star, X, 
  FileText, User, Calendar, BookOpen, School, Send
} from 'lucide-react';
import { Note } from '@/types/common';
import { useToast } from '@/hooks/use-toast';

export interface Question {
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
  uploaderId: string;
  views: number;
  likes: number;
  answers: number;
  hasAnswerKey: boolean;
  uploadDate: Date;
  verified: boolean;
  questionFileUrl: string;
  answerFileUrl?: string;
  fileName: string;
  answerFileName?: string;
  likedBy: string[];
  chapter?: string;
  description?: string;
}

interface PDFViewerProps {
  item: Note | Question;
  type: 'note' | 'question';
  onClose: () => void;
  onLike: () => void;
  onDownload: () => void;
  onRate?: (rating: number) => void;
  onComment?: (comment: string) => void;
  isLiked: boolean;
  comments?: Array<{id: string, author: string, text: string, timestamp: Date}>;
  newComment?: string;
  onCommentChange?: (text: string) => void;
  userRating?: number;
}

const PDFViewer = ({ 
  item, 
  type, 
  onClose, 
  onLike, 
  onDownload, 
  onRate,
  onComment,
  isLiked,
  comments = [],
  newComment = '',
  onCommentChange,
  userRating
}: PDFViewerProps) => {
  const [showComments, setShowComments] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'comments' | 'rating'>('info');
  const { toast } = useToast();

  const isNote = type === 'note';
  const note = isNote ? item as Note : null;
  const question = !isNote ? item as Question : null;

  const handleRatingClick = (rating: number) => {
    if (onRate) {
      onRate(rating);
    }
  };

  const handleCommentSubmit = () => {
    if (onComment && newComment.trim()) {
      onComment(newComment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-7xl max-h-[95vh] bg-[#28282B] rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white/10 border-b border-white/20 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white truncate mr-4">
            {item.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* PDF Preview Section */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <FileText className="h-24 w-24 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">PDF প্রিভিউ</h3>
              <p className="text-sm mb-4">
                {isNote ? note?.fileName : question?.fileName}
              </p>
              <p className="text-xs text-gray-500">
                আসল PDF ভিউয়ার এখানে থাকবে
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="w-80 bg-white/10 backdrop-blur-lg border-l border-white/20 overflow-y-auto">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 text-sm px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'info' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  তথ্য
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 text-sm px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'comments' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  মন্তব্য ({comments.length})
                </button>
                {isNote && (
                  <button
                    onClick={() => setActiveTab('rating')}
                    className={`flex-1 text-sm px-3 py-2 rounded-md transition-colors ${
                      activeTab === 'rating' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    রেটিং
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">বিস্তারিত তথ্য</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-300" />
                        <span className="text-gray-300">ক্লাস:</span>
                        <span className="text-white ml-2">{item.class}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-gray-300" />
                        <span className="text-gray-300">বিষয়:</span>
                        <span className="text-white ml-2">{item.subject}</span>
                      </div>

                      {isNote && note && (
                        <div className="flex items-center text-sm">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-300" />
                          <span className="text-gray-300">অধ্যায়:</span>
                          <span className="text-white ml-2">{note.chapter}</span>
                        </div>
                      )}

                      {question && (
                        <>
                          <div className="flex items-center text-sm">
                            <School className="h-4 w-4 mr-2 text-gray-300" />
                            <span className="text-gray-300">স্কুল:</span>
                            <span className="text-white ml-2 text-xs">{question.school}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-300" />
                            <span className="text-gray-300">বছর:</span>
                            <span className="text-white ml-2">{question.year}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <FileText className="h-4 w-4 mr-2 text-gray-300" />
                            <span className="text-gray-300">পরীক্ষা:</span>
                            <span className="text-white ml-2">{question.examType}</span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-gray-300" />
                        <span className="text-gray-300">
                          {isNote ? 'লেখক:' : 'আপলোডার:'}
                        </span>
                        <span className="text-white ml-2">
                          {isNote ? note?.author : question?.uploader}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-300" />
                        <span className="text-gray-300">আপলোড:</span>
                        <span className="text-white ml-2">
                          {item.uploadDate.toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">পরিসংখ্যান</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">{item.likes}</div>
                          <div className="text-xs text-gray-300">লাইক</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {isNote ? note?.downloads : question?.views}
                          </div>
                          <div className="text-xs text-gray-300">
                            {isNote ? 'ডাউনলোড' : 'দেখা'}
                          </div>
                        </div>
                        {isNote && note && (
                          <>
                            <div>
                              <div className="text-2xl font-bold text-white">{note.comments}</div>
                              <div className="text-xs text-gray-300">মন্তব্য</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">{note.rating.toFixed(1)}</div>
                              <div className="text-xs text-gray-300">রেটিং</div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  {((isNote && note?.description) || (question && question.difficulty)) && (
                    <Card className="bg-white/10 border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">বিবরণ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isNote && note?.description && (
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {note.description}
                          </p>
                        )}
                        {question && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">কঠিনতা:</span>
                              <Badge className={`${
                                question.difficulty === 'Easy' ? 'bg-green-500' :
                                question.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                              } text-white`}>
                                {question.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">নম্বর:</span>
                              <span className="text-white">{question.marks}</span>
                            </div>
                            {question.hasAnswerKey && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">উত্তর:</span>
                                <Badge className="bg-blue-600 text-white">
                                  উত্তর সহ
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Textarea
                          placeholder="আপনার মন্তব্য লিখুন..."
                          value={newComment}
                          onChange={(e) => onCommentChange?.(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                          rows={3}
                        />
                        <Button 
                          onClick={handleCommentSubmit}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!newComment.trim()}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          মন্তব্য পাঠান
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400">এখনও কোন মন্তব্য নেই</p>
                        <p className="text-gray-500 text-sm">প্রথম মন্তব্য করুন!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <Card key={comment.id} className="bg-white/10 border-white/20">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {comment.author.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-white text-sm font-medium">
                                    {comment.author}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    {comment.timestamp.toLocaleDateString('bn-BD')}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-sm">{comment.text}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'rating' && isNote && (
                <div className="space-y-6">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">রেটিং দিন</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className="flex justify-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingClick(star)}
                              className="transition-colors"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  (userRating || 0) >= star 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-600 hover:text-yellow-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        {userRating && (
                          <p className="text-gray-300 text-sm">
                            আপনি {userRating} স্টার দিয়েছেন
                          </p>
                        )}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {note?.rating.toFixed(1)}
                          </div>
                          <div className="text-gray-300 text-sm">গড় রেটিং</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <Button 
                  onClick={onDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  ডাউনলোড করুন
                </Button>
                
                <Button 
                  onClick={onLike}
                  variant="outline"
                  className={`w-full ${
                    isLiked 
                      ? 'bg-red-600/20 border-red-500/20 text-red-300' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {isLiked ? 'লাইক দেওয়া' : 'লাইক'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
