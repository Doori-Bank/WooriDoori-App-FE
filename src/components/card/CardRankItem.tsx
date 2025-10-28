import { img } from "@/assets/img";
import React from "react";

interface CardRankItemProps {
    rank: number;               // 순위 (예: 2)
    title: string;              // 제목 (예: 카드의정석)
    subtitle: string;           // 부제목 (예: COOKIE CHECK)
    description?: string;       // 설명 (예: 네이버페이 1% 적립)
    imageSrc: string;           // 이미지 경로
    onClick?: () => void;       // 클릭 이벤트
}

const CardRankItem: React.FC<CardRankItemProps> = ({
    rank,
    title,
    subtitle,
    description,
    imageSrc,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-3 bg-white rounded-xl transition cursor-pointer"
        >
            {/* 왼쪽 이미지 */}
            <img
                src={imageSrc}
                alt={title}
                className="w-[5rem] h-[8.5rem] object-fill"
            />

            {/* 오른쪽 텍스트 */}
            <div className="flex-1 ml-4 text-start">
                <div className="text-[1.6rem] font-semibold text-gray-800">{rank}위</div>
                <div className="text-[1.4rem] font-medium text-gray-900 whitespace-pre-line">{title}</div>
                <div className="text-[1.4rem] font-medium text-gray-900 whitespace-pre-line">{subtitle}</div>
                {description && (
                    <div className="text-[1.2rem] text-[#A39C9C] mt-3">{description}</div>
                )}
            </div>

            {/* 화살표 아이콘 */}
            <img src={img.grayCheckRightIcon} alt=">" />
        </div>
    );
};

export default CardRankItem;
