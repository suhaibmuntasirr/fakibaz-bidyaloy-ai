
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#28282B] via-[#1a1a1d] to-[#28282B]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-3xl mb-4">গোপনীয়তা নীতি</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">১. তথ্য সংগ্রহ</h2>
              <p className="leading-relaxed">
                আমরা আপনার নাম, ইমেইল, ফোন নম্বর, শিক্ষা প্রতিষ্ঠানের তথ্য এবং ব্যবহারের ডেটা সংগ্রহ করি। 
                এই তথ্যগুলো সেবা প্রদান এবং উন্নতির জন্য ব্যবহৃত হয়।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">২. তথ্যের ব্যবহার</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>ব্যক্তিগত অভিজ্ঞতা প্রদান</li>
                <li>গ্রাহক সেবা উন্নতি</li>
                <li>নিরাপত্তা নিশ্চিতকরণ</li>
                <li>শিক্ষামূলক কন্টেন্ট সুপারিশ</li>
                <li>প্রয়োজনীয় আপডেট ও নোটিশ পাঠানো</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৩. তথ্য সুরক্ষা</h2>
              <p className="leading-relaxed">
                আমরা আন্তর্জাতিক মানের এনক্রিপশন এবং নিরাপত্তা ব্যবস্থা ব্যবহার করি। 
                আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে আপনার অনুমতি ছাড়া শেয়ার করা হয় না।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৪. কুকিজ ব্যবহার</h2>
              <p className="leading-relaxed">
                আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি। 
                আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ করতে পারেন।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৫. তৃতীয় পক্ষের সেবা</h2>
              <p className="leading-relaxed">
                আমরা পেমেন্ট প্রসেসিং এবং অ্যানালিটিক্সের জন্য বিশ্বস্ত তৃতীয় পক্ষের সেবা ব্যবহার করি। 
                এই সেবাদাতাদের নিজস্ব গোপনীয়তা নীতি রয়েছে।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৬. আপনার অধিকার</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>আপনার তথ্য দেখার অধিকার</li>
                <li>তথ্য সংশোধনের অধিকার</li>
                <li>তথ্য মুছে দেওয়ার অধিকার</li>
                <li>ডেটা পোর্টেবিলিটির অধিকার</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৭. যোগাযোগ</h2>
              <p className="leading-relaxed">
                গোপনীয়তা সম্পর্কিত যেকোনো প্রশ্ন বা উদ্বেগের জন্য:
                <br />ইমেইল: privacy@fakibaz.com
                <br />ফোন: ১৬৭৮০
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
