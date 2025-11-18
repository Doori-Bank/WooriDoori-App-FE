import { useEffect } from 'react';
import { useCookieManager } from '@/hooks/useCookieManager';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { isNotificationEnabled } from '@/utils/notificationSettings';

/**
 * SSE 알림 연결 및 처리 커스텀 훅
 */
export const useNotification = () => {
  const { addNotification } = useNotificationStore();
  const { getCookies } = useCookieManager();

  useEffect(() => {
    // 알림 권한 요청
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // SSE 연결
    const { accessToken: token } = getCookies();
    if (!token) {
      console.log("토큰이 없어서 SSE 연결 안 함");
      return;
    }

    console.log("SSE 연결 시도...");
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/sse/connect`,
      {
        withCredentials: true,
      }
    );

    eventSource.onopen = () => {
      console.log("✅ SSE 연결 성공");
    };

    // 일반 메시지 이벤트
    eventSource.onmessage = (event) => {
      console.log("📨 SSE 메시지:", event.data);
      handleNotification("알림", event.data);
    };

    eventSource.addEventListener("connect", (event: MessageEvent) => {
      console.log("🔗 SSE 연결 이벤트:", event.data);
    });

    eventSource.addEventListener("message", (event: MessageEvent) => {
      console.log("📬 SSE 메시지 이벤트:", event.data);
      handleNotification("알림", event.data);
    });

    // 리포트 알림 이벤트 (소문자)
    eventSource.addEventListener("report", (event: MessageEvent) => {
      console.log("📊 리포트 알림:", event.data);
      try {
        const data = JSON.parse(event.data);
        const month = data.month || new Date().getMonth() + 1;
        handleNotification(
          data.title || "리포트 알림",
          data.message || event.data,
          "report",
          data.actionUrl || "/report",
          month
        );
      } catch {
        const month = new Date().getMonth() + 1;
        handleNotification("리포트 알림", event.data, "report", "/report", month);
      }
    });

    // REPORT 알림 이벤트 (대문자 - 백엔드 호환용, 소문자로 변환)
    eventSource.addEventListener("REPORT", (event: MessageEvent) => {
      console.log("📊 REPORT 알림:", event.data);
      try {
        const data = JSON.parse(event.data);
        const month = data.month || new Date().getMonth() + 1;
        handleNotification(
          data.title || "리포트 알림",
          data.message || event.data,
          "report",
          data.actionUrl || "/report",
          month
        );
      } catch {
        const month = new Date().getMonth() + 1;
        handleNotification("리포트 알림", event.data, "report", "/report", month);
      }
    });

    // 일기 알림 이벤트
    eventSource.addEventListener("diary", (event: MessageEvent) => {
      console.log("📔 일기 알림:", event.data);
      try {
        const data = JSON.parse(event.data);
        // 오늘 날짜로 일기 작성 페이지 URL 생성
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const defaultDiaryUrl = `/calendar/diary/emotion?date=${today}`;
        handleNotification(
          data.title || "일기 알림",
          data.message || event.data,
          "diary",
          data.actionUrl || defaultDiaryUrl
        );
      } catch {
        const today = new Date().toISOString().split('T')[0];
        handleNotification("일기 알림", event.data, "diary", `/calendar/diary/emotion?date=${today}`);
      }
    });

    // 목표 알림 이벤트
    eventSource.addEventListener("goal", (event: MessageEvent) => {
      console.log("🎯 목표 알림:", event.data);
      try {
        const data = JSON.parse(event.data);
        handleNotification(
          data.title || "목표 알림",
          data.message || event.data,
          "goal",
          data.actionUrl || "/goal/editGoal"
        );
      } catch {
        handleNotification("목표 알림", event.data, "goal", "/goal/editGoal");
      }
    });

    // 달성 알림 이벤트
    eventSource.addEventListener("achievement", (event: MessageEvent) => {
      console.log("🏆 달성 알림:", event.data);
      try {
        const data = JSON.parse(event.data);
        handleNotification(
          data.title || "달성 알림",
          data.message || event.data,
          "achievement",
          data.actionUrl || "/goal/achievementHistory"
        );
      } catch {
        handleNotification(
          "달성 알림",
          event.data,
          "achievement",
          "/goal/achievementHistory"
        );
      }
    });

    eventSource.onerror = (error) => {
      console.error("❌ SSE 연결 에러:", error);
      console.log("SSE 상태:", eventSource.readyState);
      // 에러 시 재연결 시도하지 않고 닫기
      eventSource.close();
    };

    return () => {
      console.log("SSE 연결 종료");
      eventSource.close();
    };
  }, [addNotification]);

  /**
   * 알림 처리 함수
   */
  const handleNotification = (
    title: string,
    message: string,
    type: "report" | "diary" | "goal" | "achievement" | "general" = "general",
    actionUrl?: string,
    month?: number
  ) => {
    // 알림 설정 확인: 해당 타입의 알림이 비활성화되어 있으면 처리하지 않음
    if (!isNotificationEnabled(type)) {
      console.log(`알림 타입 "${type}"이 비활성화되어 있어 알림을 표시하지 않습니다.`);
      return;
    }

    // 브라우저 알림 표시 (백그라운드에서도 작동하도록 Service Worker 사용)
    if ("Notification" in window && Notification.permission === "granted") {
      // Service Worker를 통해 알림 표시 (백그라운드에서도 작동)
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body: message,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: `notification-${Date.now()}`, // 중복 알림 방지
            requireInteraction: false,
            data: {
              url: actionUrl || window.location.origin,
            },
          });
        }).catch((err) => {
          console.error("Service Worker 알림 실패, 일반 Notification 사용:", err);
          // Service Worker 실패 시 일반 Notification 사용
          new Notification(title, {
            body: message,
            icon: "/favicon.ico",
          });
        });
      } else {
        // Service Worker를 지원하지 않는 경우 일반 Notification 사용
        new Notification(title, {
          body: message,
          icon: "/favicon.ico",
        });
      }
    } else {
      console.log("알림 권한이 없습니다:", Notification.permission);
    }

    // 앱 내 알림 배너 표시를 위한 store 업데이트
    addNotification({
      title,
      message,
      type,
      actionUrl,
      month,
    });
  };
};

