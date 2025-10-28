import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import Header from "@/components/default/Header";
import SubText from "@/components/text/SubText";
import { img } from "@/assets/img";

// ✅ 두리 상태별 이미지
import dooriHeart from "@/assets/doori/doori_heart.png";
import doori_frustrated from "@/assets/doori/doori_frustrated.png";
import doori_angry from "@/assets/doori/doori_angry.png";

export default function AchievementDetailView() {
    const location = useLocation();
    const data = location.state?.data;
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleClose = () => {
        navigate("/");
    };

    // ✅ 더미 히스토리 데이터 (나중에 백엔드 연동)
    const mockHistory = [
        { month: "2025.02", percent: 25, comment: "좋아요! 이대로만 유지해요 🌱" },
        { month: "2025.03", percent: 40, comment: "조금 과소비했어요 💸" },
        { month: "2025.04", percent: 80, comment: "절약모드 필요해요 ⚠️" },
    ];

    // ✅ 현재 인덱스 관리
    const initialIndex =
        mockHistory.findIndex((item) => item.month === data?.month) || 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const currentData = mockHistory[currentIndex];
    const percent = currentData.percent;
    const comment = currentData.comment;
    const score = 100 - percent;
    const consumption = 120000;

    const top5 = [
        { icon: img.food, price: 330314, color: "#FF715B" },
        { icon: img.traffic, price: 330314, color: "#34D1BF" },
        { icon: img.shopping, price: 330314, color: "#345BD1" },
        { icon: img.education, price: 330314, color: "#969191" },
        { icon: img.residence, price: 330314, color: "#FFF1D6" },
    ];

    // ✅ 상태별 구분
    let state: "good" | "normal" | "bad" = "normal";
    if (score >= 70) state = "good";
    else if (score >= 50) state = "normal";
    else state = "bad";

    const { color, doolyImg } =
        state === "good"
            ? {
                color: "text-[#1BC277]",
                doolyImg: dooriHeart,
            }
            : state === "normal"
                ? {
                    color: "text-[#FFC642]",
                    doolyImg: doori_frustrated,
                }
                : {
                    color: "text-[#FD5D42]",
                    doolyImg: doori_angry,
                };

    // ✅ 월 이동 핸들러
    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };
    const handleNext = () => {
        if (currentIndex < mockHistory.length - 1)
            setCurrentIndex((prev) => prev + 1);
    };

    // ✅ percent → 시침 각도 변환 함수 (-90° ~ +90°)
    const percentToDeg = (p: number) => -90 + p * 1.8;

    return (
        <DefaultDiv>
            <Header
                title="달성도"
                showBack={true}
                showClose={true}
                onBack={handleBack}
                onClose={handleClose}
            />


            <div className="flex flex-col h-full px-6 pt-20 pb-10 gap-8">
                {/* 제목 */}
                <div className="text-left">
                    <SubText text="석기님의 현재 달성도에 대해 알려드릴게요" />
                </div>

                {/* ✅ 월 선택 + 점수 */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 text-gray-600 text-[1.6rem] mb-3 font-semibold">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className={`transition ${currentIndex === 0
                                ? "text-gray-300 cursor-default"
                                : "hover:text-black"
                                }`}
                        >
                            ◀
                        </button>
                        <span>{currentData.month}</span>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === mockHistory.length - 1}
                            className={`transition ${currentIndex === mockHistory.length - 1
                                ? "text-gray-300 cursor-default"
                                : "hover:text-black"
                                }`}
                        >
                            ▶
                        </button>
                    </div>

                    {/* ✅ 점수 박스 */}
                    <div className="w-full border rounded-2xl py-10 flex flex-col items-center justify-center relative">
                        {/* 왼쪽 폭죽 */}
                        <img
                            src={img.fireworkLeft}
                            alt="왼쪽폭죽"
                            className="absolute left-4 top-4 w-[7rem] h-[7rem]"
                        />

                        {/* 오른쪽 폭죽 */}
                        <img
                            src={img.fireworkRight}
                            alt="오른쪽폭죽"
                            className="absolute right-4 top-[9rem] w-[7rem] h-[7rem]"
                        />

                        {/* 점수 */}
                        <p className="text-[3.5rem] font-extrabold text-gray-900 mt-2">
                            {score}점
                        </p>

                        {/* 저울 */}
                        <img
                            src={img.scale}
                            alt="저울"
                            className="w-[4rem] h-[4rem] mt-3 object-contain"
                        />
                    </div>
                </div>

                {/* ✅ 소비 요약 */}
                <div className="flex justify-around text-center mt-2">
                    <div>
                        <p className="text-gray-500 text-[1.3rem]">이번달 소비</p>
                        <p className="font-bold text-[1.4rem]">
                            ₩{consumption.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-[1.3rem]">과소비 진행도</p>
                        <p className="font-bold text-[1.4rem]">{percent}%</p>
                    </div>
                </div>

                {/* ✅ 두리의 한마디 */}
                <div
                    className={`p-5 rounded-2xl border-2 bg-white transition-colors ${state === "good"
                        ? "border-green-400"
                        : state === "normal"
                            ? "border-yellow-400"
                            : "border-red-400"
                        }`}
                >
                    <p className="text-[1.4rem] font-medium text-left">두리의 한마디</p>
                    <p className="text-[1.2rem] font-light text-left">• {comment}</p>
                </div>

                {/* ✅ 초과 소비 TOP5 + 위험도 + 두리 */}
                <div className="grid grid-cols-2 gap-4 items-start">
                    {/* ✅ 왼쪽: 한달 소비 TOP5 */}
                    <div className="rounded-2xl shadow-sm border border-gray-200 p-5 bg-white">
                        <p className="font-semibold text-gray-800 mb-4 text-[1.2rem]">한달 소비 TOP 5</p>
                        <ul className="space-y-4">
                            {top5.map((item, i) => (
                                <li key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {/* 🔹 배경색 적용 */}
                                        <div
                                            className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            <img
                                                src={item.icon}
                                                className="w-[1.8rem] h-[1.8rem] object-contain"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[1.3rem] text-gray-700 font-semibold">
                                        {item.price.toLocaleString()}원
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ✅ 오른쪽: 위험도 예측 + 두리 */}
                    <div className="flex flex-col items-center gap-4">
                        {/* ✅ 위험도 카드 */}
                        <div className="rounded-2xl shadow-sm border border-gray-200 p-5 bg-white w-[85%] flex flex-col items-center justify-center">
                            <p className="font-semibold text-gray-800 mb-2 text-[1.2rem]">
                                이번달 위험도 예측
                            </p>

                            {/* ✅ 게이지 + 시침 */}
                            <div className="relative w-[11rem] h-[5.5rem] flex items-center justify-center">
                                {/* 반원형 게이지 */}
                                <img
                                    src={img.gauge}
                                    alt="위험도 게이지"
                                    className="w-[85%] h-auto translate-y-[2rem]"
                                />

                                {/* 시침 */}
                                <div
                                    className="absolute bottom-[-1rem] left-1/2 w-[0.35rem] h-[4rem] bg-black rounded-t-full origin-bottom transition-transform duration-500"
                                    style={{
                                        transform: `rotate(${percentToDeg(percent)}deg)`,
                                    }}
                                ></div>
                            </div>

                            {/* 퍼센트 표시 */}
                            <p className="mt-4 text-[1.3rem] font-semibold text-gray-700">
                                {percent}%
                            </p>
                        </div>

                        {/* ✅ 두리 캐릭터 */}
                        <div className="flex justify-center w-full">
                            <img
                                src={doolyImg}
                                alt="두리 캐릭터"
                                className="w-[11rem] h-[11rem] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultDiv>
    );
}
