import React, { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import NotificationItem from '@/components/noti/Notification';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import NotificationTab from './NotificationTabs';
import { OneBtnModal } from '@/components/modal/OneBtnModal';
import ToggleSwiitchBtn from '@/components/button/ToggleSwitchBtn';
import { useNotificationStore } from '@/stores/useNotificationStore';

const NotificationView: React.FC = () => {
  const { notifications: storeNotifications, removeNotification, markAsRead } = useNotificationStore();
  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [settingAlarmList, setSettingAlarmList] = useState([{ title: '시스템 알림', isOn: true }, { title: '일기 알림', isOn: true }]);


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

  // 알림 설정 표시 여부 판단
  const checkAlramStatus = () =>{
    setIsAlarmOn(settingAlarmList[0].isOn);
    setIsOpenModal(!isOpenModal);
  }

  return (
    <>
      <DefaultDiv
        style={{ backgroundColor: '#FBFBFB' }}
        isHeader={true}
        title='알림'
        isShowBack={true}
        isShowClose={false}
        headerChildren={
          <IconButton
            src={isAlarmOn ? img.alarmOn : img.alarmOff}
            alt='소비일기' width={40}
            onClick={() => { setIsOpenModal(!isOpenModal) }}
          />}
        onBack={() => { window.history.back(); }}
      >

        <NotificationTab />


        {/* 메인 컨텐츠 */}
        <div className="flex-1 py-5 h-full">

          {/* 알림 목록 */}
          {storeNotifications.length > 0 && (
            storeNotifications.map((notification) => {
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDelete}
                  onMarkAsRead={markAsRead}
                />
              );
            })
          )}

          {storeNotifications.length === 0 && (
            <div className="flex flex-col gap-5 justify-center items-center h-full">
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

        {/* 모달창 */}
        {openModal()}
      </DefaultDiv>
    </>
  );
};

export default NotificationView;

