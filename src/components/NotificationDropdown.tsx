
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

const NotificationDropdown = () => {
  const {
    notifications,
    isOpen,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    togglePanel,
    closePanel
  } = useNotifications();

  // Add sample notifications when component mounts
  useEffect(() => {
    // Add initial notifications if none exist
    if (notifications.length === 0) {
      setTimeout(() => {
        addNotification({
          title: 'স্বাগতম!',
          message: 'Fakibaz-এ আপনাকে স্বাগতম! নতুন নোট এবং আপডেট পেতে নোটিফিকেশন চালু রাখুন।',
          type: 'system'
        });
      }, 2000);

      setTimeout(() => {
        addNotification({
          title: 'নতুন নোট',
          message: 'HSC পদার্থবিজ্ঞানের নতুন নোট আপলোড হয়েছে',
          type: 'note',
          actionUrl: '/notes?subject=physics'
        });
      }, 5000);
    }
  }, [addNotification, notifications.length]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          title: 'নতুন কমেন্ট',
          message: 'আপনার পোস্টে নতুন কমেন্ট এসেছে',
          type: 'comment' as const,
          actionUrl: '/community'
        },
        {
          title: 'নতুন লাইক',
          message: 'আপনার নোটে নতুন লাইক এসেছে',
          type: 'note' as const,
          actionUrl: '/notes'
        },
        {
          title: 'কমিউনিটি আপডেট',
          message: 'নতুন সদস্য যোগ দিয়েছে',
          type: 'community' as const,
          actionUrl: '/community'
        }
      ];

      // Randomly add notification (20% chance every 30 seconds)
      if (Math.random() < 0.2) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePanel}
          className="text-white hover:bg-white/10 relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </div>
      
      <NotificationPanel
        isOpen={isOpen}
        onClose={closePanel}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
      />
    </>
  );
};

export default NotificationDropdown;
