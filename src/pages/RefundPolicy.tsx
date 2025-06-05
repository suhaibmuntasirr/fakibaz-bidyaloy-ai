
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-3xl mb-4">রিফান্ড নীতি</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">১. রিফান্ডের শর্তাবলী</h2>
              <p className="leading-relaxed">
                আমরা গ্রাহক সন্তুষ্টিকে প্রাধান্য দিই। নির্দিষ্ট শর্তাবলীর অধীনে রিফান্ডের সুবিধা প্রদান করি।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">২. রিফান্ডযোগ্য ক্ষেত্রসমূহ</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>পেমেন্টের পর ৭ দিনের মধ্যে সেবা ব্যবহার না করলে</li>
                <li>প্রযুক্তিগত সমস্যার কারণে সেবা ব্যবহার করতে না পারলে</li>
                <li>ভুলবশত ডুপ্লিকেট পেমেন্ট হলে</li>
                <li>আমাদের পক্ষ থেকে সেবা প্রদানে ব্যর্থতা</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৩. রিফান্ড প্রক্রিয়া</h2>
              <p className="leading-relaxed">
                রিফান্ডের জন্য আবেদন করতে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। 
                আবেদন গ্রহণের পর ৭-১৪ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া সম্পন্ন হবে।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৪. অরিফান্ডযোগ্য ক্ষেত্রসমূহ</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>১৫ দিনের বেশি সময় পার হলে</li>
                <li>উল্লেখযোগ্য পরিমাণ সেবা ব্যবহার করার পর</li>
                <li>নীতি লঙ্ঘনের কারণে অ্যাকাউন্ট বন্ধ হলে</li>
                <li>ফ্রি ট্রায়াল পিরিয়ডের ক্ষেত্রে</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৫. রিফান্ড পদ্ধতি</h2>
              <p className="leading-relaxed">
                রিফান্ড একই পেমেন্ট মেথডে ফেরত দেওয়া হবে যেটি দিয়ে পেমেন্ট করা হয়েছিল। 
                bKash, Nagad, Rocket এর ক্ষেত্রে সরাসরি অ্যাকাউন্টে পাঠানো হবে।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৬. যোগাযোগ</h2>
              <p className="leading-relaxed">
                রিফান্ড সম্পর্কিত যেকোনো প্রশ্নের জন্য যোগাযোগ করুন:
                <br />ইমেইল: team@fakibaz.com
                <br />ফোন: ১৬৭৮০
                <br />সময়: সকাল ৯টা - রাত ৯টা (৭ দিন)
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default RefundPolicy;
