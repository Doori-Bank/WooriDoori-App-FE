import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type?: 'report' | 'diary' | 'goal' | 'achievement' | 'general' | 'warning' | 'alert';
  actionUrl?: string;
  month?: number; // 리포트용: 몇 월 리포트인지
  createdAt: Date | string;
  isRead?: boolean; // 읽음 상태
}

interface NotificationStore {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'createdAt' | 'isRead'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  loadNotifications: () => void;
  saveNotifications: () => void;
}

const STORAGE_KEY = 'wooridoori_notifications';

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (notification) => {
        const newNotification: NotificationData = {
          ...notification,
          id: `notification-${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
        // persist가 자동으로 로컬 스토리지에 저장함
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((noti) => noti.id !== id),
        }));
        // persist가 자동으로 로컬 스토리지에 저장함
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((noti) =>
            noti.id === id ? { ...noti, isRead: true } : noti
          ),
        }));
        // persist가 자동으로 로컬 스토리지에 저장함
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((noti) => ({ ...noti, isRead: true })),
        }));
        // persist가 자동으로 로컬 스토리지에 저장함
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
        // persist가 자동으로 로컬 스토리지에 저장함
      },

      loadNotifications: () => {
        // persist가 자동으로 로컬 스토리지에서 로드함
        // 이 함수는 호환성을 위해 남겨둠
      },

      saveNotifications: () => {
        // persist가 자동으로 로컬 스토리지에 저장함
        // 이 함수는 호환성을 위해 남겨둠
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);

