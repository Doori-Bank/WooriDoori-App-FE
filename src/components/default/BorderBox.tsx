const BorderBox = ({
  children,
  borderColor = "border-gray-300",
  bgColor = "bg-white",
  borderRadius = "rounded-xl",
  padding = "p-4",
  shadow = "shadow-sm",
  flex,
}: {
  children: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  borderRadius?: string;
  padding?: string;
  shadow?: string;
  flex? : string;
}) => {
  const flexClass = flex === "" ? "" : (flex || "flex-1");
  
  return (
    <div
      className={`${borderColor} ${bgColor} ${borderRadius} ${padding} ${shadow} border ${flexClass}`}
    >
      {children}
    </div>
  );
};

export default BorderBox;
