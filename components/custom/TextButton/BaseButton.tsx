interface IBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children?: React.ReactNode;
}

export const BaseButton = ({
  ariaLabel,
  children,
  className,
  ...attributes
}: IBtnProps) => (
  <button
    aria-label={ariaLabel}
    title={ariaLabel}
    className={className}
    type="button"
    role="button"
    {...attributes}
  >
    {children && children}
  </button>
);
