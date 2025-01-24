import { LoaderIcon } from '@/components/custom/icons';
import { cn } from '@/lib/utils/utils';
import { SVGProps } from 'react';

export function LoadingAnimated({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <LoaderIcon
      focusable="false"
      className={cn('animate-spin', className)}
      aria-live="polite"
      role="status"
      {...props}
    />
  );
}
