const BorderBox = ({
  children,
  borderColor = "border-gray-300",
  bgColor = "bg-white",
  borderRadius = "rounded-xl",
  padding = "p-4",
  shadow = "shadow-sm",
}: {
  children: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  borderRadius?: string;
  padding?: string;
  shadow?: string;
}) => {
  return (
    <div
      className={`${borderColor} ${bgColor} ${borderRadius} ${padding} ${shadow} border`}
    >
      {children}
    </div>
  );
};

export default BorderBox;
