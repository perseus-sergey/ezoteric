import { ELanguage } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import * as motion from 'motion/react-client';
import { TTagLocalized } from '@/db/schema';

interface ITagListProps {
  lang: ELanguage;
  tags?:
    | {
        tag: TTagLocalized;
      }[]
    | null
    | undefined;
}

const { BLOG, TAG } = ESegment;

const TagList = ({ tags, lang }: ITagListProps) => {
  return (
    tags &&
    tags.length > 0 && (
      <ul className="flex gap-2 flex-wrap">
        {tags?.map(({ tag }, i) => (
          <motion.li
            key={tag.id}
            className="list-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 * i, type: 'spring' }}
          >
            <Badge variant="outline">
              <Link
                className="text-nowrap"
                href={`/${lang}/${BLOG}/${TAG}/${tag.slug}`}
              >
                {tag.name}
              </Link>
            </Badge>
          </motion.li>
        ))}
      </ul>
    )
  );
};

export default TagList;
