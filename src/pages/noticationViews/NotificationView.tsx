import React, { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import NotificationItem from '@/components/noti/Notification';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import NotificationTab from './NotificationTabs';
import { OneBtnModal } from '@/components/modal/OneBtnModal';
import ToggleSwiitchBtn from '@/components/button/ToggleSwitchBtn';

interface Notification {
  id: number;
  type: 'warning' | 'alert' | 'report';
  icon: string;
  mainMessage: string;
  subMessage: string;
  date: string;
  isNew?: boolean;
}

const NotificationView: React.FC = () => {

  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 1,
      type: 'warning',
      icon: img.doori_face3,
      mainMessage: '두리에게 변화가 생겼어요 👀',
      subMessage: '목표 금액의 50%를 초과했습니다. 소비에 유의해주세요.',
      date: '10월 1일',
      isNew: true
    },
    {
      id: 2,
      type: 'warning',
      icon: img.doori_face3,
      mainMessage: '두리에게 변화가 생겼어요 👀',
      subMessage: '목표 금액의 75%를 초과했습니다. 소비 계획을 다시 확인해주세요.',
      date: '10월 1일',
      isNew: true
    },
    {
      id: 3,
      type: 'alert',
      icon: img.doori_angry,
      mainMessage: '두리가 화났어요!!',
      subMessage: '목표 금액의 100%를 달성했습니다. 더이상의 소비를 지양해주세요.',
      date: '10월 1일',
      isNew: true
    },
    {
      id: 4,
      type: 'alert',
      icon: img.doori_annoyed,
      mainMessage: '저희는 더이상 두리를 말릴 수 없습니다.',
      subMessage: '목표 금액의 100%를 초과했습니다. 두리가 당신에게 실망했습니다.',
      date: '10월 1일'
    },
    {
      id: 5,
      type: 'report',
      icon: img.doori_report,
      mainMessage: '두리가 6월 소비 리포트를 가져왔습니다.',
      subMessage: '한 달간 소비 내역을 확인하세요.',
      date: '10월 1일'
    }
  ]);

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
  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
          {notifications.length > 0 && (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDelete={handleDelete}
              />
            ))
          )}

          {notifications.length === 0 && (
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

