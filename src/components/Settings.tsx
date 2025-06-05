
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Trash2,
  Save,
  Camera,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const Settings = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: userProfile?.fullName || 'আব্দুল করিম',
    phoneNumber: userProfile?.phoneNumber || '+880 1712-345678',
    email: currentUser?.email || 'abdulkarim@example.com',
    dateOfBirth: '১৫/০৮/২০০০',
    address: 'ঢাকা, বাংলাদেশ',
    institution: 'ঢাকা কলেজ',
    class: 'Class 12',
    profilePicture: ''
  });
  
  const [originalProfileData, setOriginalProfileData] = useState(profileData);
  
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      communityUpdates: true,
      newNotes: false,
      weeklyDigest: true,
      examReminders: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      allowMessages: true,
      showOnlineStatus: false,
      shareActivity: true
    },
    preferences: {
      darkMode: true,
      autoDownload: false,
      defaultClass: 'Class 12',
      defaultSubject: 'গণিত',
      language: 'বাংলা',
      fontSize: 'medium'
    },
    dataManagement: {
      backupEnabled: true,
      syncEnabled: true,
      autoDelete: false,
      deleteAfterDays: 30
    }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Ensure all required properties exist with fallbacks
        setSettings({
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            communityUpdates: true,
            newNotes: false,
            weeklyDigest: true,
            examReminders: true,
            ...parsedSettings.notifications
          },
          privacy: {
            profileVisible: true,
            showEmail: false,
            allowMessages: true,
            showOnlineStatus: false,
            shareActivity: true,
            ...parsedSettings.privacy
          },
          preferences: {
            darkMode: true,
            autoDownload: false,
            defaultClass: 'Class 12',
            defaultSubject: 'গণিত',
            language: 'বাংলা',
            fontSize: 'medium',
            ...parsedSettings.preferences
          },
          dataManagement: {
            backupEnabled: true,
            syncEnabled: true,
            autoDelete: false,
            deleteAfterDays: 30,
            ...parsedSettings.dataManagement
          }
        });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
    
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setProfileData(profile);
        setOriginalProfileData(profile);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditField = (field: string) => {
    setEditingField(field);
  };

  const handleSaveField = (field: string) => {
    setOriginalProfileData(prev => ({
      ...prev,
      [field]: profileData[field as keyof typeof profileData]
    }));
    setEditingField(null);
    toast({
      title: "আপডেট সম্পন্ন",
      description: "তথ্য সফলভাবে আপডেট হয়েছে"
    });
  };

  const handleCancelEdit = (field: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: originalProfileData[field as keyof typeof originalProfileData]
    }));
    setEditingField(null);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    
    // Auto-save notification settings
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    toast({
      title: value ? "চালু করা হয়েছে" : "বন্ধ করা হয়েছে",
      description: `নোটিফিকেশন সেটিং ${value ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
    
    // Auto-save privacy settings
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    toast({
      title: "গোপনীয়তা আপডেট",
      description: `গোপনীয়তা সেটিং ${value ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`
    });
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
    
    // Auto-save preference settings
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    toast({
      title: "পছন্দ আপডেট",
      description: "আপনার পছন্দ সফলভাবে আপডেট হয়েছে"
    });
  };

  const handleDataManagementChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      dataManagement: {
        ...prev.dataManagement,
        [key]: value
      }
    }));
    
    // Auto-save data management settings
    const newSettings = {
      ...settings,
      dataManagement: {
        ...settings.dataManagement,
        [key]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    toast({
      title: "ডেটা সেটিং আপডেট",
      description: "ডেটা ব্যবস্থাপনা সেটিং আপডেট হয়েছে"
    });
  };

  const handleSaveAllSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "সেটিংস সংরক্ষিত হয়েছে",
        description: "আপনার সমস্ত সেটিংস সফলভাবে আপডেট হয়েছে"
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
        localStorage.removeItem('likedNotes');
        localStorage.removeItem('noteComments');
        localStorage.removeItem('noteRatings');
        
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
      exportDate: new Date().toISOString(),
      metadata: {
        version: '1.0',
        platform: 'Note Bank'
      }
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `note-bank-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "ডেটা এক্সপোর্ট হয়েছে",
      description: "আপনার ডেটা সফলভাবে ডাউনলোড হয়েছে"
    });
  };

  const renderEditableField = (field: string, label: string, value: string, type: string = 'text') => {
    const isEditing = editingField === field;
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Label className="text-white">{label}</Label>
          {isEditing ? (
            <div className="flex items-center space-x-2 mt-1">
              <Input
                type={type}
                value={value}
                onChange={(e) => handleProfileChange(field, e.target.value)}
                className="bg-white/10 border-white/20 text-white flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleSaveField(field)}
                className="bg-green-600 hover:bg-green-700 px-2"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCancelEdit(field)}
                className="bg-red-600/20 border-red-600 text-red-300 hover:bg-red-600/30 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-300">{value}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditField(field)}
                className="text-blue-400 hover:bg-blue-500/20 px-2"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
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
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.profilePicture} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {profileData.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    ছবি পরিবর্তন করুন
                  </Button>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG ফাইল আপলোড করুন</p>
                </div>
              </div>

              {/* Editable Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderEditableField('fullName', 'পূর্ণ নাম', profileData.fullName)}
                {renderEditableField('email', 'ইমেইল', profileData.email, 'email')}
                {renderEditableField('phoneNumber', 'ফোন নম্বর', profileData.phoneNumber, 'tel')}
                {renderEditableField('dateOfBirth', 'জন্ম তারিখ', profileData.dateOfBirth)}
                {renderEditableField('address', 'ঠিকানা', profileData.address)}
                {renderEditableField('institution', 'শিক্ষা প্রতিষ্ঠান', profileData.institution)}
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
                  checked={settings.notifications?.emailNotifications || false}
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
                  checked={settings.notifications?.pushNotifications || false}
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
                  checked={settings.notifications?.communityUpdates || false}
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
                  checked={settings.notifications?.newNotes || false}
                  onCheckedChange={(value) => handleNotificationChange('newNotes', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">সাপ্তাহিক ডাইজেস্ট</Label>
                  <p className="text-gray-400 text-sm">সপ্তাহে একবার সব আপডেট একসাথে পান</p>
                </div>
                <Switch
                  checked={settings.notifications?.weeklyDigest || false}
                  onCheckedChange={(value) => handleNotificationChange('weeklyDigest', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">পরীক্ষার রিমাইন্ডার</Label>
                  <p className="text-gray-400 text-sm">পরীক্ষার আগে রিমাইন্ডার পান</p>
                </div>
                <Switch
                  checked={settings.notifications?.examReminders || false}
                  onCheckedChange={(value) => handleNotificationChange('examReminders', value)}
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
                  checked={settings.privacy?.profileVisible || false}
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
                  checked={settings.privacy?.showEmail || false}
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
                  checked={settings.privacy?.allowMessages || false}
                  onCheckedChange={(value) => handlePrivacyChange('allowMessages', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">অনলাইন স্ট্যাটাস দেখান</Label>
                  <p className="text-gray-400 text-sm">আপনি অনলাইনে আছেন কিনা অন্যরা দেখতে পাবে</p>
                </div>
                <Switch
                  checked={settings.privacy?.showOnlineStatus || false}
                  onCheckedChange={(value) => handlePrivacyChange('showOnlineStatus', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">কার্যকলাপ শেয়ার করুন</Label>
                  <p className="text-gray-400 text-sm">আপনার পড়াশোনার অগ্রগতি অন্যদের সাথে শেয়ার করুন</p>
                </div>
                <Switch
                  checked={settings.privacy?.shareActivity || false}
                  onCheckedChange={(value) => handlePrivacyChange('shareActivity', value)}
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
                  checked={settings.preferences?.darkMode || false}
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
                  checked={settings.preferences?.autoDownload || false}
                  onCheckedChange={(value) => handlePreferenceChange('autoDownload', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultClass" className="text-white">ডিফল্ট ক্লাস</Label>
                  <select
                    value={settings.preferences?.defaultClass || 'Class 12'}
                    onChange={(e) => handlePreferenceChange('defaultClass', e.target.value)}
                    className="w-full mt-1 bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="Class 6" className="bg-gray-800">Class 6</option>
                    <option value="Class 7" className="bg-gray-800">Class 7</option>
                    <option value="Class 8" className="bg-gray-800">Class 8</option>
                    <option value="Class 9" className="bg-gray-800">Class 9</option>
                    <option value="Class 10" className="bg-gray-800">Class 10</option>
                    <option value="Class 11" className="bg-gray-800">Class 11</option>
                    <option value="Class 12" className="bg-gray-800">Class 12</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="defaultSubject" className="text-white">ডিফল্ট বিষয়</Label>
                  <select
                    value={settings.preferences?.defaultSubject || 'গণিত'}
                    onChange={(e) => handlePreferenceChange('defaultSubject', e.target.value)}
                    className="w-full mt-1 bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="গণিত" className="bg-gray-800">গণিত</option>
                    <option value="পদার্থবিজ্ঞান" className="bg-gray-800">পদার্থবিজ্ঞান</option>
                    <option value="রসায়ন" className="bg-gray-800">রসায়ন</option>
                    <option value="জীববিজ্ঞান" className="bg-gray-800">জীববিজ্ঞান</option>
                    <option value="ইংরেজি" className="bg-gray-800">ইংরেজি</option>
                    <option value="বাংলা" className="bg-gray-800">বাংলা</option>
                  </select>
                </div>
              </div>
              <Separator className="bg-white/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">ভাষা</Label>
                  <select
                    value={settings.preferences?.language || 'বাংলা'}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full mt-1 bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="বাংলা" className="bg-gray-800">বাংলা</option>
                    <option value="English" className="bg-gray-800">English</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white">ফন্ট সাইজ</Label>
                  <select
                    value={settings.preferences?.fontSize || 'medium'}
                    onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                    className="w-full mt-1 bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="small" className="bg-gray-800">ছোট</option>
                    <option value="medium" className="bg-gray-800">মাঝারি</option>
                    <option value="large" className="bg-gray-800">বড়</option>
                  </select>
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
                  <Label className="text-white">স্বয়ংক্রিয় ব্যাকআপ</Label>
                  <p className="text-gray-400 text-sm">আপনার ডেটা স্বয়ংক্রিয়ভাবে ব্যাকআপ করুন</p>
                </div>
                <Switch
                  checked={settings.dataManagement?.backupEnabled || false}
                  onCheckedChange={(value) => handleDataManagementChange('backupEnabled', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">ক্লাউড সিঙ্ক</Label>
                  <p className="text-gray-400 text-sm">বিভিন্ন ডিভাইসে ডেটা সিঙ্ক করুন</p>
                </div>
                <Switch
                  checked={settings.dataManagement?.syncEnabled || false}
                  onCheckedChange={(value) => handleDataManagementChange('syncEnabled', value)}
                />
              </div>
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">স্বয়ংক্রিয় ডিলিট</Label>
                  <p className="text-gray-400 text-sm">পুরাতন ফাইল স্বয়ংক্রিয়ভাবে মুছে ফেলুন</p>
                </div>
                <Switch
                  checked={settings.dataManagement?.autoDelete || false}
                  onCheckedChange={(value) => handleDataManagementChange('autoDelete', value)}
                />
              </div>
              {settings.dataManagement?.autoDelete && (
                <div className="ml-6">
                  <Label className="text-white">কত দিন পর ডিলিট করবে</Label>
                  <select
                    value={settings.dataManagement?.deleteAfterDays || 30}
                    onChange={(e) => handleDataManagementChange('deleteAfterDays', parseInt(e.target.value))}
                    className="w-full mt-1 bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value={7} className="bg-gray-800">৭ দিন</option>
                    <option value={30} className="bg-gray-800">৩০ দিন</option>
                    <option value={90} className="bg-gray-800">৯০ দিন</option>
                    <option value={365} className="bg-gray-800">১ বছর</option>
                  </select>
                </div>
              )}
              <Separator className="bg-white/20" />
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
              <Separator className="bg-white/20" />
              <div className="space-y-2">
                <Label className="text-white">স্টোরেজ ব্যবহার</Label>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">নোট ও ডকুমেন্ট</span>
                    <span className="text-white">250 MB / 1 GB</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              onClick={handleSaveAllSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'সব সেটিংস সংরক্ষণ করুন'}
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
