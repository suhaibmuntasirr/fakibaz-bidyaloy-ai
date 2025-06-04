
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Link2, Users, MessageCircle, Video, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyGroup {
  id: string;
  name: string;
  platform: 'whatsapp' | 'discord' | 'messenger' | 'meet';
  link: string;
  members: number;
  subject: string;
  class: string;
  createdBy: string;
  createdAt: Date;
}

const StudyGroupManager = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'HSC পদার্থবিজ্ঞান গ্রুপ',
      platform: 'whatsapp',
      link: 'https://chat.whatsapp.com/example1',
      members: 45,
      subject: 'পদার্থবিজ্ঞান',
      class: 'HSC',
      createdBy: 'রফিক স্যার',
      createdAt: new Date('2023-11-01')
    },
    {
      id: '2',
      name: 'গণিত সলভার্স ডিসকর্ড',
      platform: 'discord',
      link: 'https://discord.gg/example2',
      members: 78,
      subject: 'গণিত',
      class: 'SSC',
      createdBy: 'সালমা ম্যাম',
      createdAt: new Date('2023-10-15')
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    platform: 'whatsapp' as const,
    link: '',
    subject: '',
    class: ''
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return '📱';
      case 'discord': return '🎮';
      case 'messenger': return '💬';
      case 'meet': return '📹';
      default: return '🔗';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'discord': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'messenger': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'meet': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.link || !newGroup.subject || !newGroup.class) {
      toast({
        title: "সব তথ্য পূরণ করুন",
        description: "অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন",
        variant: "destructive"
      });
      return;
    }

    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      platform: newGroup.platform,
      link: newGroup.link,
      members: 1,
      subject: newGroup.subject,
      class: newGroup.class,
      createdBy: 'আপনি',
      createdAt: new Date()
    };

    setGroups(prev => [group, ...prev]);
    setNewGroup({ name: '', platform: 'whatsapp', link: '', subject: '', class: '' });
    setShowAddForm(false);

    toast({
      title: "গ্রুপ যোগ করা হয়েছে",
      description: "নতুন স্টাডি গ্রুপ সফলভাবে যোগ করা হয়েছে"
    });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "লিংক কপি হয়েছে",
        description: "গ্রুপের লিংক ক্লিপবোর্ডে কপি করা হয়েছে"
      });
    });
  };

  const handleJoinGroup = (group: StudyGroup) => {
    setGroups(prev => prev.map(g => 
      g.id === group.id 
        ? { ...g, members: g.members + 1 }
        : g
    ));

    window.open(group.link, '_blank');
    
    toast({
      title: "গ্রুপে যোগদান",
      description: `${group.name} গ্রুপে যোগ দিচ্ছেন...`
    });
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="mr-2 h-5 w-5" />
            স্টাডি গ্রুপ লিংক
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-1 h-4 w-4" />
            গ্রুপ যোগ করুন
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 bg-black/30 rounded-lg border border-white/10 space-y-3">
            <h4 className="text-white font-medium">নতুন স্টাডি গ্রুপ যোগ করুন</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="গ্রুপের নাম"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <select
                value={newGroup.platform}
                onChange={(e) => setNewGroup(prev => ({ ...prev, platform: e.target.value as any }))}
                className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="discord">Discord</option>
                <option value="messenger">Messenger</option>
                <option value="meet">Google Meet</option>
              </select>
            </div>

            <Input
              placeholder="গ্রুপের লিংক"
              value={newGroup.link}
              onChange={(e) => setNewGroup(prev => ({ ...prev, link: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="বিষয়"
                value={newGroup.subject}
                onChange={(e) => setNewGroup(prev => ({ ...prev, subject: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="ক্লাস"
                value={newGroup.class}
                onChange={(e) => setNewGroup(prev => ({ ...prev, class: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddGroup} size="sm" className="bg-green-600 hover:bg-green-700">
                যোগ করুন
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline" 
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                বাতিল
              </Button>
            </div>
          </div>
        )}

        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-white font-medium flex items-center">
                  <span className="mr-2">{getPlatformIcon(group.platform)}</span>
                  {group.name}
                </h4>
                <p className="text-gray-400 text-sm">তৈরি করেছেন: {group.createdBy}</p>
              </div>
              <Badge className={`${getPlatformColor(group.platform)} text-xs`}>
                {group.platform.toUpperCase()}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-blue-300 border-blue-600/30 text-xs">
                {group.class}
              </Badge>
              <Badge variant="outline" className="text-green-300 border-green-600/30 text-xs">
                {group.subject}
              </Badge>
              <Badge variant="outline" className="text-purple-300 border-purple-600/30 text-xs">
                {group.members} সদস্য
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleJoinGroup(group)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                যোগ দিন
              </Button>
              <Button
                onClick={() => handleCopyLink(group.link)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>কোনো স্টাডি গ্রুপ নেই</p>
            <p className="text-sm">প্রথম গ্রুপ যোগ করুন!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyGroupManager;
