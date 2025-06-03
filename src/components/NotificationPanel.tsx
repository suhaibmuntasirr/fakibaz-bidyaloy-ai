
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, Trash2, BookOpen, Users, Star, Settings, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'note' | 'community' | 'system' | 'achievement' | 'comment';
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode;
  actionUrl?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  // Generate sample notifications on component mount
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'নতুন নোট আপলোড',
        message: 'HSC পদার্থবিজ্ঞান চ্যাপটার ৩-এর নতুন নোট আপলোড হয়েছে',
        type: 'note',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionUrl: '/notes?class=hsc&subject=physics'
      },
      {
        id: '2',
        title: 'কমিউনিটি পোস্ট',
        message: 'আপনার পোস্টে ১৫টি নতুন লাইক এসেছে',
        type: 'community',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionUrl: '/community'
      },
      {
        id: '3',
        title: 'নতুন কমেন্ট',
        message: 'আপনার "গণিত সমাধান" পোস্টে নতুন কমেন্ট এসেছে',
        type: 'comment',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        actionUrl: '/community'
      },
      {
        id: '4',
        title: 'অভিনন্দন!',
        message: 'আপনি "সক্রিয় অবদানকারী" ব্যাজ অর্জন করেছেন',
        type: 'achievement',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true
      },
      {
        id: '5',
        title: 'সিস্টেম আপডেট',
        message: 'নতুন ফিচার যোগ করা হয়েছে! প্রশ্ন ব্যাংকে এখন স্কুল ফিল্টার রয়েছে',
        type: 'system',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: false
      }
    ];

    // Merge with passed notifications
    const mergedNotifications = [...notifications, ...sampleNotifications];
    setLocalNotifications(mergedNotifications);
  }, [notifications]);

  if (!isOpen) return null;

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'community':
        return <Users className="h-4 w-4 text-green-400" />;
      case 'achievement':
        return <Star className="h-4 w-4 text-yellow-400" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-purple-400" />;
      case 'system':
        return <Settings className="h-4 w-4 text-orange-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'community':
        return 'bg-green-500/20 border-green-500/30';
      case 'achievement':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'comment':
        return 'bg-purple-500/20 border-purple-500/30';
      case 'system':
        return 'bg-orange-500/20 border-orange-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'এখনই';
    if (minutes < 60) return `${minutes} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${days} দিন আগে`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-96 max-h-[80vh] bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg border-white/20 mt-16 mr-4">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              নোটিফিকেশন
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="bg-black/30 border-white/20 text-white hover:bg-white/10"
            >
              <Check className="mr-2 h-4 w-4" />
              সব পড়া হয়েছে চিহ্নিত করুন
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {localNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">কোনো নোটিফিকেশন নেই</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {localNotifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white/5 ${
                    notification.read 
                      ? 'bg-black/20 border-white/10' 
                      : `${getTypeColor(notification.type)} border-l-4`
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getNotificationIcon(notification.type)}
                        <h4 className="text-white font-medium ml-2 text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(notification.id);
                        }}
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
