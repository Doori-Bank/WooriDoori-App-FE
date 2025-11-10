import React from "react";
import "@/styles/bubbleAnimation.css";
import { img } from "@/assets/img";
import DefaultDiv from "@/components/default/DefaultDiv";
import { useParams } from "react-router-dom";

type BubbleProps = {
  src: string | null;
  size: number;
  top: string;
  left: string;
  delay?: number;
};

const Bubble: React.FC<BubbleProps> = ({ src, size, top, left, delay = 0 }) => {
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
    {src? <img src={src} alt="bubble-icon" className="bubble-img" /> : null}  
    </div>
  );
};

const CategoryTop5View: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const categoryList = [
    {
      src: `${img.doori_face1}`,
      size: 70,
      top: "70%",
      left: "40%",
      delay: 0,
    },
    {
      src:  `${img.doori_face1}`,
      size: 100,
      top: "55%",
      left: "25%",
      delay: 0.15,
    },
     {
      src: null,
      size: 40,
      top: "58%",
      left: "80%",
      delay: 0.3,
    },
    {
      src:  `${img.doori_face1}`,
      size: 150,
      top: "43%",
      left: "50%",
      delay: 0.4,
    },
     {
      src: null,
      size: 40,
      top: "45%",
      left: "10%",
      delay: 0.5,
    },
    {
      src:  `${img.doori_face1}`,
      size: 150,
      top: "30%",
      left: "10%",
      delay: 0.6,
    },
     {
      src: null,
      size: 40,
      top: "35%",
      left: "50%",
      delay: 0.7,
    },
    {
      src:  `${img.doori_face1}`,
      size: 200,
      top: "10%",
      left: "43%",
      delay: 0.8,
    },
  ];

  return (
    <DefaultDiv isPadding={false} isHeader={true} title={`${id} 중 가맹점 TOP 5`} onClose={()=>{window.history.back()}}>
      <div className="bubble-scene">
        {/* 배경 구름/잔디 */}
        <div className="ground" />

        {/* 비눗방울들 */}
        {categoryList.map((b, i) => (
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
