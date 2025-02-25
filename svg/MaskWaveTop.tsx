import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

export function MaskWaveTop(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG strokeWidth={1} {...props} viewBox="0 0 1000 108">
      <g fill="currentColor">
        <path
          d="M1000 100C500 100 500 64 0 64V0h1000v100Z"
          opacity="0.5"
        ></path>
        <path
          d="M1000 100C500 100 500 34 0 34V0h1000v100Z"
          opacity="0.5"
        ></path>
        <path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path>
      </g>
    </SeoSVG>
  );
}
