import { cn } from "@/lib/utils/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Title = ({ children, className, ...attributes }: Props) => (
  <h1
    style={{
      textShadow: "1px 1px 0px #fff, 2px 2px 3px #999",
    }}
    className={cn(
      "flex flex-wrap sm:flex-nowrap items-center justify-around gap-4 text-primary font-bold font-georgia p-2 sm:p-6 text-center text-2xl sm:text-3xl",
      className,
    )}
    {...attributes}
  >
    {children}
  </h1>
);
