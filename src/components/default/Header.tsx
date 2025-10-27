import { img } from "@/assets/img";

interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}

const HeaderBar = ({
  title,
  showBack = false,
  showClose = true,
  onBack,
  onClose,
  className = "",
}: HeaderBarProps) => {
  return (
    <header
      className={`
        fixed top-0 left-1/2 transform -translate-x-1/2
        flex items-center justify-between
        w-full h-[4.5rem] max-w-[400px]
        px-5 bg-white
        border-b border-gray-200
        z-50
        pt-[env(safe-area-inset-top)]
        ${className}
      `}
    >
      {/* 왼쪽: 뒤로가기 버튼 */}
      <div className="w-10 flex justify-start">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="flex items-center justify-center"
          >
            <img
              src={img.Vector}
              alt="뒤로가기"
              className="w-5 h-5 object-contain"
            />
          </button>
        )}
      </div>

      {/* 가운데: 타이틀 */}
      <h1 className="flex-1 text-center text-[1.5rem] font-semibold text-gray-900 truncate">
        {title}
      </h1>

      {/* 오른쪽: 닫기 버튼 */}
      <div className="w-10 flex justify-end">
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center justify-center"
          >
            <img
              src={img.BsX}
              alt="닫기"
              className="w-7 h-7 object-contain"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
