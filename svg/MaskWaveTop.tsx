import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

export function MaskWaveTop(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG {...props} viewBox="0 0 1000 108">
      <g fill="currentColor">
        <path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity="0.5" />
        <path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity="0.5" />
        <path d="M1000 100C500 100 500 4 0 4V0h1000v100Z" />
      </g>
    </SeoSVG>
  );
}

export function MaskWaveTopSlow(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG {...props} viewBox="0 0 1000 57">
      <g fill="currentColor">
        <path d="M1000 40C500 60 500 30 0 30V0h1000v60Z" opacity="0.5" />
        <path d="M1000 40C500 55 500 15 0 15V0h1000v55Z" opacity="0.5" />
        <path d="M1000 40C500 50 500 1 0 1V0h1000v50Z" />
      </g>
    </SeoSVG>
  );
}
