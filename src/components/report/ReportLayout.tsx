import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import DefaultDiv from "@/components/default/DefaultDiv";

interface ReportLayoutProps {
    title?: string; // 상단 헤더 제목 (기본: 소비 리포트)
    mainText: string; // 중앙 메인 문구
    children?: React.ReactNode; // 리포트별 그래프나 이미지
    buttonText?: string; // 버튼 문구 (기본: 다음)
    onButtonClick?: () => void; // 버튼 클릭 동작

    showClose?: boolean;
    showBack?: boolean;
    isMainTextCenter?: boolean;

    onBack?: () => void;
    onClose?: () => void;
}

const ReportLayout = ({
    title = "소비 리포트",
    mainText,
    children,
    buttonText = "다음",
    onButtonClick,
    showClose = true,
    showBack = true,
    isMainTextCenter = true,
    onBack, onClose,
}: ReportLayoutProps) => {
    return (
        <DefaultDiv
            isHeader={true}

            title={title}
            isShowBack={showBack}
            isShowClose={showClose}
            isShowSetting={false}
            onBack={onBack}
            onClose={onClose}
            onClickSetting={undefined}
            headerClassName=""
            isMainTitle={false}
        >
            {/* ✅ 본문 */}
            <main className={`flex flex-col justify-end  px-6 py-6 ${isMainTextCenter ? 'text-center items-center' : 'text-left'}`}>
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
                <BottomButtonWrapper>
                    <DefaultButton text={buttonText} onClick={onButtonClick} />
                </BottomButtonWrapper>

            </main>
        </DefaultDiv>
    );
};

export default ReportLayout;
