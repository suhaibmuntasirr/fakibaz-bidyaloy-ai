
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, Plus } from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  class: string;
  members: number;
  maxMembers: number;
  nextSession: string;
  description: string;
  isActive: boolean;
}

const StudyGroups = () => {
  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'HSC গণিত মাস্টার গ্রুপ',
      subject: 'গণিত',
      class: 'Class 12',
      members: 45,
      maxMembers: 50,
      nextSession: '২০২৫-০১-০২ ৮:০০ PM',
      description: 'ক্যালকুলাস এবং অ্যালজেব্রা নিয়ে আলোচনা',
      isActive: true
    },
    {
      id: '2',
      name: 'SSC বিজ্ঞান স্টাডি সার্কেল',
      subject: 'বিজ্ঞান',
      class: 'Class 10',
      members: 38,
      maxMembers: 40,
      nextSession: '২০২৫-০১-০৩ ৭:৩০ PM',
      description: 'পদার্থবিজ্ঞান এবং রসায়নের মূল বিষয়সমূহ',
      isActive: true
    },
    {
      id: '3',
      name: 'ইংরেজি কনভার্সেশন ক্লাব',
      subject: 'English',
      class: 'Class 11',
      members: 25,
      maxMembers: 30,
      nextSession: '২০২৫-০১-০৪ ৬:০০ PM',
      description: 'কথোপকথন এবং রচনা দক্ষতা উন্নয়ন',
      isActive: true
    }
  ];

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
    // Implement join group functionality
  };

  const handleCreateGroup = () => {
    console.log('Creating new study group');
    // Implement create group functionality
  };

  return (
    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="mr-2 h-5 w-5 text-purple-400" />
            স্টাডি গ্রুপ
          </CardTitle>
          <Button
            size="sm"
            onClick={handleCreateGroup}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            নতুন গ্রুপ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {studyGroups.map((group) => (
          <div
            key={group.id}
            className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{group.name}</h4>
                <p className="text-gray-400 text-sm mb-2">{group.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 text-xs">
                    {group.class}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300 text-xs">
                    {group.subject}
                  </Badge>
                  {group.isActive && (
                    <Badge variant="secondary" className="bg-green-600/20 text-green-400 text-xs">
                      সক্রিয়
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {group.members}/{group.maxMembers}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {group.nextSession}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="w-full bg-gray-700 rounded-full h-2 mr-3">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                ></div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleJoinGroup(group.id)}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 whitespace-nowrap"
                disabled={group.members >= group.maxMembers}
              >
                {group.members >= group.maxMembers ? 'পূর্ণ' : 'যোগ দিন'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudyGroups;
