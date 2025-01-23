import CopyClipboardBtn from './CopyClipboardBtn';

export const CodeBlock = ({ code }: { code: string }) => {
  return (
    <div className="relative w-fit bg-muted rounded-md p-2 pr-12">
      <pre className="text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <CopyClipboardBtn
        iconSize={12}
        value={code}
        title="Copy code"
        className="size-fit p-2 bg-tertiary/50 hover:bg-tertiary rounded-full absolute right-2 bottom-1/2 translate-y-1/2"
      />
    </div>
  );
};
