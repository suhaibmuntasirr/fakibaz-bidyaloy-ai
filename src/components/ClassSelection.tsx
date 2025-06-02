
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const ClassSelection = () => {
  const navigate = useNavigate();
  
  const classes = [
    { id: 'class-1-5', name: 'ক্লাস ১-৫', route: '/notes?class=1-5' },
    { id: 'class-6-8', name: 'ক্লাস ৬-৮', route: '/notes?class=6-8' },
    { id: 'ssc', name: 'SSC', route: '/notes?class=ssc' },
    { id: 'hsc', name: 'HSC', route: '/notes?class=hsc' },
    { id: 'university', name: 'বিশ্ববিদ্যালয়', route: '/notes?class=university' },
    { id: 'competitive', name: 'চাকরির পরীক্ষা', route: '/notes?class=competitive' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <Card 
          key={classItem.id}
          className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all cursor-pointer group"
          onClick={() => navigate(classItem.route)}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg">{classItem.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassSelection;
