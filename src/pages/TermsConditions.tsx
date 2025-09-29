
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1632] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-3xl mb-4">শর্তাবলী</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">১. সেবা গ্রহণ</h2>
              <p className="leading-relaxed">
                Fakibaz প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি আমাদের সকল শর্তাবলী মেনে নিতে সম্মত হচ্ছেন। 
                আমাদের সেবা শিক্ষার্থীদের জন্য নোট, প্রশ্নপত্র এবং শিক্ষামূলক সামগ্রী প্রদান করে।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">২. ব্যবহারকারীর দায়িত্ব</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>সঠিক তথ্য প্রদান করা</li>
                <li>অন্যদের কপিরাইট সম্মান করা</li>
                <li>অনুপযুক্ত কন্টেন্ট আপলোড না করা</li>
                <li>প্ল্যাটফর্মের অপব্যবহার না করা</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৩. বুদ্ধিবৃত্তিক সম্পত্তি</h2>
              <p className="leading-relaxed">
                প্ল্যাটফর্মে আপলোড করা সকল কন্টেন্টের জন্য ব্যবহারকারী দায়ী। আমরা কপিরাইট লঙ্ঘনের বিরুদ্ধে 
                কঠোর ব্যবস্থা নিই এবং প্রয়োজনে কন্টেন্ট সরিয়ে দেওয়ার অধিকার রাখি।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৪. গোপনীয়তা</h2>
              <p className="leading-relaxed">
                আমরা ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করি। আমাদের গোপনীয়তা নীতি 
                অনুযায়ী আপনার তথ্য ব্যবহার করা হয়।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৫. সেবা পরিবর্তন</h2>
              <p className="leading-relaxed">
                আমরা যেকোনো সময় আমাদের সেবা পরিবর্তন, স্থগিত বা বন্ধ করার অধিকার রাখি। 
                গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আগাম নোটিশ দেওয়া হবে।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">৬. যোগাযোগ</h2>
              <p className="leading-relaxed">
                কোনো প্রশ্ন বা সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন: team@fakibaz.com বা ১৬৭৮০ নম্বরে কল করুন।
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
