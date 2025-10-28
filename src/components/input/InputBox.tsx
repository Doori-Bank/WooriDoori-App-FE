interface InputBoxProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  borderColor?: string; // Tailwind 클래스명 ex) 'border-green-400'
  textColor?: string;   // Tailwind 클래스명 ex) 'text-gray-800'
  bgColor?: string;     // Tailwind 클래스명 ex) 'bg-white'
  focusColor?: string;  // Tailwind 클래스명 ex) 'focus:ring-green-300'
  disabled?: boolean;
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
}: InputBoxProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`flex-1 px-4 py-3 w-full rounded-lg border transition outline-none ${borderColor} ${textColor} ${bgColor} ${focusColor} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
    />
  );
};

export default InputBox;