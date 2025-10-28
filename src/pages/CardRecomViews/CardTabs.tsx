import React, { useState, useRef, useEffect } from 'react';

type CardType = '신용카드' | '체크카드';

interface CardTabsProps {
  onChange?: (selected: CardType) => void; // 선택값을 반환
}

const CardTabs: React.FC<CardTabsProps> = ({ onChange }) => {
  const [selected, setSelected] = useState<CardType>('신용카드');
  const tabRefs = useRef<HTMLButtonElement[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState<{left: number, width: number}>({left: 0, width: 0});

  const tabItemList: CardType[] = ["신용카드", "체크카드"];

  useEffect(() => {
    const index = tabItemList.indexOf(selected);
    const currentTab = tabRefs.current[index];
    if (currentTab) {
      setUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth
      });
    }
  }, [selected]);

  const handleClick = (element: CardType) => {
    setSelected(element);
    if (onChange) onChange(element); // 선택값 전달
  }

  return (
    <div className="mt-3 relative flex border-b-[3px] border-[#F2F2F2] w-full mx-auto max-w-[24rem]">
      {tabItemList.map((element, index) => (
        <button
          key={element}
          ref={el => tabRefs.current[index] = el!}
          className={`flex-1 py-5 text-center font-medium text-[1.4rem] 
            ${selected === element ? 'text-[#8BC34A]' : 'text-gray-500'}`}
          onClick={() => handleClick(element)}
        >
          {element}
        </button>
      ))}
      {/* 밑줄 이동 div */}
      <div
        className="absolute bottom-0 -mb-1 h-1 bg-[#8BC34A] transition-all duration-200"
        style={{
          left: underlineStyle.left,
          width: '50%'
        }}
      />
    </div>
  );
};

export default CardTabs;
