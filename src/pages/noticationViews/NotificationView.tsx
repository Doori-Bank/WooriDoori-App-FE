import React, { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import NotificationItem from '@/components/noti/Notification';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import NotificationTab from './NotificationTabs';
import { OneBtnModal } from '@/components/modal/OneBtnModal';
import ToggleSwiitchBtn from '@/components/button/ToggleSwitchBtn';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import { getNotificationSettings, saveNotificationSettings, NotificationSettings } from '@/utils/notificationSettings';

type TabType = '시스템 알림' | '일기 알림';

const NotificationView: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, removeNotification, markAsRead, clearAllNotifications } = useNotificationStore();
  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>('시스템 알림');
  
  // 알림 설정 초기화 (로컬 스토리지에서 불러오기)
  const initialSettings = getNotificationSettings();
  const [settingAlarmList, setSettingAlarmList] = useState([
    { title: '시스템 알림', isOn: initialSettings.systemNotification },
    { title: '일기 알림', isOn: initialSettings.diaryNotification }
  ]);

  // persist가 자동으로 로컬 스토리지에서 로드하므로 별도 로드 불필요

  // 선택된 탭에 따라 알림 필터링
  const filteredNotifications = notifications.filter((notification) => {
    const normalizedType = notification.type?.toLowerCase();
    if (selectedTab === '일기 알림') {
      // 일기 알림 탭: diary 타입만 표시
      return normalizedType === 'diary';
    } else {
      // 시스템 알림 탭: diary 타입 제외한 나머지 표시
      return normalizedType !== 'diary';
    }
  });


  // 함수 -=========================================================================
  const openModal = () => {
    return (
      <OneBtnModal 
        isOpen={isOpenModal}
        onConfirm={checkAlramStatus}
        message={
          <div>
            {settingAlarmList.map((element, index) => {
              return <ToggleSwiitchBtn
                key={index}
                label={element.title}
                onChange={(e) => {
                  const newList = [...settingAlarmList];
                  newList[index] = { ...newList[index], isOn: e };
                  setSettingAlarmList(newList);
                  
                  // 로컬 스토리지에 저장
                  const settings: NotificationSettings = {
                    systemNotification: index === 0 ? e : newList[0].isOn,
                    diaryNotification: index === 1 ? e : newList[1].isOn,
                  };
                  saveNotificationSettings(settings);
                }}
                checked={element.isOn}
                className={index === 0 ? 'mb-10 mt-5' : 'mb-5'}
              />
            })}
          </div>
        } />
    )
  };


  // 알림 삭제
  const handleDelete = (id: string) => {
    removeNotification(id);
  };

  // 알림 읽음 처리
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  // 알림 클릭 시 처리 (읽음 처리 + 페이지 이동)
  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // 읽음 처리
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // 페이지 이동
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // 알림 설정 표시 여부 판단
  const checkAlramStatus = () => {
    // 시스템 알림과 일기 알림 중 하나라도 켜져있으면 전체 알림 on
    const hasAnyNotificationOn = settingAlarmList.some(item => item.isOn);
    setIsAlarmOn(hasAnyNotificationOn);
    setIsOpenModal(!isOpenModal);
  }

  return (
    <>
      <DefaultDiv
        isHeader={true}
        title='알림'
        isShowBack={true}
        isShowClose={false}
        className="overflow-hidden"
        headerChildren={
          <IconButton
            src={isAlarmOn ? img.alarmOn : img.alarmOff}
            alt='소비일기' width={40}
            onClick={() => { setIsOpenModal(!isOpenModal) }}
          />}
        onBack={() => { window.history.back(); }}
      >

        <div className="block">
          {/* 탭 영역 (고정) */}
          <div>
            <NotificationTab onChange={setSelectedTab} />
          </div>

          {/* 알림 목록 영역 (스크롤 가능) */}
          <div className="overflow-y-auto scroll-smooth mt-5" style={{ height: 'calc(100vh - 7rem - 80px)' }}>
          {filteredNotifications.length > 0 && (
            <>
              {/* 버튼 영역 */}
              <div className="mb-4 flex justify-end gap-4">
                {/* 읽지 않은 알림이 있으면 전체 읽음 버튼 */}
                {filteredNotifications.some(n => !n.isRead) && (
                  <button
                    onClick={() => {
                      // 현재 탭의 알림만 읽음 처리
                      filteredNotifications
                        .filter(n => !n.isRead)
                        .forEach(n => markAsRead(n.id));
                    }}
                    className="text-[1.2rem] text-[#4C8B73] font-medium hover:text-[#3A6B5A] transition-colors"
                  >
                    전체 읽음 처리
                  </button>
                )}
                
                {/* 전체 삭제 버튼 */}
                <button
                  onClick={() => {
                    if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
                      clearAllNotifications();
                    }
                  }}
                  className="text-[1.2rem] text-red-500 font-medium hover:text-red-700 transition-colors"
                >
                  전체 삭제
                </button>
              </div>
              
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="cursor-pointer"
                >
                  <NotificationItem
                    notification={notification}
                    onDelete={handleDelete}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              ))}
            </>
          )}

          {filteredNotifications.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-5">
              <img
                src={img.doori_normal}
                alt="Doori"
                className="w-[10rem] h-[10rem] object-contain"
              />
              <p className="text-[1.4rem] text-gray-400 dark:text-gray-400 text-center">
                알림이 없습니다.
              </p>
            </div>
          )}
          </div>
        </div>

        {/* 모달창 */}
        {openModal()}
      </DefaultDiv>
    </>
  );
};

export default NotificationView;

