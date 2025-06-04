
import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'note' | 'community' | 'system' | 'achievement' | 'comment';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(withDates);
      } catch (error) {
        console.error('Error parsing notifications:', error);
        // Initialize with sample notifications if parsing fails
        initializeSampleNotifications();
      }
    } else {
      // Initialize with sample notifications
      initializeSampleNotifications();
    }
  }, []);

  const initializeSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'নতুন নোট আপলোড',
        message: 'পদার্থবিজ্ঞান - নিউটনের সূত্র নিয়ে নতুন নোট আপলোড হয়েছে',
        type: 'note',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: '2',
        title: 'কমিউনিটি আপডেট',
        message: 'আপনার পোস্টে নতুন মন্তব্য এসেছে',
        type: 'community',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false
      },
      {
        id: '3',
        title: 'অভিনন্দন!',
        message: 'আপনি ১০০ দিন ধারাবাহিক লগইন করেছেন',
        type: 'achievement',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true
      }
    ];
    setNotifications(sampleNotifications);
  };

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    notifications,
    isOpen,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    togglePanel,
    closePanel
  };
};
