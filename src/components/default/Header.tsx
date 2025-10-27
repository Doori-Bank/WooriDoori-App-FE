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
        relative
        flex items-center justify-between
        w-full h-[4.5rem]
        px-0 bg-white
        border-b border-gray-200
        ${className}
      `}
    >
      {/* 왼쪽: 뒤로가기 버튼 */}
      <div className="flex justify-start pl-5 w-10">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="flex justify-center items-center"
          >
            <img
              src={img.Vector}
              alt="뒤로가기"
              className="object-contain w-5 h-5"
            />
          </button>
        )}
      </div>

      {/* 왼쪽: 타이틀 */}
      <h1 className="flex-1 text-left text-[1.9rem] font-semibold text-gray-900 truncate -ml-10">
        {title}
      </h1>

      {/* 오른쪽: 닫기 버튼 */}
      <div className="flex justify-end pr-5 w-10">
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex justify-center items-center"
          >
            <img
              src={img.BsX}
              alt="닫기"
              className="object-contain w-7 h-7"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
