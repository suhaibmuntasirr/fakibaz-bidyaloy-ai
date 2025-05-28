
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import SubscriptionCard from '@/components/SubscriptionCard';
import { Crown, Users, Gift, CreditCard, Smartphone, Headphones } from 'lucide-react';

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
    'সীমাহীন P2P শেয়ারিং'
  ];

  const addOnFeatures = [
    { name: 'AI-Powered ফিচার', price: '৫ টাকা/মাস', description: 'সামারাইজেশন, প্রশ্ন জেনারেশন' },
    { name: 'এক্সট্রা ক্লাউড স্টোরেজ', price: '৩ টাকা/মাস', description: '১০ GB অতিরিক্ত স্টোরেজ' },
    { name: 'প্রিমিয়াম সাপোর্ট', price: '৭ টাকা/মাস', description: '২৪/৭ ফোন ও ভিডিও সাপোর্ট' }
  ];

  const handleSubscribe = (planType: string) => {
    console.log(`Subscribing to ${planType} plan`);
    // Implement subscription logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            আপনার শিক্ষার যাত্রা শুরু করুন
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            অতি সাশ্রয়ী মূল্যে প্রিমিয়াম শিক্ষার সুবিধা পান
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-lg border border-white/20 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              মাসিক
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all relative ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
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

        {/* Add-ons Section */}
        <Card className="bg-gradient-to-br from-black/60 via-green-900/30 to-teal-900/40 backdrop-blur-lg border-white/20 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-2">
              অতিরিক্ত ফিচার
            </CardTitle>
            <p className="text-gray-300">আপনার প্রয়োজন অনুযায়ী আরও ফিচার যোগ করুন</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addOnFeatures.map((addon, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-2">{addon.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{addon.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-bold">{addon.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                      যোগ করুন
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-gradient-to-br from-black/60 via-blue-900/30 to-purple-900/40 backdrop-blur-lg border-white/20 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-2 flex items-center justify-center">
              <CreditCard className="mr-2" />
              পেমেন্ট পদ্ধতি
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['bKash', 'Nagad', 'Rocket', 'VISA'].map((method) => (
                <div key={method} className="bg-black/30 rounded-lg p-4 text-center border border-white/10">
                  <div className="text-white font-semibold">{method}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-300 mt-4">
              নিরাপদ ও সহজ পেমেন্ট • ১০০% সুরক্ষিত
            </p>
          </CardContent>
        </Card>

        {/* Special Offers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-black/60 via-orange-900/30 to-yellow-900/40 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">গ্রুপ ডিসকাউন্ট</h3>
              <p className="text-gray-300 text-sm mb-4">
                স্কুল বা গ্রুপের জন্য বিশেষ ছাড়
              </p>
              <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white">
                আরও জানুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/60 via-pink-900/30 to-purple-900/40 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <Gift className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">রেফারেল বোনাস</h3>
              <p className="text-gray-300 text-sm mb-4">
                বন্ধুদের আনুন, ফ্রি মাস জিতুন
              </p>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                শেয়ার করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/60 via-indigo-900/30 to-blue-900/40 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6 text-center">
              <Headphones className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">২৪/৭ সাপোর্ট</h3>
              <p className="text-gray-300 text-sm mb-4">
                যেকোনো সমস্যায় তাৎক্ষণিক সাহায্য
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white">
                যোগাযোগ করুন
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-to-br from-black/60 via-gray-900/30 to-slate-900/40 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                q: "প্রিমিয়াম প্ল্যান কেনার পর কখন থেকে ব্যবহার করতে পারব?",
                a: "পেমেন্ট কমপ্লিট হওয়ার সাথে সাথেই আপনার অ্যাকাউন্ট আপগ্রেড হয়ে যাবে।"
              },
              {
                q: "কি কি পেমেন্ট মেথড সাপোর্ট করে?",
                a: "bKash, Nagad, Rocket এবং সব ধরনের ভিসা কার্ড সাপোর্ট করি।"
              },
              {
                q: "রেফারেল বোনাস কিভাবে কাজ করে?",
                a: "আপনার রেফারেল লিংক দিয়ে কেউ সাবস্ক্রাইব করলে আপনি ১ মাস ফ্রি পাবেন।"
              }
            ].map((faq, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-gray-300 text-sm">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">
            2025 Copyright © Fakibaz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Subscription;
