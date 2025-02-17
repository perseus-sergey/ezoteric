import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { Badge } from '../ui/badge';
import { clsx } from 'clsx';

const EditPostLink = ({
  href,
  isPublished,
  isVisible = false,
}: {
  href: string;
  isPublished?: boolean;
  isVisible?: boolean;
}) => (
  <>
    <Link
      className={clsx(
        'group-hover:visible hover:opacity-70 absolute left-2 top-2 flex bg-muted w-fit p-1 rounded-sm text-muted-foreground',
        !isVisible && 'invisible'
      )}
      href={href}
    >
      <PencilLine className="size-5" />
    </Link>

    {!isPublished && (
      <Badge className="absolute left-10 top-3" variant="destructive">
        Not Published
      </Badge>
    )}
  </>
);

export default EditPostLink;
