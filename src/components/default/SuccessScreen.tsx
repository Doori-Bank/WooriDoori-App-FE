import DefaultButton from "@/components/button/DefaultButton";

interface SuccessScreentProps {
  imageSrc?: string;
  title: string;
  description?: string;
  infoList?: { label: string; value: string }[];
  buttonText: string;
  onButtonClick: () => void;
}

const SuccessScreen = ({
  imageSrc,
  title,
  description,
  infoList,
  buttonText,
  onButtonClick,
}: SuccessScreentProps) => {
  return (
    <section
      className="
        flex flex-col items-center
        w-full min-h-[calc(100vh-4rem)] px-8 py-10
        bg-white text-center
      "
    >
      {/* ✅ 상단 콘텐츠 (이미지 + 타이틀) */}
      <div className="flex flex-col flex-1 gap-8 justify-center items-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="성공 이미지"
            className="object-contain w-40 h-40"
          />
        ) : (
          <div className="flex justify-center items-center w-40 h-40 bg-gray-100 rounded-full">
            <span className="text-base text-gray-400">이미지 없음</span>
          </div>
        )}

        <div>
          <h1 className="text-[1.9rem] font-semibold text-gray-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 text-[1.05rem]">{description}</p>
          )}
        </div>
      </div>

      {/* ✅ 하단 정보 + 버튼 */}
      <div className="flex flex-col gap-6 w-full">
        {/* 하단 정보 */}
        {infoList && infoList.length > 0 && (
          <div className="px-4 w-full text-gray-600 bg-white">
            {infoList.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-[1.05rem] py-3 border-b border-gray-100"
              >
                <span className="font-medium text-gray-500">{item.label}</span>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center w-full">
          <div className="w-full max-w-[30rem]">
            <DefaultButton text={buttonText} onClick={onButtonClick} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessScreen;
