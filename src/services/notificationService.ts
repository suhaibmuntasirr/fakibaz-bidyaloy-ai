
import { realtimeService } from './realtimeService';

export type NotificationType = 'like' | 'comment' | 'download' | 'achievement' | 'system' | 'payment';

export interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  data?: any;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.requestPermission();
  }

  async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
    return this.permission;
  }

  async sendNotification(notificationData: NotificationData): Promise<void> {
    try {
      // Store in database
      await realtimeService.createNotification({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        userId: notificationData.userId,
        read: false,
        data: notificationData.data
      });

      // Show browser notification if permission granted
      if (this.permission === 'granted') {
        new Notification(notificationData.title, {
          body: notificationData.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: notificationData.type,
          requireInteraction: false,
          silent: false
        });
      }

      // Send push notification (if service worker is registered)
      await this.sendPushNotification(notificationData);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  private async sendPushNotification(notificationData: NotificationData): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.pushManager) {
          // This would require FCM setup
          console.log('Push notification service available');
        }
      } catch (error) {
        console.error('Push notification error:', error);
      }
    }
  }

  // Predefined notification templates
  async notifyLike(likerName: string, contentTitle: string, contentOwnerId: string): Promise<void> {
    await this.sendNotification({
      title: 'নতুন লাইক! 👍',
      message: `${likerName} আপনার "${contentTitle}" কে লাইক দিয়েছেন`,
      type: 'like',
      userId: contentOwnerId,
      data: { likerName, contentTitle }
    });
  }

  async notifyComment(commenterName: string, contentTitle: string, contentOwnerId: string): Promise<void> {
    await this.sendNotification({
      title: 'নতুন মন্তব্য! 💬',
      message: `${commenterName} আপনার "${contentTitle}" এ মন্তব্য করেছেন`,
      type: 'comment',
      userId: contentOwnerId,
      data: { commenterName, contentTitle }
    });
  }

  async notifyDownload(downloaderName: string, contentTitle: string, contentOwnerId: string): Promise<void> {
    await this.sendNotification({
      title: 'নতুন ডাউনলোড! 📥',
      message: `${downloaderName} আপনার "${contentTitle}" ডাউনলোড করেছেন`,
      type: 'download',
      userId: contentOwnerId,
      data: { downloaderName, contentTitle }
    });
  }

  async notifyAchievement(userId: string, achievement: string): Promise<void> {
    await this.sendNotification({
      title: 'অভিনন্দন! 🎉',
      message: `আপনি "${achievement}" অর্জন করেছেন!`,
      type: 'achievement',
      userId,
      data: { achievement }
    });
  }

  async notifyPaymentSuccess(userId: string, planName: string): Promise<void> {
    await this.sendNotification({
      title: 'পেমেন্ট সফল! ✅',
      message: `আপনার ${planName} সাবস্ক্রিপশন সক্রিয় হয়েছে`,
      type: 'payment',
      userId,
      data: { planName }
    });
  }

  async notifySystemMessage(userId: string, message: string): Promise<void> {
    await this.sendNotification({
      title: 'সিস্টেম বার্তা 📢',
      message,
      type: 'system',
      userId,
      data: {}
    });
  }
}

export const notificationService = new NotificationService();
