import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin } from '@/lib/adminApi';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 초기 상태를 localStorage에서 확인
  const getInitialAuthState = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const auth = localStorage.getItem('admin_auth');
    const accessToken = localStorage.getItem('admin_accessToken');
    const authority = localStorage.getItem('admin_authority');
    
    // ADMIN 권한이 있는 경우에만 인증 상태로 설정
    return auth === 'true' && !!accessToken && authority === 'ADMIN';
  };

  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const auth = localStorage.getItem('admin_auth');
    const accessToken = localStorage.getItem('admin_accessToken');
    const authority = localStorage.getItem('admin_authority');
    
    // ADMIN 권한이 있는 경우에만 인증 상태로 설정
    if (auth === 'true' && accessToken && authority === 'ADMIN') {
      setIsAuthenticated(true);
    } else {
      // 권한이 없거나 ADMIN이 아니면 인증 상태만 false로 설정
      // localStorage는 로그아웃 시에만 정리
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await adminLogin(email, password);

      if (result.success && result.data?.accessToken) {
        // authority가 ADMIN인지 확인
        if (result.data.authority !== 'ADMIN') {
          return {
            success: false,
            error: '관리자 권한이 없습니다. ADMIN 권한이 필요합니다.',
          };
        }

        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_accessToken', result.data.accessToken);
        localStorage.setItem('admin_authority', result.data.authority || 'ADMIN');
        
        if (result.data.refreshToken) {
          localStorage.setItem('admin_refreshToken', result.data.refreshToken);
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || '로그인에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('관리자 로그인 에러:', error);
      return {
        success: false,
        error: '로그인 중 오류가 발생했습니다.',
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_accessToken');
    localStorage.removeItem('admin_refreshToken');
    localStorage.removeItem('admin_authority');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

