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
      className={`
        fixed top-0 left-1/2 transform -translate-x-1/2
        flex items-center justify-between
        w-full h-[6rem] max-w-[400px]
        px-5 bg-white
        z-1
        pt-[env(safe-area-inset-top)]
        ${className}
      `}
    >
      {/* 왼쪽: 뒤로가기 버튼 */}
      {isShowBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex-1 max-w-10 h-full flex items-center justify-center"
        >
          <img src={img.Vector} alt="뒤로가기" className="object-contain w-15 h-6" />
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
      <div className="ml-auto flex items-center gap-2">
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