
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

interface SubscriptionCardProps {
  title: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSubscribe: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  duration,
  features,
  isPopular = false,
  isCurrentPlan = false,
  onSubscribe
}) => {
  return (
    <Card className={`relative bg-gradient-to-br from-[#28282B]/80 via-purple-600/20 to-blue-600/20 backdrop-blur-lg border-white/20 transition-all duration-300 hover:scale-105 ${
      isPopular ? 'ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-400/20' : ''
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
            <Star className="w-4 h-4 mr-1" />
            জনপ্রিয়
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-white text-xl mb-2">{title}</CardTitle>
        <div className="text-3xl font-bold text-white mb-1">{price}</div>
        <div className="text-gray-300 text-sm">{duration}</div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-gray-200 text-sm">
              <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onSubscribe}
          disabled={isCurrentPlan}
          className={`w-full mt-6 ${
            isCurrentPlan 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
              : isPopular
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          } backdrop-blur-lg border border-white/10`}
        >
          {isCurrentPlan ? 'বর্তমান প্ল্যান' : 'সাবস্ক্রাইব করুন'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
