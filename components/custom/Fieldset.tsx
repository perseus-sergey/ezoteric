import { cn } from '@/lib/utils/utils';

interface IFieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  children: React.ReactNode;
  legendText: string;
}

const Fieldset = ({
  children,
  legendText,
  className,
  ...attributes
}: IFieldsetProps) => (
  <fieldset className={cn('rounded-md border', className)} {...attributes}>
    <legend className={'px-2 ml-4 text-stone-600'}>{legendText}</legend>

    {children}
  </fieldset>
);

export default Fieldset;
