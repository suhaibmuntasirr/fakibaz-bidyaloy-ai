
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, BookOpen, Plus, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudyGroups = () => {
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const { toast } = useToast();

  const studyGroups = [
    {
      id: 1,
      name: 'HSC Physics Study Circle',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 12',
      members: 45,
      maxMembers: 50,
      nextSession: '২ ঘন্টা পরে',
      description: 'নিউটনের সূত্র ও গতিবিদ্যা নিয়ে আলোচনা'
    },
    {
      id: 2,
      name: 'Math Problem Solvers',
      subject: 'গণিত',
      class: 'Class 11',
      members: 32,
      maxMembers: 40,
      nextSession: 'আগামীকাল ৮ PM',
      description: 'ক্যালকুলাস ও সমাকলন সমস্যা সমাধান'
    },
    {
      id: 3,
      name: 'Chemistry Lab Discussion',
      subject: 'রসায়ন',
      class: 'Class 10',
      members: 28,
      maxMembers: 35,
      nextSession: 'রবিবার ৬ PM',
      description: 'জৈব রসায়ন ও বিক্রিয়া নিয়ে আলোচনা'
    }
  ];

  const handleJoinGroup = (groupId: number) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
      toast({
        title: "গ্রুপ ছেড়ে দেওয়া হয়েছে",
        description: "আপনি এই স্টাডি গ্রুপ ছেড়ে দিয়েছেন",
      });
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
      toast({
        title: "গ্রুপে যোগদান সফল!",
        description: "আপনি সফলভাবে স্টাডি গ্রুপে যোগ দিয়েছেন",
      });
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-400" />
            স্টাডি গ্রুপ
          </CardTitle>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="mr-1 h-3 w-3" />
            নতুন গ্রুপ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {studyGroups.map((group) => (
          <div
            key={group.id}
            className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-medium mb-1">{group.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{group.description}</p>
              </div>
              <Button
                size="sm"
                variant={joinedGroups.includes(group.id) ? "outline" : "default"}
                onClick={() => handleJoinGroup(group.id)}
                className={joinedGroups.includes(group.id) 
                  ? "bg-red-600/20 border-red-600 text-red-300 hover:bg-red-600/30" 
                  : "bg-green-600 hover:bg-green-700"
                }
              >
                {joinedGroups.includes(group.id) ? (
                  <>ছেড়ে দিন</>
                ) : (
                  <>
                    <UserPlus className="mr-1 h-3 w-3" />
                    যোগ দিন
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-blue-300 border-blue-600/30 text-xs">
                {group.class}
              </Badge>
              <Badge variant="outline" className="text-green-300 border-green-600/30 text-xs">
                {group.subject}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {group.members}/{group.maxMembers}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {group.nextSession}
                </span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                অ্যাক্টিভ
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudyGroups;
