const BorderBox = ({
  children,
  borderColor = "border-gray-300",
  bgColor = "bg-white",
  borderRadius = "rounded-xl",
  padding = "p-4",
  shadow = "shadow-sm",
  flex = "flex-1",
}: {
  children: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  borderRadius?: string;
  padding?: string;
  shadow?: string;
  flex? : string;
}) => {
  return (
    <div
      className={`${borderColor} ${bgColor} ${borderRadius} ${padding} ${shadow} border ${flex}`}
    >
      {children}
    </div>
  );
};

export default BorderBox;
