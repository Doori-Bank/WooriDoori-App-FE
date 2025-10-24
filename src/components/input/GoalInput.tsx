interface GoalInputProps {
  value: string;
  onChange: (value: string) => void; // 숫자 값만 부모로 전달
  placeholder?: string;
}

const GoalInput: React.FC<GoalInputProps> = ({ value, onChange, placeholder }) => {
  // 숫자 → 콤마 포맷 함수
  const formatNumber = (val: string) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // onChange 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (/^\d*$/.test(rawValue)) {
      onChange(rawValue); // 숫자만 전달
    }
  };

  return (
    <div className="w-full max-w-[30rem] flex items-center border-b border-gray-400 pb-1">
      {/* 입력창 */}
      <input
        type="text"
        value={formatNumber(value)}
        onChange={handleChange}
        placeholder={placeholder || "금액을 입력해주세요"}
        className="
          w-full bg-transparent outline-none
          text-gray-900 text-xl font-semibold
          placeholder:text-gray-400
        "
        inputMode="numeric"
      />

      {/* 단위 */}
      <span className="ml-2 text-[#B6B6B6] text-xl font-medium leading-none whitespace-nowrap">
        만원
      </span>
    </div>
  );
};

export default GoalInput;
