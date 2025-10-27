import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDiv from '@/components/default/DefaultDiv';
import DefaultButton from '@/components/button/DefaultButton';
import BottomNav from '@/components/default/NavBar';
import { img } from '@/assets/img';

const UserInfoView: React.FC = () => {
  const navigate = useNavigate();
  
  const [userInfo, setUserInfo] = useState({
    id: 'test@test.com',
    password: '*************',
    name: '홍길동',
    phone: '010-0000-0000',
    birth: '040207'
  });

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    console.log('로그아웃');
    // 로그아웃 로직 구현
  };

  const handleWithdraw = () => {
    console.log('회원 탈퇴');
    // 회원 탈퇴 로직 구현
  };

  return (
    <DefaultDiv>
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
        {/* 프로필 이미지 - 간단한 스마일 아이콘 */}
        <div className="flex justify-center items-center w-32 h-32 bg-green-500 rounded-full">
          <div className="text-4xl font-bold text-white">
            :)
          </div>
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
      <div className="space-y-20">
        {/* 아이디 */}
        <div>
          <label className="block text-[1.3rem] font-medium text-gray-800 mb-2">
            아이디
          </label>
          <input
            type="email"
            value={userInfo.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 focus:outline-none focus:bg-white transition-colors"
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
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 focus:outline-none focus:bg-white transition-colors"
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
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 focus:outline-none focus:bg-white transition-colors"
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
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 focus:outline-none focus:bg-white transition-colors"
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
            onChange={(e) => handleInputChange('birth', e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-[1.2rem] text-gray-600 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-8">
        <DefaultButton
          text="저장"
          onClick={() => console.log('저장')}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        />
      </div>

      {/* 네비게이션 바 */}
      <div className="mt-auto">
        <BottomNav />
      </div>
    </DefaultDiv>
  );
};

export default UserInfoView;
