/**
 * 알림 설정 관리 유틸리티
 */

const NOTIFICATION_SETTINGS_KEY = 'wooridoori_notification_settings';

export interface NotificationSettings {
  systemNotification: boolean; // 시스템 알림 (리포트, 목표, 달성 등)
  diaryNotification: boolean; // 일기 알림
}

/**
 * 알림 설정 가져오기
 */
export const getNotificationSettings = (): NotificationSettings => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('알림 설정 로드 실패:', error);
  }
  
  // 기본값: 모두 활성화
  return {
    systemNotification: true,
    diaryNotification: true,
  };
};

/**
 * 알림 설정 저장
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('알림 설정 저장 실패:', error);
  }
};

/**
 * 알림 타입에 따른 설정 확인
 */
export const isNotificationEnabled = (type: string): boolean => {
  const settings = getNotificationSettings();
  const normalizedType = type?.toLowerCase();
  
  if (normalizedType === 'diary') {
    return settings.diaryNotification;
  } else {
    // 리포트, 목표, 달성, 일반 등 시스템 알림
    return settings.systemNotification;
  }
};

