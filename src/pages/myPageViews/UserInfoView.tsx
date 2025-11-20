import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDiv from '@/components/default/DefaultDiv';
import { img } from '@/assets/img';

const UserInfoView: React.FC = () => {
  const navigate = useNavigate();
  
  // localStorage에서 사용자 정보 가져오기
  const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return {
        id: user.memberId || user.email || 'test@test.com',
        password: user.password ? '•'.repeat(user.password.length) : '••••••••',
        name: user.name || '홍길동',
        phone: user.phone || '010-0000-0000',
        birth: user.birth || '040207'
      };
    }
    return {
      id: 'test@test.com',
      password: '••••••••',
      name: '홍길동',
      phone: '010-0000-0000',
      birth: '040207'
    };
  };
  
  const userInfo = getUserInfo();
  
  // 프로필 이미지 상태 관리
  const getProfileImage = () => {
    const savedImage = localStorage.getItem('profileImage');
    return savedImage || null;
  };
  
  const [profileImage, setProfileImage] = useState<string | null>(getProfileImage());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setProfileImage(imageDataUrl);
        localStorage.setItem('profileImage', imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DefaultDiv
      isHeader={true}
      title="내 정보 관리"
      isShowBack={true}
      isShowClose={false}
      isShowSetting={false}
      onBack={() => navigate(-1)}
      isBottomNav={true}
      style={{ backgroundColor: '#FBFBFB' }}
      headerClassName="bg-white"
      >
      {/* 프로필 섹션 */}
      <div className="flex flex-col justify-center items-center mt-32 mb-24">
        {/* 프로필 이미지 컨테이너 */}
        <div className="relative">
          {/* 프로필 이미지 - 클릭 가능 */}
          <div 
            onClick={handleImageClick}
            className="flex overflow-hidden relative justify-center items-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full transition-transform duration-200 cursor-pointer group hover:scale-105 active:scale-95"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={img.doori_favicon}
                alt="프로필"
                className="object-contain w-24 h-24"
              />
            )}
          </div>
          {/* 우측 상단 + 버튼 */}
          <button
            onClick={handleImageClick}
            className="flex absolute -top-1 -right-1 justify-center items-center w-10 h-10 bg-blue-500 rounded-full border-2 border-white shadow-md transition-all duration-200 cursor-pointer hover:bg-blue-600 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* 사용자 정보 리스트 */}
      <div className="mt-4">
        <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* 전화번호 */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <span className="text-[1.4rem] text-gray-800">전화번호</span>
            <span className="text-[1.4rem] text-gray-600">{userInfo.phone}</span>
          </div>

          {/* 이메일 */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <span className="text-[1.4rem] text-gray-800">이메일</span>
            <span className="text-[1.4rem] text-gray-600">{userInfo.id}</span>
          </div>

          {/* 이름 */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <span className="text-[1.4rem] text-gray-800">이름</span>
            <span className="text-[1.4rem] text-gray-600">{userInfo.name}</span>
          </div>

          {/* 생년월일 */}
          <div className="flex justify-between items-center px-5 py-4">
            <span className="text-[1.4rem] text-gray-800">생년월일</span>
            <span className="text-[1.4rem] text-gray-600">{userInfo.birth}</span>
          </div>
        </div>
      </div>
    </DefaultDiv>
  );
};

export default UserInfoView;
