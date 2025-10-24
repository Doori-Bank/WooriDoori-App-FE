import DefaultButton from "@/components/button/DefaultButton";
import Header from "@/components/default/Header";
import DefaultDiv from "@/components/default/DefaultDiv";

interface ReportLayoutProps {
    title?: string; // 상단 헤더 제목 (기본: 소비 리포트)
    mainText: string; // 중앙 메인 문구
    children?: React.ReactNode; // 리포트별 그래프나 이미지
    buttonText?: string; // 버튼 문구 (기본: 다음)
    onButtonClick?: () => void; // 버튼 클릭 동작
    showClose?: boolean;
    showBack?: boolean;
}

const ReportLayout = ({
    title = "소비 리포트",
    mainText,
    children,
    buttonText = "다음",
    onButtonClick,
    showClose = true,
    showBack = true,
}: ReportLayoutProps) => {
    return (
        <DefaultDiv>
            {/* ✅ 상단 헤더 */}
            <Header title={title} showBack={showBack} showClose={showClose} />

            {/* ✅ 본문 */}
            <main className="flex flex-col items-center justify-end min-h-[calc(100vh-8rem)] px-6 py-6 text-center">
                {/* 메인 문구 */}
                <div className="mt-20 mb-7">
                    <h1 className="text-[1.9rem] font-semibold text-gray-900 leading-snug whitespace-pre-line">
                        {mainText}
                    </h1>
                </div>

                {/* 중앙 컨텐츠 (그래프, 이미지 등) */}
                <div className="flex-1 flex items-center justify-center w-full">
                    {children}
                </div>

                {/* 하단 버튼 */}
                <div className="fixed bottom-[2rem] w-full max-w-[32rem]">
                    <DefaultButton text={buttonText} onClick={onButtonClick} />
                </div>

            </main>
        </DefaultDiv>
    );
};

export default ReportLayout;
