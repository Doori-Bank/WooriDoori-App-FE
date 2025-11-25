import { useEffect } from "react";
import Router from "./router/Router";
import { useNotification } from "./hooks/useNotification";
import { useUserStore } from "./stores/useUserStore";
import { useCookieManager } from "./hooks/useCookieManager";
import * as amplitude from "@amplitude/analytics-browser";
import { Identify } from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

function App() {
  // SSE 알림 연결 및 처리
  useNotification();
  
  const { initializeFromLocalStorage, userInfo } = useUserStore();
  const { getCookies } = useCookieManager();

  // Amplitude 초기화
  useEffect(() => {
    const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY || 'f176d0f2dfbc332b7bc1515426bc31b5';
    
    // 세션 리플레이 플러그인 추가
    amplitude.add(sessionReplayPlugin());
    
    // Amplitude 초기화
    amplitude.init(apiKey, {
      autocapture: {
        attribution: true,
        fileDownloads: true,
        formInteractions: true,
        pageViews: true,
        sessions: true,
        elementInteractions: true,
        networkTracking: true,
        webVitals: true,
        frustrationInteractions: true,
      },
    });
  }, []);

  // 사용자 정보가 변경되면 Amplitude에 사용자 정보 설정
  useEffect(() => {
    if (userInfo) {
      amplitude.setUserId(userInfo.memberId || userInfo.email || userInfo.name);
      const identify = new Identify();
      identify.set('name', userInfo.name);
      if (userInfo.email) {
        identify.set('email', userInfo.email);
      }
      amplitude.identify(identify);
    }
  }, [userInfo]);

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
