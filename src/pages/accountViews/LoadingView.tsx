import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { img } from "@/assets/img";
import DefaultDiv from "@/components/default/DefaultDiv";

const LoadingView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 2초 후 로그인 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <DefaultDiv 
      isPadding={false} 
      className="flex overflow-hidden relative flex-col justify-center items-center p-0"
      style={{ background: 'linear-gradient(to bottom, #D8EBC1, #FFFFFF, #FFFFFF, #CEDF9F)' }}
    >
      {/* 공룡 캐릭터 이미지 */}
      <img
        src={img.signUp}
        alt="공룡 캐릭터"
        className="object-contain absolute bottom-20 left-1/2 -translate-x-1/2 w-[30rem]"
      />
      
      {/* 중앙 텍스트와 로고 */}
      <div className="flex absolute top-1/3 left-1/2 z-10 flex-col justify-center items-center -translate-x-1/2 -translate-y-1/2">
        {/* 로고 */}
        <img
          src={img.woori_logo}
          alt="우리두리 로고"
          className="w-[34rem] select-none animate-pulse mb-4"
        />
        
        {/* 텍스트 */}
        <div className="flex flex-col justify-center items-center" style={{ fontFamily: 'nanosanskr', letterSpacing: '-0rem' }}>
            <p className="text-[1.5rem] text-[#4A4A4A] mb-1">두리와 함께하는</p>
            <p className="text-[1.5rem] text-[#4A4A4A] mb-2">똑똑한 소비습관 키우기</p>
        </div>
        <div className="flex flex-col justify-center items-center" style={{ fontFamily: 'OngleipRyudung', letterSpacing: '-0.05em' }}>
          <p className="text-[5rem] font-bold text-[#000000]">우리두리</p>
        </div>
      </div>
    </DefaultDiv>
  );
};

export default LoadingView;

