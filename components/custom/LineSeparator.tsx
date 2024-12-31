import { twMerge } from 'tailwind-merge';

const LineSeparator = ({ className = '' }) => (
  <hr role="none" className={twMerge('bg-border shrink-0', className)} />
);

export default LineSeparator;
