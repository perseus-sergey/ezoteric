import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

export function StopIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H13V13H3V3Z"
        fill="currentColor"
      />
    </SeoSVG>
  );
}
