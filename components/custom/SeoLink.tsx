import Link from "next/link";

interface ISeoLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href: string;
  title: string;
}

const SeoLink = ({
  children,
  className,
  title,
  ...attributes
}: ISeoLinkProps) => (
  <Link {...attributes} aria-label={title} className={className}>
    {children}
  </Link>
);

export default SeoLink;

// <Link {...attributes} aria-label={title} title={title} className={className}>
