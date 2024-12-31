import Link from 'next/link';

interface ISeoLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href: string;
  title: string;
  isTargetBlank?: boolean;
}

const SeoLink = ({
  children,
  className,
  title,
  isTargetBlank = false,
  ...attributes
}: ISeoLinkProps) => (
  <Link
    aria-label={title}
    className={className}
    target={isTargetBlank ? '_blank' : undefined}
    rel={isTargetBlank ? 'noopener noreferrer' : undefined}
    {...attributes}
  >
    {children}
  </Link>
);

export default SeoLink;
