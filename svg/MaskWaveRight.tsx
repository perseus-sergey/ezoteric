import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

export function MaskWaveRight(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG {...props} viewBox="0 0 100 1008">
      <g fill="currentColor">
        <path d="M0 0C0 500 36 500 36 1000H100V0H0Z" opacity=".5"></path>
        <path d="M0 0C0 500 66 500 66 1000H100V0H0Z" opacity=".5"></path>
        <path d="M0 0C0 500 96 500 96 1000H100V0H0Z"></path>
      </g>
    </SeoSVG>
  );
}
