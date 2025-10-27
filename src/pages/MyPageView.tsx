import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomNav from '@/components/default/NavBar';
import { img } from '@/assets/img';

const MyPageView: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { title: '메인 화면', icon: '>' },
    { title: '소비 내역 (일기)', icon: '>' },
    { title: '소비 내역 (캘린더)', icon: '>' },
    { title: '카드 관리', icon: '>' },
    { title: '카드 추천', icon: '>' },
    { title: '달성도', icon: '>' },
    { title: '목표 수정', icon: '>' },
    { title: '카테고리별 사용 금액 상세', icon: '>' },
  ];

  return (
    <DefaultDiv>
      {/* 헤더 - 설정 아이콘 */}
      <div className="flex justify-end pt-4 pb-2 w-full">
        <button
          onClick={() => navigate('/userinfo')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <img
            src={img.settingIcon}
            alt="설정"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* 사용자 프로필 섹션 */}
      <div className="flex gap-4 items-center mb-24">
        {/* 프로필 이미지 */}
        <div className="flex overflow-hidden justify-center items-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
          <img
            src={img.doori_favicon}
            alt="프로필"
            className="object-contain w-12 h-12"
          />
        </div>
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <h1 className="text-[1.8rem] font-bold text-gray-900 mb-1">
            석기시대님
          </h1>
          <p className="text-[1.2rem] text-gray-600">
            안녕하세요 오늘도 이용해주셔서 감사해요
          </p>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="mb-8 w-full">
        <h2 className="text-[1.6rem] font-bold text-gray-900 mb-10">
          메뉴
        </h2>
        
        {/* 메뉴 리스트 */}
        <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-5 transition-all duration-200 cursor-pointer hover:bg-blue-50"
            >
              <span className="text-[1.4rem] font-medium text-gray-800">
                {item.title}
              </span>
              <span className="text-[1.2rem] text-blue-400 font-bold">
                {item.icon}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 바 */}
      <div className="mt-auto">
        <BottomNav />
      </div>
    </DefaultDiv>
  );
};

export default MyPageView;
