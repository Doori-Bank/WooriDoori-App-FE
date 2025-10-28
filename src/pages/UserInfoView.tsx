import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomNav from '@/components/default/NavBar';
import ChoiceModal from '@/components/modal/ChoiceModal';
import { img } from '@/assets/img';

const UserInfoView: React.FC = () => {
  const navigate = useNavigate();
  
  // localStorage에서 사용자 정보 가져오기
  const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return {
        id: user.memberId || 'test@test.com',
        password: '*************',
        name: user.name || '홍길동',
        phone: user.phone || '010-0000-0000',
        birth: user.birth || '040207'
      };
    }
    return {
      id: 'test@test.com',
      password: '*************',
      name: '홍길동',
      phone: '010-0000-0000',
      birth: '040207'
    };
  };
  
  const [userInfo, setUserInfo] = useState(getUserInfo());

  // 모달 상태
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);


  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(true);
  };

  const confirmLogout = () => {
    // localStorage에서 사용자 정보 제거
    localStorage.removeItem('userInfo');
    
    // 로그인 페이지로 이동
    navigate('/');
    
    // 모달 닫기
    setIsLogoutModalOpen(false);
    
    // 로그아웃 성공 알림
    alert('로그아웃되었습니다.');
  };

  const confirmWithdraw = () => {
    console.log('회원 탈퇴 실행');
    setIsWithdrawModalOpen(false);
    // 회원 탈퇴 로직 구현
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const cancelWithdraw = () => {
    setIsWithdrawModalOpen(false);
  };

  return (
    <DefaultDiv>
      {/* 모달이 열릴 때 어두운 오버레이 */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 z-10 ${(isLogoutModalOpen || isWithdrawModalOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
      
      {/* 헤더 - 뒤로가기 버튼 */}
      <div className="flex justify-between items-center pt-4 pb-2 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <img
            src={img.Vector}
            alt="뒤로가기"
            className="w-5 h-5"
          />
        </button>
        <h1 className="text-[1.8rem] font-bold text-gray-900">
          사용자 정보
        </h1>
        <div className="w-5"></div> {/* 공간 확보 */}
      </div>

      {/* 프로필 섹션 */}
      <div className="flex justify-between items-center mt-20 mb-10">
        {/* 프로필 이미지 - favicon */}
        <div className="flex overflow-hidden justify-center items-center w-32 h-32 bg-green-500 rounded-full">
          <img
            src={img.doori_favicon}
            alt="프로필"
            className="object-contain w-24 h-24"
          />
        </div>
        
        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={handleWithdraw}
            className="px-6 py-1 bg-gray-600 text-white text-[1.2rem] font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            회원 탈퇴
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white text-[1.2rem] font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 사용자 정보 입력 폼 */}
      <div className="mt-16 space-y-12">
        {/* 아이디 */}
        <div>
          <label className="block text-[1.3rem] font-medium text-gray-800 mb-2">
            아이디
          </label>
          <input
            type="email"
            value={userInfo.id}
            readOnly
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-[1.3rem] font-medium text-gray-800 mb-2">
            비밀번호
          </label>
          <input
            type="password"
            value={userInfo.password}
            readOnly
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-[1.3rem] font-medium text-gray-800 mb-2">
            이름
          </label>
          <input
            type="text"
            value={userInfo.name}
            readOnly
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-[1.3rem] font-medium text-gray-800 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            value={userInfo.phone}
            readOnly
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-[1.3rem] font-medium text-gray-800 mb-2">
            생년월일
          </label>
          <input
            type="text"
            value={userInfo.birth}
            readOnly
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>


      {/* 네비게이션 바 */}
      <div className={`mt-auto transition-opacity duration-200 ${(isLogoutModalOpen || isWithdrawModalOpen) ? 'opacity-50 pointer-events-none' : ''}`}>
        <BottomNav />
      </div>

      {/* 로그아웃 확인 모달 */}
      <div className="relative z-20">
        <ChoiceModal
          message="정말 로그아웃 할 것인가요?"
          isOpen={isLogoutModalOpen}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          btnTitle="로그아웃"
          btnColor="text-red-500"
        />
      </div>

      {/* 회원탈퇴 확인 모달 */}
      <div className="relative z-20">
        <ChoiceModal
          message="정말 회원탈퇴를 하시겠습니까?"
          isOpen={isWithdrawModalOpen}
          onConfirm={confirmWithdraw}
          onCancel={cancelWithdraw}
          btnTitle="탈퇴"
          btnColor="text-red-500"
        />
      </div>
    </DefaultDiv>
  );
};

export default UserInfoView;
