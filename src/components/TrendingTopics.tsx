
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageCircle, Heart, Share2 } from 'lucide-react';

const TrendingTopics = () => {
  const trendingTopics = [
    {
      id: 1,
      title: 'পদার্থবিজ্ঞান - নিউটনের সূত্র',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 11',
      discussions: 234,
      likes: 156,
      trending: true
    },
    {
      id: 2,
      title: 'গণিত - ক্যালকুলাস সমাধান',
      subject: 'গণিত',
      class: 'Class 12',
      discussions: 187,
      likes: 132,
      trending: true
    },
    {
      id: 3,
      title: 'রসায়ন - জৈব যৌগ',
      subject: 'রসায়ন',
      class: 'Class 10',
      discussions: 145,
      likes: 98,
      trending: false
    }
  ];

  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-yellow-400" />
          ট্রেন্ডিং টপিক
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium text-sm">{topic.title}</h3>
              {topic.trending && (
                <Badge className="bg-yellow-600/20 text-yellow-300 text-xs">
                  ট্রেন্ডিং
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-blue-300 border-blue-600/30 text-xs">
                {topic.class}
              </Badge>
              <Badge variant="outline" className="text-green-300 border-green-600/30 text-xs">
                {topic.subject}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {topic.discussions}
                </span>
                <span className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {topic.likes}
                </span>
              </div>
              <button className="hover:text-blue-400 transition-colors">
                <Share2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
