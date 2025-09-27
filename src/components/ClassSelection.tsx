
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const ClassSelection = () => {
  const navigate = useNavigate();
  
  const classes = [
    { id: 'class-1-5', name: 'ক্লাস ১-৫', route: '/notes?class=1-5', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'class-6-8', name: 'ক্লাস ৬-৮', route: '/notes?class=6-8', gradient: 'from-purple-500 to-pink-500' },
    { id: 'ssc', name: 'SSC', route: '/notes?class=ssc', gradient: 'from-green-500 to-emerald-500' },
    { id: 'hsc', name: 'HSC', route: '/notes?class=hsc', gradient: 'from-orange-500 to-red-500' },
    { id: 'university', name: 'বিশ্ববিদ্যালয়', route: '/notes?class=university', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'competitive', name: 'চাকরির পরীক্ষা', route: '/notes?class=competitive', gradient: 'from-teal-500 to-blue-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
      {classes.map((classItem, index) => (
        <Card 
          key={classItem.id}
          className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          onClick={() => navigate(classItem.route)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Glass Effect Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-300" />
          
          {/* Prominent Inner Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Lighting Edge Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/5 to-transparent group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
          
          {/* Top Highlight */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-white/80 transition-all duration-300" />
          
          {/* Shimmer Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </div>
          
          <CardContent className="relative z-10 p-6 md:p-10 text-center">
            {/* Enhanced Icon with Multiple Glow Effects */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8">
              {/* Outer Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${classItem.gradient} rounded-full blur-xl opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-300`} />
              
              {/* Main Icon Container */}
              <div className={`relative w-full h-full bg-gradient-to-br ${classItem.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                {/* Inner Highlight */}
                <div className="absolute inset-1 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full" />
                
                <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-white relative z-10 drop-shadow-lg" />
              </div>
              
              {/* Pulse Animation */}
              <div className={`absolute inset-0 bg-gradient-to-br ${classItem.gradient} rounded-full animate-ping opacity-20 group-hover:opacity-30`} />
            </div>
            
            {/* Enhanced Text with Gradient */}
            <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300 drop-shadow-lg">
              {classItem.name}
            </h3>
            
            {/* Subtle Subtitle */}
            <p className="text-white/60 text-sm mt-2 group-hover:text-white/80 transition-colors duration-300">
              এখানে ক্লিক করুন
            </p>
          </CardContent>
          
          {/* Bottom Edge Glow */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/60 transition-all duration-300" />
        </Card>
      ))}
    </div>
  );
};

export default ClassSelection;
