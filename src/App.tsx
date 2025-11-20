import { useEffect } from "react";
import Router from "./router/Router";
import { useNotification } from "./hooks/useNotification";
import { useUserStore } from "./stores/useUserStore";
import { useCookieManager } from "./hooks/useCookieManager";

function App() {
  // SSE 알림 연결 및 처리
  useNotification();
  
  const { initializeFromLocalStorage } = useUserStore();
  const { getCookies } = useCookieManager();

  // 앱 시작 시 기존 localStorage에서 사용자 정보 마이그레이션
  useEffect(() => {
    const { accessToken } = getCookies();
    // 쿠키가 있으면 사용자 정보 복원 시도
    if (accessToken) {
      initializeFromLocalStorage();
    }
  }, []);

  return (
    <div className="app-shell">
      <div className="app-scroll-area">
        <Router />
      </div>
    </div>
  );
}

export default App;
