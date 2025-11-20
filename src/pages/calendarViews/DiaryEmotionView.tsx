import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import ConfirmModal from '@/components/modal/ConfirmModal';

import DefaultDiv from '@/components/default/DefaultDiv';
import NavBar from '@/components/default/NavBar';
const DiaryEmotionView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || '';
  const editMode = searchParams.get('edit') === 'true';
  const diaryId = searchParams.get('diaryId');
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const emotions = [
    { index: 0, icon: img.doori_face1, label: '매우 좋음' },
    { index: 1, icon: img.doori_face2, label: '좋음' },
    { index: 2, icon: img.doori_face3, label: '보통' },
    { index: 3, icon: img.doori_face4, label: '나쁨' },
    { index: 4, icon: img.doori_face5, label: '매우 나쁨' },
  ];
  
  const handleEmotionSelect = (emotionIndex: number) => {
    // 선택 즉시 다음 페이지로 이동
    setTimeout(() => {
      const params = new URLSearchParams({
        date,
        emotion: emotionIndex.toString(),
      });
      if (editMode) params.set('edit', 'true');
      if (diaryId) params.set('diaryId', diaryId);
      navigate(`/calendar/diary/write?${params.toString()}`);
    }, 100);
  };
  
  const handleCancel = () => {
    setShowCancelModal(true);
  };
  
  const handleConfirmCancel = () => {
    navigate('/calendar/diary');
  };
  
  return (
    <DefaultDiv isPadding={false}>
    <div className="w-full h-screen bg-white dark:bg-gray-700 flex flex-col relative">
      {/* 헤더 */}
      <div className="py-all px-5 flex items-center justify-between">
        <div className="w-10"></div>
        <div className="text-3xl font-bold dark:text-white">소비 일기</div>
        <button onClick={handleCancel}>
          <IconButton src={img.BsX} alt="닫기" height={33} />
        </button>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center pb-40">
        {/* 두리 그림 */}
        <div className="mb-12">
          <img 
            src={img.doori_drawing} 
            alt="두리"
            className="w-100 h-100 object-contain"
          />
        </div>
      </div>
      
      {/* 감정 선택 - 하단 고정 */}
      <div className="w-full py-6 px-6 fixed bottom-[50px] left-0 right-0 bg-white dark:bg-gray-700 z-40" style={{ borderTop: `2px solid rgb(139, 195, 75)` }}>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
          오늘의 소비를 평가해 보아요.
        </p>
        <div className="flex justify-between gap-2">
          {emotions.map((emotion) => (
            <button
              key={emotion.index}
              onClick={() => handleEmotionSelect(emotion.index)}
              className="flex-1 flex flex-col items-center gap-2 rounded-2xl transition-transform hover:scale-110 active:scale-95"
            >
              <IconButton
                src={emotion.icon} 
                alt={emotion.label}
                height={59}
                width={59}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* 취소 확인 모달 */}
      <ConfirmModal
        message={editMode ? "수정을 취소하시겠습니까?" : "작성을 취소하시겠습니까?"}
        isOpen={showCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
      <NavBar />
    </DefaultDiv>
  );
};

export default DiaryEmotionView;
