import React, { useEffect, useState } from 'react';
import { img } from '@/assets/img';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import '@/styles/noti/notification.css';

interface NotificationBannerProps {
  notificationId: string;
  title: string;
  message: string;
  type?: 'report' | 'diary' | 'goal' | 'achievement' | 'general' | 'warning' | 'alert';
  actionUrl?: string;
  month?: number; // 리포트용: 몇 월 리포트인지
  onClose?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notificationId,
  title,
  message,
  type = 'general',
  actionUrl,
  month,
  onClose,
}) => {
  const navigate = useNavigate();
  const { removeNotification } = useNotificationStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되면 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const getDooriImage = () => {
    const normalizedType = type?.toLowerCase();
    switch (normalizedType) {
      case 'report':
        return img.doori_report;
      case 'diary':
        return img.doori_writing;
      case 'goal':
        return img.doori_thinking;
      case 'achievement':
        return img.doori_celebrating;
      default:
        return img.doori_basic;
    }
  };

  // REPORT 타입일 때 메시지 포맷팅
  const getDisplayMessage = () => {
    const normalizedType = type?.toLowerCase();
    if (normalizedType === 'report' && month) {
      return `두리가 ${month}월 소비 리포트를 가져왔습니다.`;
    }
    return message;
  };

  // 타입에 따른 기본 actionUrl 설정
  const getActionUrl = () => {
    if (actionUrl) return actionUrl;
    
    const normalizedType = type?.toLowerCase();
    switch (normalizedType) {
      case 'report':
        return '/report';
      case 'diary':
        // 오늘 날짜로 일기 작성 페이지로 이동
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
        return `/calendar/diary/emotion?date=${today}`;
      case 'goal':
        return '/goal/editGoal';
      case 'achievement':
        return '/goal/achievementHistory';
      default:
        return undefined;
    }
  };

  const handleClick = () => {
    const url = getActionUrl();
    if (url) {
      navigate(url);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    // 애니메이션이 끝난 후 제거
    setTimeout(() => {
      removeNotification(notificationId);
      if (onClose) {
        onClose();
      }
    }, 300); // slideOutUp 애니메이션 시간과 동일
  };

  return (
    <div
      className={`notification-banner relative w-full rounded-xl bg-[#F5F5F5] p-5 mt-6 cursor-pointer shadow-sm hover:shadow-md transition-all ${
        isClosing ? 'closing' : isVisible ? 'notification-banner-visible' : 'notification-banner-hidden'
      }`}
      onClick={handleClick}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-3 right-3 text-[#858585] hover:text-[#4A4A4A] transition-colors"
        aria-label="알림 닫기"
      >
        <img src={img.BsX} alt="닫기" width={20} height={20} />
      </button>

      <div className="flex items-center gap-4 pr-8">
        {/* 두리 캐릭터 */}
        <div className="flex-shrink-0">
          <img
            src={getDooriImage()}
            alt="두리"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1">
          <p className="text-[1.4rem] font-semibold text-[#4A4A4A] mb-1">
            {title}
          </p>
          <p className="text-[1.2rem] text-[#858585]">
            {getDisplayMessage()}
          </p>
          <p className="text-[1.1rem] text-[#4C8B73] font-medium mt-2">
            지금 바로 확인해보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;

