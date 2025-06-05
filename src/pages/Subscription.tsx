
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import SubscriptionCard from '@/components/SubscriptionCard';
import Footer from '@/components/Footer';
import { Crown, Users, Gift, CreditCard, Smartphone, Headphones, ChevronDown, ChevronUp } from 'lucide-react';

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const freeFeatures = [
    'দৈনিক ৫টি নোট দেখার সুবিধা',
    'প্রশ্ন ব্যাংকে সীমিত অ্যাক্সেস',
    'বেসিক কোলাবরেশন',
    'বিজ্ঞাপনসহ ব্যবহার',
    'কমিউনিটি সাপোর্ট'
  ];

  const premiumFeatures = [
    'সব নোট ও প্রশ্ন ব্যাংকে সীমাহীন অ্যাক্সেস',
    'বিজ্ঞাপনমুক্ত অভিজ্ঞতা',
    'অফলাইন অ্যাক্সেস ও সিঙ্ক',
    'অ্যাডভান্সড সার্চ ও ট্যাগিং',
    'কাস্টমাইজেবল টেমপ্লেট ও থিম',
    'বেসিক অ্যানালিটিক্স ও প্রগ্রেস ট্র্যাকিং',
    'ইমেইল ও চ্যাট সাপোর্ট',
    'সীমাহীন P2P শেয়ারিং',
    'AI-Powered ফিচার (সামারাইজেশন, প্রশ্ন জেনারেশন)',
    'এক্সট্রা ক্লাউড স্টোরেজ (১০ GB)'
  ];

  const faqs = [
    {
      q: "প্রিমিয়াম প্ল্যান কেনার পর কখন থেকে ব্যবহার করতে পারব?",
      a: "পেমেন্ট কমপ্লিট হওয়ার সাথে সাথেই আপনার অ্যাকাউন্ট আপগ্রেড হয়ে যাবে। আপনি তাৎক্ষণিক সকল প্রিমিয়াম ফিচার অ্যাক্সেস করতে পারবেন।"
    },
    {
      q: "কি কি পেমেন্ট মেথড সাপোর্ট করে?",
      a: "আমরা bKash, Nagad, Rocket এবং সব ধরনের ভিসা/মাস্টারকার্ড সাপোর্ট করি। পেমেন্ট ১০০% নিরাপদ এবং এনক্রিপ্টেড।"
    },
    {
      q: "বার্ষিক প্ল্যানে কত টাকা সাশ্রয় হবে?",
      a: "বার্ষিক প্ল্যানে আপনি ১৭% সাশ্রয় পাবেন। মাসিক ১২০ টাকার পরিবর্তে বছরে মাত্র ১০০ টাকা। এতে ২০ টাকা সাশ্রয় হবে।"
    },
    {
      q: "রেফারেল বোনাস কিভাবে কাজ করে?",
      a: "আপনার রেফারেল লিংক দিয়ে কেউ প্রিমিয়াম সাবস্ক্রাইব করলে আপনি ১ মাস ফ্রি পাবেন। রেফার করা ব্যক্তিও ১০% ছাড় পাবেন।"
    },
    {
      q: "অফলাইন ব্যবহার কিভাবে কাজ করে?",
      a: "প্রিমিয়াম ইউজাররা যেকোনো নোট বা প্রশ্নপত্র ডাউনলোড করে অফলাইনে পড়তে পারবেন। ইন্টারনেট কানেকশন থাকলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।"
    },
    {
      q: "আমার ডেটা কতটা নিরাপদ?",
      a: "আমরা আন্তর্জাতিক মানের এনক্রিপশন ব্যবহার করি। আপনার ব্যক্তিগত তথ্য সম্পূর্ণ নিরাপদ এবং তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।"
    }
  ];

  const handleSubscribe = (planType: string) => {
    console.log(`Subscribing to ${planType} plan`);
    // Implement subscription logic here
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            আপনার শিক্ষার যাত্রা শুরু করুন
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-8 px-2">
            অতি সাশ্রয়ী মূল্যে প্রিমিয়াম শিক্ষার সুবিধা পান
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg p-1 mx-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 sm:px-6 py-2 rounded-md transition-all text-sm sm:text-base ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              মাসিক
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 sm:px-6 py-2 rounded-md transition-all relative text-sm sm:text-base ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              বার্ষিক
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-black text-xs">
                ১৭% ছাড়
              </Badge>
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16">
          <SubscriptionCard
            title="ফ্রি প্ল্যান"
            price="৳০"
            duration="সবসময়ের জন্য"
            features={freeFeatures}
            onSubscribe={() => handleSubscribe('free')}
          />
          
          <SubscriptionCard
            title="প্রিমিয়াম প্ল্যান"
            price={billingCycle === 'monthly' ? '৳১০' : '৳১০০'}
            duration={billingCycle === 'monthly' ? 'প্রতি মাসে' : 'প্রতি বছরে'}
            features={premiumFeatures}
            isPopular={true}
            onSubscribe={() => handleSubscribe('premium')}
          />
        </div>

        {/* Payment Methods */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl sm:text-2xl mb-2 flex items-center justify-center">
              <CreditCard className="mr-2" />
              পেমেন্ট পদ্ধতি
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['bKash', 'Nagad', 'Rocket', 'VISA'].map((method, index) => (
                <div key={method} className={`bg-gradient-to-br ${
                  index === 0 ? 'from-black/40 to-pink-900/30' :
                  index === 1 ? 'from-black/40 to-orange-900/30' :
                  index === 2 ? 'from-black/40 to-purple-900/30' :
                  'from-black/40 to-blue-900/30'
                } rounded-lg p-4 text-center border border-white/10 hover:scale-105 transition-transform`}>
                  <div className="text-white font-semibold text-sm sm:text-base">{method}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-300 mt-4 text-sm sm:text-base">
              নিরাপদ ও সহজ পেমেন্ট • ১০০% সুরক্ষিত
            </p>
          </CardContent>
        </Card>

        {/* Special Offers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-black/40 to-orange-900/30 backdrop-blur-lg border border-white/10 hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">গ্রুপ ডিসকাউন্ট</h3>
              <p className="text-gray-300 text-sm mb-4">
                স্কুল বা গ্রুপের জন্য বিশেষ ছাড়
              </p>
              <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white text-sm">
                আরও জানুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/40 to-pink-900/30 backdrop-blur-lg border border-white/10 hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">রেফারেল বোনাস</h3>
              <p className="text-gray-300 text-sm mb-4">
                বন্ধুদের আনুন, ফ্রি মাস জিতুন
              </p>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-sm">
                শেয়ার করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/40 to-indigo-900/30 backdrop-blur-lg border border-white/10 hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-6 text-center">
              <Headphones className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">২৪/৭ সাপোর্ট</h3>
              <p className="text-gray-300 text-sm mb-4">
                যেকোনো সমস্যায় তাৎক্ষণিক সাহায্য
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm">
                যোগাযোগ করুন
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl sm:text-2xl text-center">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-r from-black/40 to-violet-900/30 rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h4 className="text-white font-semibold text-sm sm:text-base pr-2">{faq.q}</h4>
                  {expandedFaq === index ? (
                    <ChevronUp className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Subscription;
