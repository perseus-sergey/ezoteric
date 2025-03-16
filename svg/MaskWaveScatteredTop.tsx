import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

export function MaskWaveScatteredTopSimple(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG {...props} viewBox="0 0 1000 45">
      <path
        fill="currentColor"
        d="M1000 0H0v45C60 20 110 4 200 2c250 0 250 40 500 40 125 0 190-24 300-35V0Z"
      />
    </SeoSVG>
  );
}

export function MaskWaveScatteredTop(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG {...props} viewBox="0 0 1000 100">
      <g fill="currentColor">
        <path d="M0 1v99c134.3 0 153.7-99 296-99H0Z" opacity="0.5" />
        <path
          d="M1000 4v86C833.3 90 833.3 3.6 666.7 3.6S500 90 333.3 90 166.7 4 0 4h1000Z"
          opacity="0.5"
        />
        <path d="M617 1v86C372 119 384 1 196 1h421Z" opacity="0.5" />
        <path d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z" />
      </g>
    </SeoSVG>
  );
}
