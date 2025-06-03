
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Trash2,
  Save 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const Settings = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setSaving] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: userProfile?.fullName || '',
    phoneNumber: userProfile?.phoneNumber || '',
    email: currentUser?.email || ''
  });
  
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      communityUpdates: true,
      newNotes: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      allowMessages: true
    },
    preferences: {
      darkMode: true,
      autoDownload: false,
      defaultClass: '',
      defaultSubject: ''
    }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in real app, this would be saved to backend)
      localStorage.setItem('userSettings', JSON.stringify(settings));
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "সেটিংস সংরক্ষিত হয়েছে",
        description: "আপনার সেটিংস সফলভাবে আপডেট হয়েছে"
      });
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "সেটিংস সংরক্ষণে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট ডিলিট করতে চান? এই কাজটি ফিরিয়ে আনা যাবে না।')) {
      try {
        // Clear all stored data
        localStorage.removeItem('userSettings');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('notifications');
        
        toast({
          title: "অ্যাকাউন্ট ডিলিট হয়েছে",
          description: "আপনার অ্যাকাউন্ট সফলভাবে ডিলিট হয়েছে"
        });
        await logout();
      } catch (error) {
        toast({
          title: "ত্রুটি",
          description: "অ্যাকাউন্ট ডিলিট করতে সমস্যা হয়েছে",
          variant: "destructive"
        });
      }
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: profileData,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'my-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "ডেটা এক্সপোর্ট হয়েছে",
      description: "আপনার ডেটা সফলভাবে ডাউনলোড হয়েছে"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <SettingsIcon className="mr-3 h-8 w-8" />
              সেটিংস
            </h1>
            <p className="text-gray-300">আপনার অ্যাকাউন্ট এবং পছন্দ পরিচালনা করুন</p>
          </div>

          {/* Profile Information */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="mr-2 h-5 w-5" />
                প্রোফাইল তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-white">পূর্ণ নাম</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">ইমেইল</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className="bg-white/5 border-white/20 text-gray-400"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">ফোন নম্বর</Label>
                <Input
                  id="phone"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="আপনার ফোন নম্বর লিখুন"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                নোটিফিকেশন সেটিংস
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">ইমেইল নোটিফিকেশন</Label>
                  <p className="text-gray-400 text-sm">নতুন আপডেট এবং বার্তার জন্য ইমেইল পান</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">পুশ নোটিফিকেশন</Label>
                  <p className="text-gray-400 text-sm">ব্রাউজারে তাৎক্ষণিক নোটিফিকেশন পান</p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">কমিউনিটি আপডেট</Label>
                  <p className="text-gray-400 text-sm">কমিউনিটির নতুন খবর এবং ইভেন্ট</p>
                </div>
                <Switch
                  checked={settings.notifications.communityUpdates}
                  onCheckedChange={(value) => handleNotificationChange('communityUpdates', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">নতুন নোট আলার্ট</Label>
                  <p className="text-gray-400 text-sm">আপনার ক্লাসের নতুন নোট আপলোড হলে জানান</p>
                </div>
                <Switch
                  checked={settings.notifications.newNotes}
                  onCheckedChange={(value) => handleNotificationChange('newNotes', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                গোপনীয়তা সেটিংস
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">প্রোফাইল দৃশ্যমান</Label>
                  <p className="text-gray-400 text-sm">অন্যরা আপনার প্রোফাইল দেখতে পাবে</p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(value) => handlePrivacyChange('profileVisible', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">ইমেইল দেখান</Label>
                  <p className="text-gray-400 text-sm">আপনার ইমেইল ঠিকানা প্রোফাইলে দেখাবে</p>
                </div>
                <Switch
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">বার্তা গ্রহণ করুন</Label>
                  <p className="text-gray-400 text-sm">অন্য ব্যবহারকারীরা আপনাকে বার্তা পাঠাতে পারবে</p>
                </div>
                <Switch
                  checked={settings.privacy.allowMessages}
                  onCheckedChange={(value) => handlePrivacyChange('allowMessages', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                অ্যাপ পছন্দ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">ডার্ক মোড</Label>
                  <p className="text-gray-400 text-sm">গাঢ় থিম ব্যবহার করুন</p>
                </div>
                <Switch
                  checked={settings.preferences.darkMode}
                  onCheckedChange={(value) => handlePreferenceChange('darkMode', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">অটো ডাউনলোড</Label>
                  <p className="text-gray-400 text-sm">নোট ক্লিক করলে সরাসরি ডাউনলোড হবে</p>
                </div>
                <Switch
                  checked={settings.preferences.autoDownload}
                  onCheckedChange={(value) => handlePreferenceChange('autoDownload', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultClass" className="text-white">ডিফল্ট ক্লাস</Label>
                  <Input
                    id="defaultClass"
                    placeholder="যেমন: Class 10"
                    value={settings.preferences.defaultClass}
                    onChange={(e) => handlePreferenceChange('defaultClass', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="defaultSubject" className="text-white">ডিফল্ট বিষয়</Label>
                  <Input
                    id="defaultSubject"
                    placeholder="যেমন: গণিত"
                    value={settings.preferences.defaultSubject}
                    onChange={(e) => handlePreferenceChange('defaultSubject', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Download className="mr-2 h-5 w-5" />
                ডেটা ব্যবস্থাপনা
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">আপনার ডেটা এক্সপোর্ট করুন</Label>
                  <p className="text-gray-400 text-sm">আপনার সেটিংস এবং ডেটা ডাউনলোড করুন</p>
                </div>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30"
                >
                  <Download className="mr-2 h-4 w-4" />
                  এক্সপোর্ট
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              অ্যাকাউন্ট ডিলিট করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
