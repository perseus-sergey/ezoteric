import { cn } from '@/lib/utils/utils';

interface IProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

export default function SeoSVG({
  className,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  strokeWidth = 0,
  children,
  ...props
}: IProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      fill="none"
      viewBox={viewBox}
      strokeWidth={strokeWidth}
      stroke={color}
      className={cn('size-6', className)}
      {...props}
    >
      {children}
    </svg>
  );
}
