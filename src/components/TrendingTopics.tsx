
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageCircle, Users, Eye } from 'lucide-react';

interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  posts: number;
  views: number;
  trend: 'up' | 'down' | 'stable';
  growth: number;
}

const TrendingTopics = () => {
  const trendingTopics: TrendingTopic[] = [
    {
      id: '1',
      title: 'HSC গণিত - ক্যালকুলাস',
      category: 'গণিত',
      posts: 145,
      views: 3200,
      trend: 'up',
      growth: 23
    },
    {
      id: '2',
      title: 'SSC বিজ্ঞান - পদার্থবিজ্ঞান',
      category: 'বিজ্ঞান',
      posts: 89,
      views: 2100,
      trend: 'up',
      growth: 15
    },
    {
      id: '3',
      title: 'ইংরেজি গ্রামার টিপস',
      category: 'English',
      posts: 234,
      views: 4500,
      trend: 'up',
      growth: 31
    },
    {
      id: '4',
      title: 'রসায়ন - জৈব যৌগ',
      category: 'রসায়ন',
      posts: 67,
      views: 1800,
      trend: 'stable',
      growth: 0
    },
    {
      id: '5',
      title: 'বাংলা সাহিত্য আলোচনা',
      category: 'বাংলা',
      posts: 156,
      views: 2800,
      trend: 'up',
      growth: 12
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-400" />;
    return <div className="h-4 w-4 rounded-full bg-gray-400"></div>;
  };

  return (
    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
          ট্রেন্ডিং টপিকস
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium text-sm">{topic.title}</h4>
              {getTrendIcon(topic.trend)}
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 text-xs">
                {topic.category}
              </Badge>
              
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <div className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {topic.posts}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {topic.views.toLocaleString()}
                </div>
                {topic.growth > 0 && (
                  <div className="text-green-400">
                    +{topic.growth}%
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
