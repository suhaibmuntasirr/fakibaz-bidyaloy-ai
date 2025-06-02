
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Clock, BookOpen, Plus, UserPlus, MessageCircle, Calendar, Video, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudyGroups = () => {
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('');
  const [studyGroups, setStudyGroups] = useState([
    {
      id: 1,
      name: 'HSC Physics Study Circle',
      subject: 'পদার্থবিজ্ঞান',
      class: 'Class 12',
      members: 45,
      maxMembers: 50,
      nextSession: '২ ঘন্টা পরে',
      description: 'নিউটনের সূত্র ও গতিবিদ্যা নিয়ে আলোচনা',
      isLive: false
    },
    {
      id: 2,
      name: 'Math Problem Solvers',
      subject: 'গণিত',
      class: 'Class 11',
      members: 32,
      maxMembers: 40,
      nextSession: 'আগামীকাল ৮ PM',
      description: 'ক্যালকুলাস ও সমাকলন সমস্যা সমাধান',
      isLive: true
    },
    {
      id: 3,
      name: 'Chemistry Lab Discussion',
      subject: 'রসায়ন',
      class: 'Class 10',
      members: 28,
      maxMembers: 35,
      nextSession: 'রবিবার ৬ PM',
      description: 'জৈব রসায়ন ও বিক্রিয়া নিয়ে আলোচনা',
      isLive: false
    }
  ]);
  const { toast } = useToast();

  const handleJoinGroup = (groupId: number) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (!group) return;

    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
      setStudyGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, members: g.members - 1 } : g
      ));
      toast({
        title: "গ্রুপ ছেড়ে দেওয়া হয়েছে",
        description: `আপনি "${group.name}" গ্রুপ ছেড়ে দিয়েছেন`,
      });
    } else {
      if (group.members >= group.maxMembers) {
        toast({
          title: "গ্রুপ ভর্তি",
          description: "এই গ্রুপে আর জায়গা নেই",
          variant: "destructive"
        });
        return;
      }
      setJoinedGroups([...joinedGroups, groupId]);
      setStudyGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, members: g.members + 1 } : g
      ));
      toast({
        title: "গ্রুপে যোগদান সফল!",
        description: `আপনি "${group.name}" গ্রুপে যোগ দিয়েছেন`,
      });
    }
  };

  const handleJoinMeeting = (group: any) => {
    if (!joinedGroups.includes(group.id)) {
      toast({
        title: "প্রবেশাধিকার নেই",
        description: "মিটিং এ যোগ দিতে প্রথমে গ্রুপে যোগ দিন",
        variant: "destructive"
      });
      return;
    }
    window.open('https://meet.google.com', '_blank');
    toast({
      title: "Google Meet খোলা হচ্ছে",
      description: `"${group.name}" এর জন্য Google Meet খোলা হচ্ছে`,
    });
  };

  const openGoogleMeet = () => {
    window.open('https://meet.google.com', '_blank');
    toast({
      title: "Google Meet খোলা হচ্ছে",
      description: "নতুন মিটিং তৈরি করতে Google Meet এ যাচ্ছেন",
    });
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() && newGroupSubject.trim()) {
      const newGroup = {
        id: studyGroups.length + 1,
        name: newGroupName,
        subject: newGroupSubject,
        class: 'Class 11',
        members: 1,
        maxMembers: 30,
        nextSession: 'আজ রাত ৯ PM',
        description: 'নতুন স্টাডি গ্রুপ',
        isLive: false
      };
      setStudyGroups([...studyGroups, newGroup]);
      setJoinedGroups([...joinedGroups, newGroup.id]);
      setNewGroupName('');
      setNewGroupSubject('');
      setShowCreateDialog(false);
      toast({
        title: "নতুন গ্রুপ তৈরি হয়েছে",
        description: `"${newGroupName}" গ্রুপ সফলভাবে তৈরি করা হয়েছে`,
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
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-1 h-3 w-3" />
                নতুন গ্রুপ
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#28282B] border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">নতুন স্টাডি গ্রুপ তৈরি করুন</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="গ্রুপের নাম"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="বিষয়"
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                  className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                />
                <div className="space-y-2">
                  <Button 
                    onClick={openGoogleMeet}
                    variant="outline"
                    className="w-full bg-black/30 border-white/20 text-white hover:bg-white/10"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Meet তৈরি করুন
                  </Button>
                </div>
                <Button 
                  onClick={handleCreateGroup}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  গ্রুপ তৈরি করুন
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {studyGroups.map((group) => (
          <div
            key={group.id}
            className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium">{group.name}</h3>
                  {group.isLive && (
                    <Badge className="bg-red-600/20 text-red-300 border-red-600/30 text-xs">
                      🔴 লাইভ
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2">{group.description}</p>
              </div>
              <div className="flex flex-col gap-2">
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
                
                {joinedGroups.includes(group.id) && (
                  <Button
                    size="sm"
                    onClick={() => handleJoinMeeting(group)}
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    <Video className="mr-1 h-3 w-3" />
                    মিটিং
                  </Button>
                )}
              </div>
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
              <div className="flex items-center space-x-2">
                <span className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  চ্যাট
                </span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  সময়সূচী
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudyGroups;
