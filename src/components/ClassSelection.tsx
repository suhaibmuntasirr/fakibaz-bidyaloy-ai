
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, MessageCircle, Star } from 'lucide-react';
import AccessibleButton from './AccessibleButton';

const ClassSelection = () => {
  const classes = [
    {
      id: 'class-1-5',
      title: 'ক্লাস ১-৫',
      subtitle: 'প্রাথমিক শিক্ষা',
      color: 'from-blue-500 to-blue-700',
      icon: '🎯',
      students: '১২,৫০০'
    },
    {
      id: 'class-6-8', 
      title: 'ক্লাস ৬-৮',
      subtitle: 'মাধ্যমিক প্রস্তুতি',
      color: 'from-green-500 to-green-700',
      icon: '📚',
      students: '৮,৭৫০'
    },
    {
      id: 'class-9-10',
      title: 'ক্লাস ৯-১০',
      subtitle: 'SSC প্রস্তুতি',
      color: 'from-purple-500 to-purple-700',
      icon: '🎯',
      students: '১৫,২০০'
    },
    {
      id: 'class-11-12',
      title: 'ক্লাস ১১-১২',
      subtitle: 'HSC প্রস্তুতি',
      color: 'from-orange-500 to-orange-700',
      icon: '🏆',
      students: '৯,৮৫০'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'নোট শেয়ার করুন',
      subtitle: 'আপনার তৈরি নোট আপলোড করে অন্যদের সাহায্য করুন'
    },
    {
      icon: Users,
      title: 'কমিউনিটি সাপোর্ট',
      subtitle: 'সবার সাথে মিলে পড়াশোনা করুন এবং একসাথে এগিয়ে যান'
    },
    {
      icon: MessageCircle,
      title: 'লক্ষ্য অর্জন',
      subtitle: 'আপনার লক্ষ্য পূরণ করুন এবর তানুদের হৃদয় পুরণে সাহায্য করুন'
    }
  ];

  return (
    <section className="py-16 px-4 bg-black/5">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            যে কোন ক্লাসের নোট পাও এখানেই
          </h2>
          <p className="text-gray-300 text-lg">
            সব ক্লাসের সম্পূর্ণ কোর্স নোট চলছে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {classes.map((classItem) => (
            <Card 
              key={classItem.id}
              className="bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${classItem.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {classItem.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{classItem.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{classItem.subtitle}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-blue-300 border-blue-600/30">
                    <BookOpen className="w-3 h-3 mr-1" />
                    নোট
                  </Badge>
                  <span className="text-gray-400 text-xs">{classItem.students} ছাত্র</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            P2P নোট ও প্রশ্নব্যাংক সিস্টেম
          </h3>
          <p className="text-gray-300 text-center mb-8">
            নিজের প্রয়োজন মিত, অন্যদের সাহায্য করুন
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassSelection;
