import { ELanguage } from '@/models/language.model';
import ArticleCard from './ArticleCard';
import { ESegment } from '@/models/url.model';
import { TArticleLocalized } from '@/db/schema';
import EmptyData from './EmptyData';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { Badge } from '../ui/badge';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

interface IArticleListProps {
  lang: ELanguage;
  articleList: TArticleLocalized[] | null;
  isAdmin: boolean;
}

const ArticleList = ({ articleList, lang, isAdmin }: IArticleListProps) =>
  articleList && articleList.length > 0 ? (
    <ul className="space-y-4">
      {articleList.map((article) => {
        return (
          <li key={article.id} className="relative group">
            <ArticleCard lang={lang} article={article} />

            {isAdmin && (
              <>
                <Link
                  className="group-hover:visible invisible hover:opacity-70 absolute left-2 top-2 flex bg-muted w-fit p-1 rounded-sm text-muted-foreground"
                  href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${article.id}`}
                >
                  <PencilLine className="size-5" />
                </Link>
                {!article.published && (
                  <Badge
                    className="absolute left-10 top-3"
                    variant="destructive"
                  >
                    Not Published
                  </Badge>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <EmptyData lang={lang} />
  );

export default ArticleList;
