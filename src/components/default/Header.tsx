import { img } from "@/assets/img";

interface HeaderBarProps {
  title: string;
  isShowBack?: boolean;
  isShowClose?: boolean;
  isShowSetting?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onClickSetting?: () => void;
  className?: string;
  isMainTitle?: boolean,

  
  children?: React.ReactNode,
}

const HeaderBar = ({
  title,
  isShowBack = false,
  isShowClose = true,
  isShowSetting = false,
  onBack,
  onClose,
  onClickSetting,
  className = "",
  isMainTitle = false,
  children,
}: HeaderBarProps) => {
  return (
    <header
      className={`flex fixed top-0 left-1/2 justify-between items-center px-5 w-full bg-white transform -translate-x-1/2 h-[6rem] max-w-[400px] z-[99] pt-[env(safe-area-inset-top)] ${className}`}
    >
      {/* 왼쪽: 뒤로가기 버튼 */}
      {isShowBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex flex-1 justify-center items-center h-full max-w-10"
        >
          <img src={img.Vector} alt="뒤로가기" className="object-contain h-6 w-15" />
        </button>
      )}

      {/* 가운데 타이틀 (항상 중앙 고정) */}
      <div className={` ${isMainTitle  ? 'left-10' : 'left-1/2 -translate-x-1/2'} absolute max-w-[60%] text-center`}>
        <h1
          className={`
            font-semibold text-gray-900 truncate
            ${isMainTitle ? "text-[2rem]" : "text-[1.7rem]"}
          `}
        >
          {title}
        </h1>
      </div>

      {/* 오른쪽 영역 (닫기/설정 자리) */}
      <div className="flex gap-2 items-center ml-auto">
        {isShowSetting && (
          <button
            type="button"
            onClick={onClickSetting}
            aria-label="설정"
            className="flex items-center justify-center w-[2.5rem] h-[2.5rem]"
          >
            <img
              src={img.settingIcon}
              alt="설정"
              className="object-contain w-[1.75rem] h-[1.75rem]"
            />
          </button>
        )}

        {isShowClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center justify-center w-[2.5rem] h-[2.5rem]"
          >
            <img
              src={img.BsX}
              alt="닫기"
              className="object-contain w-[2rem] h-[2rem]"
            />
          </button>
        )}
      </div> 
      
      {
        children
      }

    </header>
  );
};

export default HeaderBar;