import SeoSVG from '@/components/custom/SeoSVG';
import { SVGProps } from 'react';

// Кола
// export function EzotericIcon(props: SVGProps<SVGSVGElement>) {
//   return (
//     <SeoSVG
//       {...props}
//       viewBox="0 0 64 64"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//     >
//       <circle cx="32" cy="32" r="10" />
//       <circle cx="32" cy="16" r="10" />
//       <circle cx="32" cy="48" r="10" />
//       <circle cx="16" cy="32" r="10" />
//       <circle cx="48" cy="32" r="10" />
//       <circle cx="22.63" cy="22.63" r="10" />
//       <circle cx="41.37" cy="22.63" r="10" />
//       <circle cx="22.63" cy="41.37" r="10" />
//       <circle cx="41.37" cy="41.37" r="10" />
//     </SeoSVG>
//   );
// }

// Дерево життя
export function EzotericIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SeoSVG
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="16" cy="24" r="4" />
      <path d="M16 24V16" />
      <path d="M16 16H8" />
      <circle cx="8" cy="12" r="2" />
      <path d="M16 16H24" />
      <circle cx="24" cy="12" r="2" />
      <path d="M16 16V8" />
      <path d="M16 8H12" />
      <circle cx="12" cy="4" r="2" />
      <path d="M16 8H20" />
      <circle cx="20" cy="4" r="2" />
    </SeoSVG>
  );
}
