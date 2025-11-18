import React from 'react';
import { NotificationData } from '@/stores/useNotificationStore';
import { img } from '@/assets/img';

interface NotificationItemProps {
  notification: NotificationData;
  onDelete: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDelete, onMarkAsRead }) => {
  const [translateX, setTranslateX] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);

  const deleteButtonWidth = 80;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const currentX = e.targetTouches[0].clientX;
    const diff = touchStart - currentX;

    if (diff > 0) {
      // 왼쪽으로 드래그
      const newTranslateX = Math.min(diff, deleteButtonWidth);
      setTranslateX(newTranslateX);
    } else {
      // 오른쪽으로 드래그
      setTranslateX(0);
    }
  };

  const onTouchEnd = () => {
    if (touchStart === null) return;

    const finalTranslate = translateX;
    if (finalTranslate > deleteButtonWidth / 2) {
      // 절반 이상 드래그했으면 완전히 열림
      setTranslateX(deleteButtonWidth);
    } else {
      // 절반 이하면 닫음
      setTranslateX(0);
    }

    setTouchStart(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    onDelete(notification.id);
  };

  const handleClick = () => {
    // 클릭 시 읽음 처리
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // 타입에 따른 아이콘 가져오기
  const getIcon = () => {
    const normalizedType = notification.type?.toLowerCase();
    switch (normalizedType) {
      case 'report':
        return img.doori_report;
      case 'diary':
        return img.doori_writing;
      case 'goal':
        return img.doori_thinking;
      case 'achievement':
        return img.doori_celebrating;
      case 'warning':
        return img.doori_face3;
      case 'alert':
        return img.doori_angry;
      default:
        return img.doori_basic;
    }
  };

  // 날짜 포맷팅
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      return `${month}월 ${day}일`;
    } catch {
      return '';
    }
  };

  const icon = getIcon();
  const formattedDate = formatDate(notification.createdAt);

  return (
    <div className="relative overflow-hidden w-full h-auto dark:border-gray-600 border-b">
      {/* 전체 컨텐츠 래퍼 */}
      <div
        className="relative h-full flex transition-transform"
        style={{ transform: `translateX(-${translateX}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 알림 컨텐츠 */}
        <div
          className={`flex-shrink-0 h-full p-4 cursor-pointer ${
            !notification.isRead 
              ? 'bg-green-50 dark:bg-green-900/20' 
              : 'bg-white dark:bg-gray-700'
            }`}
          style={{ width: '100%' }}
          onClick={handleClick}
        >
          <div className="flex gap-4">
            {/* 아이콘 */}
            <div className="flex-shrink-0">
              <img
                src={icon}
                alt="Doori"
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* 텍스트 */}
            <div className="flex-1">
              <span className='flex items-start justify-between'>
                <p className="flex-2 text-[1.2rem] font-semibold text-gray-500 dark:text-gray-200">
                  {notification.title}
                </p>
                <p className="flex-1 max-w-[5rem] text-[1rem] text-gray-400 dark:text-gray-500" style={{textAlign: 'end'}}>
                  {formattedDate}
                </p>
              </span>
              <p className="text-[1rem] text-gray-400 dark:text-gray-400 mt-2 whitespace-pre-line">
                {notification.message}
              </p>
            </div>
          </div>
        </div>

        {/* 삭제 버튼 */}
        <div
          className="flex-shrink-0 flex items-center justify-center bg-red-500"
          style={{ width: `${deleteButtonWidth}px` }}
          onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 전파 방지
        >
          <button
            onClick={handleDelete}
            className="text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
