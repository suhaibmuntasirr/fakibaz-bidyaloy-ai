
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications, useOnlineUsers } from '@/hooks/useRealtime';
import { useAuth } from './AuthContext';

interface RealtimeContextType {
  notifications: any[];
  unreadCount: number;
  onlineUsers: string[];
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications(user?.uid || '');
  const onlineUsers = useOnlineUsers();

  return (
    <RealtimeContext.Provider value={{
      notifications,
      unreadCount,
      onlineUsers
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
