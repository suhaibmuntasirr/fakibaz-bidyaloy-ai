
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
  chatRoomId: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'like' | 'comment' | 'download' | 'achievement' | 'system';
  userId: string;
  read: boolean;
  timestamp: Date;
  data?: any;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  subject: string;
  class: string;
  createdBy: string;
  participants: string[];
  isActive: boolean;
  createdAt: Date;
  maxParticipants: number;
}

class RealtimeService {
  // Chat functionality
  subscribeToChat(chatRoomId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, 'chatMessages'),
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      } as ChatMessage));
      callback(messages);
    });
  }

  async sendMessage(chatRoomId: string, text: string, userId: string, userName: string): Promise<void> {
    try {
      await addDoc(collection(db, 'chatMessages'), {
        text,
        userId,
        userName,
        chatRoomId,
        type: 'text',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Notifications
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      } as Notification));
      callback(notifications);
    });
  }

  async createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Study Rooms
  subscribeToStudyRooms(callback: (rooms: StudyRoom[]) => void) {
    const q = query(
      collection(db, 'studyRooms'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as StudyRoom));
      callback(rooms);
    });
  }

  async createStudyRoom(room: Omit<StudyRoom, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'studyRooms'), {
        ...room,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating study room:', error);
      throw error;
    }
  }

  // Live presence tracking
  subscribeToOnlineUsers(callback: (userIds: string[]) => void) {
    const q = query(
      collection(db, 'presence'),
      where('isOnline', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
      const userIds = snapshot.docs.map(doc => doc.data().userId);
      callback(userIds);
    });
  }
}

export const realtimeService = new RealtimeService();
