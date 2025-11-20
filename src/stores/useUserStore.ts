import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  name: string;
  memberId?: string;
  email?: string;
}

interface UserStore {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
  initializeFromLocalStorage: () => void;
}

// 기존 localStorage의 userInfo를 마이그레이션하는 함수
const migrateFromOldStorage = (): UserInfo | null => {
  try {
    const oldUserInfo = localStorage.getItem('userInfo');
    if (oldUserInfo) {
      const user = JSON.parse(oldUserInfo);
      if (user.name) {
        return {
          name: user.name,
          memberId: user.memberId || user.email,
          email: user.email,
        };
      }
    }
  } catch (error) {
    console.error('기존 사용자 정보 마이그레이션 실패:', error);
  }
  return null;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      isLoggedIn: false,

      setUserInfo: (userInfo) => {
        set({
          userInfo,
          isLoggedIn: true,
        });
      },

      clearUserInfo: () => {
        set({
          userInfo: null,
          isLoggedIn: false,
        });
      },

      initializeFromLocalStorage: () => {
        const state = get();
        // store에 사용자 정보가 없고, 쿠키가 있으면 기존 localStorage에서 마이그레이션
        if (!state.userInfo && !state.isLoggedIn) {
          const migratedUser = migrateFromOldStorage();
          if (migratedUser) {
            set({
              userInfo: migratedUser,
              isLoggedIn: true,
            });
          }
        }
      },
    }),
    {
      name: 'wooridoori_user', // localStorage key
      onRehydrateStorage: () => {
        return (state) => {
          // store 복원 후 마이그레이션 체크
          if (state && !state.userInfo && !state.isLoggedIn) {
            const migratedUser = migrateFromOldStorage();
            if (migratedUser) {
              state.setUserInfo(migratedUser);
            }
          }
        };
      },
    }
  )
);

