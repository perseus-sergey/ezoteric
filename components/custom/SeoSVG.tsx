interface IProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

export const SeoSVG = ({
  className,
  color = "currentColor",
  viewBox = "0 0 24 24",
  strokeWidth = 1,
  children,
  ...props
}: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      fill="none"
      viewBox={viewBox}
      strokeWidth={strokeWidth}
      stroke={color}
      className={className || "size-6"}
      {...props}
    >
      {children}
    </svg>
  );
};
