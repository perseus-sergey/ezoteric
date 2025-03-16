import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  duration?: number;
}

export function LoaderAnimatedInfinity({ duration = 2, ...props }: IProps) {
  return (
    <SeoSVG {...props} viewBox="0 0 300 120">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray="300 385"
        strokeDashoffset="0"
        d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
      >
        <animate
          attributeName="stroke-dashoffset"
          calcMode="spline"
          dur={duration}
          values="685;-685"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        />
      </path>
    </SeoSVG>
  );
}
