import { CodeBlock } from './CodeBlock';

export const CodeTemplatesForImage = () => (
  <div className="flex gap-4 items-center">
    <CodeBlock
      copyCode={`<div class="flex justify-center items-center flex-wrap lg:flex-nowrap gap-10 px-4">
  <img src="image.jpg" alt="Description" class="mx-auto">
  <p>SomeText</p>
</div>`}
    >
      <div className="flex items-center gap-2 w-fit px-2 py-1 bg-muted-foreground rounded-md">
        <div className="bg-muted rounded-md size-6" />
        <div className="space-y-1">
          <div className="bg-muted rounded-md h-2 w-24" />
          <div className="bg-muted rounded-md h-2 w-24" />
        </div>
      </div>
    </CodeBlock>

    <CodeBlock
      copyCode={`<div class="flex justify-center">
  <img src="image.jpg" alt="Description" class="mx-auto">
</div>`}
    >
      <div className="flex flex-col items-center gap-2 w-fit px-2 py-1 bg-muted-foreground rounded-md">
        <div className="bg-muted rounded-md size-6" />
        <div className="bg-muted rounded-md h-2 w-14" />
        <div className="bg-muted rounded-md h-2 w-24" />
      </div>
    </CodeBlock>
  </div>
);
