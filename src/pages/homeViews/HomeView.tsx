import { img } from "@/assets/img";
import '@/styles/home/animations.css'
import IconButton from "@/components/button/IconButton";
import ConsumptionCategory from "@/components/category/ConsumptionCategory";
import BorderBox from "@/components/default/BorderBox";
import DefaultDiv from "@/components/default/DefaultDiv"
import BottomNav from "@/components/default/NavBar";
import MainBanner from "@/components/home/MainBanner";
import ProgressDonet from "@/components/Progress/ProgressDonet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeView = () => {
  const navigate = useNavigate();
  
  // localStorage에서 사용자 정보 가져오기
  const getUserName = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.name || '사용자';
    }
    return '석기'; // 기본값
  };
  
  const name: string = getUserName();
  const target: string = '100만원 쓰기';
  const dooriTaget = { src: img.doori_basic, title: '흠...어디 한번 볼까?' };
  const totalPrice = 1080000;


  const categories = [
    { name: "식비", value: 400000, color: "#6B5DD3" },
    { name: "주유/자동차", value: 300000, color: "#3ACFA3" },
    { name: "쇼핑/마트", value: 200000, color: "#FF8353" },
    { name: "교육/육아", value: 100000, color: "#6E6E6E" },
    { name: "기타", value: 80000, color: "#C4C4C4" },
  ];
  const topCategoryList = [
    { bgColor: 'bg-[#FF8353]', amount: '200,000원', iconSrc: img.food, label: '식비' },
    { bgColor: 'bg-[#FF8353]', amount: '200,000원', iconSrc: img.food, label: '식비' },
    { bgColor: 'bg-[#FF8353]', amount: '200,000원', iconSrc: img.food, label: '식비' },
    { bgColor: 'bg-[#FF8353]', amount: '200,000원', iconSrc: img.food, label: '식비' },
    { bgColor: 'bg-[#FF8353]', amount: '200,000원', iconSrc: img.food, label: '식비' },

  ];

  const cardBannerList = [
    { url: '', src: img.cardBanner },
    { url: '', src: img.cardBanner2 },
  ];


  const messages = ["안녕하세요!", "오늘 하루도 화이팅!", "두리와 함께!"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // 3초마다 메시지 변경
    return () => clearInterval(interval);
  }, []);


  return (
    <DefaultDiv isHome={true}>
      {/* 해더 */}
      <header className="flex justify-between items-center">
        <img src={img.logoIcon} alt="우리두리" width={70} />
        <div onClick={() => navigate('/notification')} className="cursor-pointer">
          <IconButton src={img.alarmIcon} alt="알람" width={22} height={22} />
        </div>
      </header>

      {/* 인사 타이틀 */}
      <main className="flex flex-col pt-8 pb-40">
        <div className="title">
          <h1 className="text-[1.6rem] font-semibold text-[#4A4A4A]">안녕하세요 {name}님</h1>
          <p className="mt-0.5 text-[1.2rem] text-[#858585]">오늘의 소비내역에 대해 안내해드릴께요!</p>
        </div>

        {/* 메인 배너 (달성도 배너 → 달성도 페이지 이동) */}
        <div
          onClick={() => navigate('/goal/achievementHistory')}
          className="mt-10 cursor-pointer"
          role="button"
          aria-label="달성도 보기"
        >
          <MainBanner
            totalDays={30}
            passedDays={20}
            bgImage={img.bgImg}
            bgColor="#4C8B73"
            progressColor="#FFD84D"
          />
        </div>

        {/* 이번달 목표 + 총 지출 */}
        <div className="flex gap-3 mt-8">
          {/* 목표 */}
          <BorderBox>
            <div onClick={() => navigate('/goal/setGoal')} className="flex relative flex-col justify-start items-center h-full cursor-pointer">
              <h3 className="text-[1.6rem] font-semibold mt-3">이번달 목표</h3>
              <p className="mt-5 text-[1.3rem] font-semibold text-center">{target}</p>

              <div className="flex absolute -right-5 -bottom-5 flex-col items-end w-full">
                <span className="w-full text-[#B6B6B6]  animate-slide -mb-3 pr-2">{messages[index]}</span>
                <img src={dooriTaget.src} alt="두리이미지" className="object-cover" width={80} style={{ transform: "scaleX(1)" }} />
              </div>
            </div>
          </BorderBox>
          {/* 지출 */}
          <BorderBox flex="flex-2">
            <div onClick={() => navigate('/calendar')} className="cursor-pointer">
              <ProgressDonet total={totalPrice} categories={categories} month="5월" size={100} isCategoryShow={false} isTotalPostionCenter={false} />
            </div>
          </BorderBox>
        </div>

        {/* 카테고리 TOP 5 */}
        <div className="mt-10">
          <div className="mb-8">
            <h3 className="font-bold text-[1.6rem]">카테고리별 사용 금액 TOP 5</h3>
          </div>
          <BorderBox>
            <div onClick={() => navigate('/category-top5')} className="cursor-pointer">
              {
                topCategoryList.map((element, index) => {
                  return (
                    <div key={index} className={`flex items-center gap-6 ${index != topCategoryList.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <p className={`text-[1.5rem] font-bold pl-4
                        ${index == 0 ? 'text-[#FF0000]' : index == topCategoryList.length - 1 ? 'text-[#138FEF]' : 'text-[#4A4A4A]'}`}>TOP {index + 1}</p>
                      <ConsumptionCategory amount={element.amount} iconSrc={element.iconSrc} label={element.label} bgColor={element.bgColor} percentage="" isBorder={false} />
                    </div>
                  )
                })
              }
            </div>
          </BorderBox>
        </div>

        {/* 카드 추천 */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-[1.6rem]">{name}님에게 딱 맞춘 카드</h3>
            <div onClick={() => navigate('/card-recommend')} className="cursor-pointer">
              <img src={img.grayCheckRightIcon} alt=">" width={15} />
            </div>
          </div>

          <div>
            {cardBannerList.map((element, index) => {
              return (
                <div key={index} onClick={() => navigate('/card-recommend')} className="block mt-6 cursor-pointer">
                  <img src={element.src} alt={`카드배너${index + 1}`} height={88} />
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* 네브바 */}
      <BottomNav />
    </DefaultDiv>
  )
}

export default HomeView;