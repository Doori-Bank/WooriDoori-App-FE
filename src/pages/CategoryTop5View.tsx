import React, { useEffect, useState } from "react";
import "@/styles/bubbleAnimation.css";
import { img } from "@/assets/img";
import DefaultDiv from "@/components/default/DefaultDiv";
import { useParams } from "react-router-dom";
import { apiList } from "@/api/apiList";
import { getCategoryEnum } from "@/utils/categoryMeta";

type BubbleProps = {
  src: string | null;
  size: number;
  top: string;
  left: string;
  delay?: number;
  name:string | null,
};

interface franchiseResponse {
  
  franchiseId: number,
  fileId: number,
  imageUrl : string,
  franName : string,
}


// 위치 템플릿 (기존 categoryList 그대로 활용)
const bubbleTemplate: BubbleProps[] = [
  { src: null, size: 200, top: "10%", left: "43%", delay: 0.8, name : null },
  { src: null, size: 40, top: "35%", left: "50%", delay: 0.7 , name : null},
  { src: null, size: 150, top: "30%", left: "10%", delay: 0.6 , name : null},
  { src: null, size: 40, top: "45%", left: "10%", delay: 0.5 , name : null},
  { src: null, size: 150, top: "43%", left: "50%", delay: 0.4 , name : null},
  { src: null, size: 40, top: "58%", left: "80%", delay: 0.3 , name : null},
  { src: null, size: 100, top: "55%", left: "25%", delay: 0.15 , name : null},
  { src: null, size: 70, top: "70%", left: "40%", delay: 0 , name : null},
];


const Bubble: React.FC<BubbleProps> = ({ src, size, top, left, delay = 0, name }) => {
  return (
    <div
      className="bubble"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        animationDelay: `${delay}s`,
      }}
    >
    {src? <img src={src} alt="bubble-icon" width={size - 30} height={size - 30} className="bubble-img" /> : null} 
    {/* <p className={`absolute text-center top-0 text-gray-500`} style={{fontSize: `${delay >= 1 ?delay*3:1.2}rem`}}>{name}</p>  */}
    </div>
  );
};

const CategoryTop5View: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [franchiseDataList, setfranchiseDataList] = useState<Array<franchiseResponse> | []>([]);
  const [bubbleList, setBubbleList] = useState<BubbleProps[]>([]);
   
  const categoryLabel = category?.replace("-","/") ?? '';
  
  // 함수 ===================================================
const buildBubbleList = (data: franchiseResponse[]) => {
  return bubbleTemplate.map((template, index) => {
    // 짝수 index일 때만 데이터 매핑
    if (index % 2 === 0) {
      const dataItem = data[index / 2]; // 0 → data[0], 2 → data[1], 4 → data[2]...
      return {
        ...template,
        src: dataItem ? dataItem.imageUrl ?? img.doori_face1 : null,
        name : dataItem ? dataItem.franName : null
      };
    }

    // 홀수 index → 비어 있는 버블
    return {
      ...template,
      src: null,
    };
  });
};



// api 호출 ===========================================
  useEffect(() => {
    if(!category) {
      alert("잘못된 접근입니다. 다시 시도해주세요.");
      return window.history.back();
    }

      let isMounted = true;
      const fetchMainData = async () => {
        setIsLoading(true);
        try {
          const response = await apiList.getFranchiseList(getCategoryEnum(categoryLabel));
          if (isMounted) {
            setfranchiseDataList(response);
            
            // 버블 리스트 정의
            const generated = buildBubbleList(response);
            setBubbleList(generated);
          }
        } catch (error) {
          console.error("메인 데이터 조회 실패:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      fetchMainData();
      return () => {
        isMounted = false;
      };
    }, []);
  


  return (
    <DefaultDiv isPadding={false} isHeader={true} title={`${categoryLabel} 중 가맹점 ${franchiseDataList.length != 0 ? `TOP ${franchiseDataList.length}` : ''}`} onClose={()=>{window.history.back()}}>
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <div className="w-12 h-12 border-4 border-[#4C8B73] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <div className="bubble-scene">
        {/* 배경 구름/잔디 */}
        <div className="ground" />

        {franchiseDataList.length == 0? 
        <div className="bubble absolute w-full h-full">
          <p className="text-[1.5rem] text-bold text-gray-500">소비된 가맹점의<br/> 정보가 없습니다!</p>
        </div>
        :
        
        bubbleList.map((b, i) => (
          <Bubble key={i} {...b} />
        ))}

        {/* 캐릭터 */}
        <div className="character">
          <img src={img.doori_bubbole} alt="두리" width={138} />
        </div>
      </div>
    </DefaultDiv>
  );
};

export default CategoryTop5View;
