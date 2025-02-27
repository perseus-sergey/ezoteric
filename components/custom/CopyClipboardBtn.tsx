'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  value: string;
  title?: string;
  iconSize?: number;
}

const CopyClipboardBtn = ({
  value,
  iconSize = 12,
  className,
  title,
  ...props
}: IProps) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success('Copied to clipboard!'))
      .catch((err) => toast.error(`Failed to copy: ${err.message}`));
  };

  return (
    <button
      type="button"
      className={className}
      title={title || 'Copy'}
      onClick={handleCopy}
      {...props}
    >
      <Copy size={iconSize} />
    </button>
  );
};

export default CopyClipboardBtn;
