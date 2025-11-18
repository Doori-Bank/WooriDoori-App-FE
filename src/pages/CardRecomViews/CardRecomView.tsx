
import '@/styles/report/animations.css'
import Card from "@/components/card/Card";
import ReportLayout from "@/components/report/ReportLayout";
import { useNavigate, useLocation } from "react-router-dom";
import CardTabs from "./CardTabs";
import { img } from "@/assets/img";
import CardRankItem from '@/components/card/CardRankItem';

const CardRecomView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = "석기";
  
  // 리포트에서 전달받은 월 정보 (예: 10)
  const reportMonth = location.state?.month as number | undefined;

  const cardList = [
    {
      rank: 1,
      src: img.testCard,
      title: '네이버페이\n우리카드 체크',
      content: '네이버페이  1% 적립',
      url: '',
    },
    {
      rank: 2,
      src: img.testCard,
      title: "카드의정석\nCOOKIE CHECK",
      content: '네이버페이  1% 적립',
      url: '',
    },
    {
      rank: 3,
      src: img.testCard,
      title: '위비트래블\n체크카드',
      content: '해외가맹점 2~1% 캐시백',
      url: '',
    },
    {
      rank: 4,
      src: img.testCard,
      title: '카드의정석\n오하CHECK',
      content: '온라인 쇼핑 5% 캐시백',
      url: '',
    },

  ];

  const onClick = () => {
    // 리포트의 월 정보를 "YYYY.MM" 형식으로 변환
    if (reportMonth) {
      const currentYear = new Date().getFullYear();
      const monthString = reportMonth.toString().padStart(2, '0');
      const monthKey = `${currentYear}.${monthString}`;
      
      navigate("/achievement/detail", {
        state: {
          data: { month: monthKey },
          from: "report"
        }
      });
    } else {
      // 월 정보가 없으면 기본값으로 이동
      navigate("/achievement/detail", {
        state: {
          data: { month: undefined },
          from: "report"
        }
      });
    }
  };

  return (
    <ReportLayout mainText={`${name}님 소비에 딱 맞는 카드`} showClose={false}  onBack={()=>window.history.back()} buttonText={"확인"} 
      onButtonClick={ onClick}>
      <div className='w-full'>
        <p className="text-[1.2rem] text-[#A39C9C] -mt-5">소비패턴에 맞는카드{cardList.length}개를 가져와봤어요</p>
        <CardTabs onChange={(value) => { console.log(value) }} />

        <div className="w-full mt-20 pb-20 border-b-[0.2rem] border-[#E4EAF0]">
          <Card rank={cardList[0].rank} buttonOnClick={() => { }} buttonText="신청하기" cardImageSrc={cardList[0].src} subtitle={cardList[0].content} title={cardList[0].title} />
        </div>

        <div>
          {cardList.map((element, index) => {

            return 0 == index ? null : <div className='mt-10'><CardRankItem imageSrc={element.src} rank={element.rank} subtitle='' title={element.title} description={element.content} /></div>
          })}
        </div>
      </div>
    </ReportLayout>
  )
}

export default CardRecomView;