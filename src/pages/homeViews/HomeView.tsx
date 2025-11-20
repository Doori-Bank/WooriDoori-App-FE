import { img } from "@/assets/img";
import "@/styles/home/animations.css";
import IconButton from "@/components/button/IconButton";
import ConsumptionCategory from "@/components/category/ConsumptionCategory";
import BorderBox from "@/components/default/BorderBox";
import DefaultDiv from "@/components/default/DefaultDiv";
import MainBanner from "@/components/home/MainBanner";
import ProgressDonet from "@/components/Progress/ProgressDonet";
import NotificationBanner from "@/components/noti/NotificationBanner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { apiList } from "@/api/apiList";
import { getCategoryMeta } from "@/utils/categoryMeta";

interface CategorySpend {
  rank?: string;
  category?: string;
  totalPrice?: number;
}

interface CardRecommendItem {
  cardId?: number;
  cardBannerUrl?: string | null;
}

interface MainResponse {
  fullDate?: number;
  duringDate?: number;
  goalPercent?: number;
  goalMoney?: number;
  totalPaidMoney?: number;
  paidPriceOfCategory?: CategorySpend[];
  cardRecommend?: CardRecommendItem[];
}

interface CategoryChartData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

const DEFAULT_CATEGORY_SOURCE: CategorySpend[] = [
  { rank: "top1", category: "FOOD", totalPrice: 400000 },
  { rank: "top2", category: "TRANSPORTATION", totalPrice: 300000 },
  { rank: "top3", category: "SHOPPING", totalPrice: 200000 },
  { rank: "top4", category: "EDUCATION", totalPrice: 100000 },
  { rank: "top5", category: "ETC", totalPrice: 80000 },
];

const DEFAULT_CARD_BANNERS = [
  { url: "", src: img.cardBanner },
  { url: "", src: img.cardBanner2 },
  { url: "", src: img.cardBanner3 },
];

const mapCategorySpendToChart = (items: CategorySpend[]): CategoryChartData[] =>
  items.map((item) => {
    const meta = getCategoryMeta(item.category);
    return {
      name: meta.label,
      value: item.totalPrice ?? 0,
      color: meta.color,
      icon: meta.icon,
    };
  });

const HomeView = () => {
  const navigate = useNavigate();
  const { notifications } = useNotificationStore();
  const [homeData, setHomeData] = useState<MainResponse | null>(null);

  // localStorage에서 사용자 정보 가져오기
  const getUserName = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.name || "사용자";
    }
    return "석기"; // 기본값
  };

  const name: string = getUserName();
  const dooriTaget = { src: img.doori_basic, title: "흠...어디 한번 볼까?" };
  const fallbackTotalPrice = DEFAULT_CATEGORY_SOURCE.reduce(
    (sum, item) => sum + (item.totalPrice ?? 0),
    0
  );
  const totalPrice = homeData?.totalPaidMoney ?? fallbackTotalPrice;
  const goalPercent = homeData?.goalPercent ?? 80;
  const fullDate = homeData?.fullDate ?? 30;
  const duringDate = homeData?.duringDate ?? 28;
  const remainDays = Math.max(fullDate - duringDate, 0);
  const target =
    homeData?.goalMoney && homeData.goalMoney > 0
      ? `${homeData.goalMoney.toLocaleString()}만원 쓰기`
      : "목표를 설정해주세요";

  const categorySource = homeData?.paidPriceOfCategory?.length
    ? homeData.paidPriceOfCategory
    : DEFAULT_CATEGORY_SOURCE;
  const categoryChartData = mapCategorySpendToChart(categorySource).slice(0, 5);
  const donutCategories = categoryChartData.map(({ name, value, color }) => ({
    name,
    value,
    color,
  }));
  const categoryTotalValue = categoryChartData.reduce(
    (sum, cat) => sum + cat.value,
    0
  );
  const topCategoryItems = categoryChartData.map((cat) => ({
    bgColor: cat.color,
    amount: `${cat.value.toLocaleString()}원`,
    iconSrc: cat.icon,
    label: cat.name,
    percentage:
      categoryTotalValue > 0 ? `${Math.round((cat.value / categoryTotalValue) * 100)}%` : "-",
  }));
  const cardBannerItems =
    homeData?.cardRecommend && homeData.cardRecommend.length > 0
      ? homeData.cardRecommend.map((card, index) => ({
          url: "",
          src: card.cardBannerUrl || DEFAULT_CARD_BANNERS[index % DEFAULT_CARD_BANNERS.length].src,
        }))
      : DEFAULT_CARD_BANNERS;
  const currentMonthLabel = `${new Date().getMonth() + 1}월`;

  const messages = ["안녕하세요!", "오늘 하루도 화이팅!", "두리와 함께!"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchMainData = async () => {
      try {
        const response = await apiList.getMain();
        if (isMounted) {
          setHomeData(response);
        }
      } catch (error) {
        console.error("메인 데이터 조회 실패:", error);
      }
    };
    fetchMainData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // 3초마다 메시지 변경
    return () => clearInterval(interval);
  }, []);

  return (
    <DefaultDiv style={{ backgroundColor: '#FBFBFB' }} isBottomNav={true}>
      {/* 해더 */}
      <header className="flex justify-between items-center">
        <img src={img.wooridoori_logo} alt="우리두리" width={80} />
        <div onClick={() => navigate('/notification')} className="cursor-pointer">
          <IconButton src={img.alarmOn} alt="알람" width={34} height={34} />
        </div>
      </header>

      {/* 인사 타이틀 */}
      <main className="flex flex-col pt-8 pb-40">
        <div className="title">
          <h1 className="text-[1.6rem] font-semibold text-[#4A4A4A]">안녕하세요 {name}님</h1>
          <p className="mt-0.5 text-[1.2rem] text-[#858585]">오늘의 소비내역에 대해 안내해드릴께요!</p>
        </div>

        {/* 알림 배너 - 읽지 않은 알림만 표시 */}
        {(() => {
          const unreadNotifications = notifications.filter(noti => !noti.isRead);
          return unreadNotifications.length > 0 && (
            <div className="mt-6">
              {unreadNotifications.slice(0, 1).map((notification) => (
                <NotificationBanner
                  key={notification.id}
                  notificationId={notification.id}
                  title={notification.title}
                  message={notification.message}
                  type={notification.type}
                  actionUrl={notification.actionUrl}
                  month={notification.month}
                />
              ))}
            </div>
          );
        })()}

        {/* 메인 배너 (달성도 배너 → 달성도 페이지 이동) */}
        <div
          onClick={() => navigate('/goal/achievementHistory', { state: { from: "home" } })}
          className="mt-10 cursor-pointer"
          role="button"
          aria-label="달성도 보기"
        >
          <MainBanner
            consumPercent={goalPercent}
            remainDays={remainDays}
            bgImage={img.bgImg}
            bgColor="#4C8B73"
            progressColor="#FFD84D"
          />
        </div>

        {/* 이번달 목표 + 총 지출 */}
        <div className="flex gap-3 mt-8">
          {/* 목표 */}
          <BorderBox>
            <div onClick={() => navigate('/goal/editGoal')} className="flex relative flex-col justify-start items-center h-full cursor-pointer">
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
              <ProgressDonet
                total={totalPrice}
                categories={donutCategories}
                month={currentMonthLabel}
                size={100}
                isCategoryShow={false}
                isTotalPostionCenter={false}
              />
            </div>
          </BorderBox>
        </div>

        {/* 카테고리 TOP 5 */}
        <div className="mt-10">
          <div className="mb-8">
            <h3 className="font-bold text-[1.6rem]">카테고리별 사용 금액 TOP 5</h3>
          </div>
          <BorderBox>
            {
              topCategoryItems.map((element, index) => {
                return (
                  <div key={index} onClick={() => navigate(`/category-top5/${index}`)} className="cursor-pointer">
                    <div className={`flex items-center gap-6 ${index != topCategoryItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <p className={`text-[1.5rem] font-bold pl-4
                        ${index == 0 ? 'text-[#FF0000]' : index == topCategoryItems.length - 1 ? 'text-[#138FEF]' : 'text-[#4A4A4A]'}`}>TOP {index + 1}</p>
                      <ConsumptionCategory amount={element.amount} iconSrc={element.iconSrc} label={element.label} bgColor={element.bgColor} percentage={element.percentage} isBorder={false} />
                    </div>
                  </div>
                )
              })
            }
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
            {cardBannerItems.map((element, index) => {
              return (
                <div key={index} onClick={() => navigate('/card-recommend')} className="block mt-6 cursor-pointer">
                  <img src={element.src} alt={`카드배너${index + 1}`} height={88} />
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </DefaultDiv>
  )
}

export default HomeView;