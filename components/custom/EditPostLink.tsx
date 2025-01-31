import { ELanguage } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { Badge } from '../ui/badge';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

const EditPostLink = ({
  articleId,
  isPublished,
  lang,
}: {
  articleId: number;
  isPublished?: boolean;
  lang: ELanguage;
}) => (
  <>
    <Link
      className="group-hover:visible invisible hover:opacity-70 absolute left-2 top-2 flex bg-muted w-fit p-1 rounded-sm text-muted-foreground"
      href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${articleId}`}
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
