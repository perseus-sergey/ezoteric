import { ReactNode } from 'react';
import CopyClipboardBtn from './CopyClipboardBtn';
import { TooltipSimple } from './TooltipSimple';

export const CodeBlock = ({
  copyCode,
  children,
}: {
  copyCode: string;
  children?: ReactNode;
}) => {
  return (
    <TooltipSimple content={children ? copyCode : undefined} asChild>
      <div className="relative w-fit bg-muted rounded-md p-2 pr-12">
        {children || (
          <pre className="text-sm overflow-x-auto">
            <code>{copyCode}</code>
          </pre>
        )}

        <CopyClipboardBtn
          iconSize={12}
          value={copyCode}
          title="Copy to clipboard"
          className="size-fit p-2 bg-tertiary/50 hover:bg-tertiary rounded-full absolute right-2 bottom-1/2 translate-y-1/2"
        />
      </div>
    </TooltipSimple>
  );
};
