
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, ThumbsUp, MessageCircle, Star, X, 
  FileText, User, Calendar, BookOpen, School
} from 'lucide-react';
import { Note, Question } from '@/services/notesService';

interface PDFViewerProps {
  item: Note | Question;
  type: 'note' | 'question';
  onClose: () => void;
  onLike: () => void;
  onDownload: () => void;
  isLiked: boolean;
}

const PDFViewer = ({ item, type, onClose, onLike, onDownload, isLiked }: PDFViewerProps) => {
  const isNote = type === 'note';
  const note = isNote ? item as Note : null;
  const question = !isNote ? item as Question : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-7xl bg-[#28282B] rounded-lg overflow-hidden flex flex-col">
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
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">তথ্য</CardTitle>
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
                          <div className="text-2xl font-bold text-white">{note.rating}</div>
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

              {/* Tags */}
              {isNote && note?.tags && note.tags.length > 0 && (
                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">ট্যাগ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <Badge key={tag} className="bg-blue-600/30 text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={onDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  ডাউনলোড করুন
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={onLike}
                    variant="outline"
                    className={`flex-1 ${
                      isLiked 
                        ? 'bg-red-600/20 border-red-500/20 text-red-300' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {isLiked ? 'লাইক দেওয়া' : 'লাইক'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    মন্তব্য
                  </Button>
                </div>

                {isNote && note && (
                  <Button 
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    রেটিং দিন
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
