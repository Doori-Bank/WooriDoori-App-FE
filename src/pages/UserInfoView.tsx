import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDiv from '@/components/default/DefaultDiv';
import DefaultButton from '@/components/button/DefaultButton';
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
      <div className="flex items-center justify-between w-full pt-4 pb-2">
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
      <div className="flex flex-col items-center mb-8">
        {/* 프로필 이미지 */}
        <div className="flex overflow-hidden justify-center items-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
          <img
            src={img.doori_favicon}
            alt="프로필"
            className="object-contain w-16 h-16"
          />
        </div>
        
        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={handleWithdraw}
            className="px-6 py-2 bg-gray-500 text-white text-[1.2rem] font-medium rounded-lg hover:bg-gray-600 transition-colors"
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
      <div className="space-y-6">
        {/* 아이디 */}
        <div>
          <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
            아이디
          </label>
          <input
            type="email"
            value={userInfo.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            type="password"
            value={userInfo.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
            이름
          </label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-[1.4rem] font-medium text-gray-700 mb-2">
            생년월일
          </label>
          <input
            type="text"
            value={userInfo.birth}
            onChange={(e) => handleInputChange('birth', e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.3rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
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
    </DefaultDiv>
  );
};

export default UserInfoView;
