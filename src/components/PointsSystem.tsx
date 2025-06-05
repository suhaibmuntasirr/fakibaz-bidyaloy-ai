
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, DollarSign, TrendingUp } from 'lucide-react';

interface PointsSystemProps {
  rating: number;
  downloads: number;
  likes: number;
  uploadType: 'note' | 'question';
}

const PointsSystem: React.FC<PointsSystemProps> = ({ rating, downloads, likes, uploadType }) => {
  // Points calculation system
  const calculatePoints = () => {
    let basePoints = 0;
    let bonusPoints = 0;
    let qualityMultiplier = 1;

    // Base points for uploading
    if (uploadType === 'note') {
      basePoints = 10;
    } else {
      basePoints = 15; // Questions get more base points
    }

    // Rating-based quality multiplier
    if (rating >= 4.8) {
      qualityMultiplier = 3.0;
      bonusPoints += 50;
    } else if (rating >= 4.5) {
      qualityMultiplier = 2.5;
      bonusPoints += 30;
    } else if (rating >= 4.0) {
      qualityMultiplier = 2.0;
      bonusPoints += 20;
    } else if (rating >= 3.5) {
      qualityMultiplier = 1.5;
      bonusPoints += 10;
    } else if (rating >= 3.0) {
      qualityMultiplier = 1.2;
      bonusPoints += 5;
    }

    // Download and like bonuses
    const downloadBonus = Math.min(downloads * 2, 100); // Max 100 points from downloads
    const likeBonus = Math.min(likes * 3, 75); // Max 75 points from likes

    const totalPoints = Math.floor((basePoints + downloadBonus + likeBonus) * qualityMultiplier + bonusPoints);
    
    return {
      basePoints,
      qualityMultiplier,
      bonusPoints,
      downloadBonus,
      likeBonus,
      totalPoints
    };
  };

  const calculateEarnings = (points: number) => {
    // 1 point = 0.50 BDT
    return (points * 0.5).toFixed(2);
  };

  const getQualityBadge = (rating: number) => {
    if (rating >= 4.8) return { label: 'অসাধারণ', color: 'bg-yellow-600', icon: '🏆' };
    if (rating >= 4.5) return { label: 'চমৎকার', color: 'bg-purple-600', icon: '💎' };
    if (rating >= 4.0) return { label: 'ভাল', color: 'bg-blue-600', icon: '⭐' };
    if (rating >= 3.5) return { label: 'ঠিক আছে', color: 'bg-green-600', icon: '👍' };
    if (rating >= 3.0) return { label: 'গড়', color: 'bg-orange-600', icon: '📝' };
    return { label: 'উন্নতি প্রয়োজন', color: 'bg-red-600', icon: '📚' };
  };

  const points = calculatePoints();
  const earnings = calculateEarnings(points.totalPoints);
  const qualityBadge = getQualityBadge(rating);

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-400 flex items-center text-lg">
          <Award className="mr-2 h-5 w-5" />
          পয়েন্ট সিস্টেম
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Badge */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">মানের রেটিং:</span>
          <Badge className={`${qualityBadge.color}/20 text-white border-${qualityBadge.color.split('-')[1]}-500/50`}>
            {qualityBadge.icon} {qualityBadge.label}
          </Badge>
        </div>

        {/* Rating Display */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">রেটিং:</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-white ml-2">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="space-y-2 border-t border-gray-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">বেস পয়েন্ট:</span>
            <span className="text-white">{points.basePoints}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">ডাউনলোড বোনাস:</span>
            <span className="text-white">+{points.downloadBonus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">লাইক বোনাস:</span>
            <span className="text-white">+{points.likeBonus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">কোয়ালিটি মাল্টিপ্লায়ার:</span>
            <span className="text-white">×{points.qualityMultiplier}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">কোয়ালিটি বোনাস:</span>
            <span className="text-white">+{points.bonusPoints}</span>
          </div>
        </div>

        {/* Total Points */}
        <div className="flex justify-between items-center border-t border-gray-700 pt-3">
          <span className="text-lg font-semibold text-green-400">মোট পয়েন্ট:</span>
          <span className="text-xl font-bold text-green-400">{points.totalPoints}</span>
        </div>

        {/* Estimated Earnings */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 p-3 rounded-lg border border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-400 font-medium">আনুমানিক আয়:</span>
            </div>
            <span className="text-xl font-bold text-green-400">৳{earnings}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            * ১ পয়েন্ট = ০.৫০ টাকা | মাসিক পেমেন্ট
          </p>
        </div>

        {/* Tips for Better Points */}
        <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-blue-400 font-medium text-sm">আরো পয়েন্টের টিপস:</span>
          </div>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• উচ্চ মানের নোট আপলোড করুন (৪.৫+ রেটিং)</li>
            <li>• স্পষ্ট এবং সুন্দর হ্যান্ডরাইটিং ব্যবহার করুন</li>
            <li>• সম্পূর্ণ চ্যাপটার কভার করুন</li>
            <li>• নিয়মিত নোট আপলোড করুন</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsSystem;
