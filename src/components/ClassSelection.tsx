
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
      {classes.map((classItem, index) => (
        <Card 
          key={classItem.id}
          className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => navigate(classItem.route)}
        >
          {/* Simple Glass Effect Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300" />
          
          <CardContent className="relative z-10 p-6 md:p-8 text-center">
            {/* Clean Icon Design */}
            <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${classItem.gradient} rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            
            {/* Simple Text */}
            <h3 className="text-white font-semibold text-base md:text-lg">
              {classItem.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassSelection;
