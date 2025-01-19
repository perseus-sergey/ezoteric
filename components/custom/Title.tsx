import { cn } from '@/lib/utils/utils';

interface ITitle extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  titleType?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const Title = ({
  children,
  titleType = 'h1',
  className,
  ...attributes
}: ITitle) => {
  const TitleType = titleType;

  return (
    <TitleType
      className={cn(
        'mx-auto font-bold font-georgia px-4 sm:px-8 py-2 sm:py-6 text-center text-2xl sm:text-3xl bg-tertiary-gradient rounded-lg',
        className
      )}
      {...attributes}
    >
      {children}
    </TitleType>
  );
};
