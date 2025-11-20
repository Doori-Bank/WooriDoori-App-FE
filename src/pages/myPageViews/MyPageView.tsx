import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDiv from '@/components/default/DefaultDiv';
import ChoiceModal from '@/components/modal/ChoiceModal';
import SuccessModal from '@/components/modal/SuccessModal';
import { img } from '@/assets/img';
import axiosInstance from "@/api/axiosInstance";
import { useCookieManager } from "@/hooks/useCookieManager";
import { useUserStore } from "@/stores/useUserStore";

const MyPageView: React.FC = () => {
  const navigate = useNavigate();

  const { userInfo, isLoggedIn } = useUserStore();
  const userName = isLoggedIn && userInfo?.name ? userInfo.name : "사용자";

  // 모달 상태
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const { removeCookies } = useCookieManager();


  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      // 백엔드 로그아웃 요청
      await axiosInstance.post("/auth/logout");

      removeCookies();

      // 로컬 토큰/유저정보 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");

      // 모달 처리
      setIsLogoutModalOpen(false);
      setShowLogoutSuccess(true);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const confirmWithdraw = () => {
    console.log('회원 탈퇴 실행');
    setIsWithdrawModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const cancelWithdraw = () => {
    setIsWithdrawModalOpen(false);
  };

  const menuSections = [
    {
      title: '',
      items: [
        { title: '메인 화면', path: '/home', action: undefined },
      ]
    },
    {
      title: '소비',
      items: [
        { title: '소비 일기', path: '/calendar/diary', action: undefined },
        { title: '소비 내역', path: '/calendar', action: undefined },
      ]
    },
    {
      title: '카드',
      items: [
        { title: '카드 관리', path: '/card', action: undefined },
        { title: '카드 살펴보기', path: '/card-recommend', action: undefined },
      ]
    },
    {
      title: '목표',
      items: [
        { title: '목표 관리', path: '/goal/achievementHistory', action: undefined },
        { title: '목표 수정', path: '/goal/editGoal', action: undefined },
      ]
    },
    {
      title: '',
      items: [
        { title: '로그아웃', path: '/auth/logout', action: handleLogout },
        { title: '회원 탈퇴', path: '', action: handleWithdraw },
      ]
    },
  ];

  const MenuItem = ({ title, path, action }: { title: string; path: string; action?: () => void }) => (
    <div
      onClick={() => {
        if (action) {
          action();
        } else if (path) {
          navigate(path, { state: { from: 'mypage' } });
        }
      }}
      className="flex justify-between items-center px-5 py-4 transition-all duration-200 cursor-pointer group hover:bg-gray-50 hover:rounded-xl active:bg-gray-100 active:rounded-xl"
    >
      <span className={`text-[1.4rem] ${title === '회원 탈퇴' ? 'text-red-500' : 'text-gray-800'}`}>{title}</span>
      {path && (
        <img
          src={img.grayCheckRightIcon}
          alt=">"
          className="w-[1.2rem] h-[1.2rem] opacity-40 transition-opacity duration-200 group-hover:opacity-60"
        />
      )}
    </div>
  );

  return (
    <DefaultDiv
      isBottomNav={true}
      isHeader={true}
      title="마이페이지"
      isShowBack={true}
      isShowClose={false}
      isShowSetting={false}
      onBack={() => navigate(-1)}
      headerClassName="bg-gray-100"
      style={{ backgroundColor: '#FBFBFB' }}
    >
      {/* 사용자 프로필 섹션 - 클릭 가능 */}
      <div
        onClick={() => navigate('/userinfo')}
        className="flex gap-4 items-center p-4 mb-6 bg-gray rounded-2xl transition-all duration-200 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {/* 프로필 이미지 */}
        <div className="flex overflow-hidden justify-center items-center w-20 h-20 bg-white rounded-full">
          <img
            src={img.doori_favicon}
            alt="프로필"
            className="object-contain w-16 h-16"
          />
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          <h1 className="text-[1.8rem] font-bold text-gray-900 mb-1">
            {userName}
          </h1>
          <p className="text-[1.3rem] text-gray-500">
            내 계정 정보 관리
          </p>
        </div>
        <img
          src={img.grayCheckRightIcon}
          alt=">"
          className="w-[2rem] h-[2rem] opacity-40"
        />
      </div>

      {/* 메뉴 섹션들 */}
      <div className="flex flex-col gap-4 mb-24 w-full">
        {menuSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            {section.title && (
              <div className="px-5 pt-5 pb-3">
                <h2 className="text-[1.3rem] font-semibold text-gray-700">{section.title}</h2>
              </div>
            )}
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIndex) => (
                <MenuItem key={itemIndex} title={item.title} path={item.path} action={item.action} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 로그아웃 확인 모달 */}
      <ChoiceModal
        message="정말 로그아웃 할 것인가요?"
        isOpen={isLogoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        btnTitle="로그아웃"
      />

      {/* 회원탈퇴 확인 모달 */}
      <ChoiceModal
        message="정말 회원탈퇴를 하시겠습니까?"
        isOpen={isWithdrawModalOpen}
        onConfirm={confirmWithdraw}
        onCancel={cancelWithdraw}
        btnTitle="탈퇴"
        btnColor="text-red-500"
      />

      {/* 로그아웃 성공 모달 */}
      <SuccessModal
        isOpen={showLogoutSuccess}
        title="로그아웃 완료"
        message="안전하게 로그아웃되었습니다. 다음에 또 만나요!"
        confirmText="확인"
        onConfirm={() => navigate('/')}
      />
    </DefaultDiv>
  );
};

export default MyPageView;
