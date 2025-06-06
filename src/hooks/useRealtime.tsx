
import { useState, useEffect } from 'react';
import { realtimeService, ChatMessage, Notification, StudyRoom } from '@/services/realtimeService';

export const useChat = (chatRoomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chatRoomId) return;

    const unsubscribe = realtimeService.subscribeToChat(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [chatRoomId]);

  const sendMessage = async (text: string, userId: string, userName: string) => {
    await realtimeService.sendMessage(chatRoomId, text, userId, userName);
  };

  return { messages, isLoading, sendMessage };
};

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = realtimeService.subscribeToNotifications(userId, (newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, [userId]);

  return { notifications, unreadCount };
};

export const useStudyRooms = () => {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToStudyRooms((newRooms) => {
      setRooms(newRooms);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const createRoom = async (room: Omit<StudyRoom, 'id' | 'createdAt'>) => {
    return await realtimeService.createStudyRoom(room);
  };

  return { rooms, isLoading, createRoom };
};

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToOnlineUsers(setOnlineUsers);
    return unsubscribe;
  }, []);

  return onlineUsers;
};
