import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface Achievement {
  id: string;
  title: string;
  reward: string;
}

interface Notification extends Achievement {
  // Potencialmente se pueden añadir más tipos de notificaciones aquí
}

interface NotificationContextType {
  notifications: Notification[];
  addAchievementNotification: (achievement: Omit<Achievement, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addAchievementNotification = useCallback((achievement: Omit<Achievement, 'id'>) => {
    const newNotification: Notification = {
      ...achievement,
      id: new Date().toISOString(), // ID único para la notificación
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-cierre después de 5 segundos
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addAchievementNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
