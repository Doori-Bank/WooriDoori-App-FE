import React from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import DefaultDiv from './default/DefaultDiv';

const App: React.FC = () => {
  const { isDark, toggleDarkMode } = useThemeStore();

  return (
   <DefaultDiv>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">다크 모드 예제</h1>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {isDark ? '라이트 모드' : '다크 모드'}
        </button>
      </header>

      <main className="p-4">
        <p>
          지금은 {isDark ? '다크 모드' : '라이트 모드'} 입니다.
        </p>
      </main>
    </DefaultDiv>
  );
};

export default App;
