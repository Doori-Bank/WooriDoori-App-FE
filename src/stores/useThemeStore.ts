import { useEffect, useState } from 'react';

export const useThemeStore = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  }); // 다크모드 여부 확인

  useEffect(() => {
    // 다크 여부에 따른 dark class 추가  *tailwind dark:{} 사용시 필수
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev); // 다크 모드 적용 함수

  return { isDark, toggleDarkMode };
};
