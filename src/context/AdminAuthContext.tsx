import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const auth = localStorage.getItem('admin_auth');
    const accessToken = localStorage.getItem('admin_accessToken');
    if (auth === 'true' && accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 실제 환경에서는 API 호출로 대체
      // 여기서는 간단한 예시로 관리자 계정만 허용
      if (username === 'admin' && password === 'admin') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_accessToken', 'admin_token_' + Date.now());
        return true;
      }
      return false;
    } catch (error) {
      console.error('관리자 로그인 에러:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_accessToken');
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

