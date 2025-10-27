interface BackButtonProps {
  size?: number; // px 단위
  disabled?: boolean;
  onClick?: () => void; // 클릭 이벤트
}

const BackButton = ({ size = 24, disabled = false, onClick }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        rounded-full border border-gray-300 bg-white
        transition-all duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
      `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="gray"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%]"
      >
        <polyline points="15 6 9 12 15 18" />
      </svg>
    </button>
  );
};

export default BackButton;
