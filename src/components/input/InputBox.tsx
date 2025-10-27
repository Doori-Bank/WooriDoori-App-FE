interface InputBoxProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  borderColor?: string; // Tailwind 클래스명 ex) 'border-green-400'
  textColor?: string;   // Tailwind 클래스명 ex) 'text-gray-800'
  bgColor?: string;     // Tailwind 클래스명 ex) 'bg-white'
  focusColor?: string;  // Tailwind 클래스명 ex) 'focus:ring-green-300'
  disabled?: boolean;
  type? :string;
}

const InputBox = ({
  value,
  onChange,
  placeholder = "",
  borderColor = "border-gray-300",
  textColor = "text-gray-800",
  bgColor = "bg-white",
  focusColor = "focus:ring-green-300",
  disabled = false,
  type = "text"
}: InputBoxProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full max-w-[33rem] sm:max-w-[33.5rem] px-4 py-3 rounded-lg outline-none border 
        ${borderColor} ${textColor} ${bgColor} 
        ${focusColor} transition
        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
      `}
    />
  );
};

export default InputBox;
