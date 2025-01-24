import { ELanguage } from '@/models/language.model';
import ArticleCard from './ArticleCard';
import { ESegment } from '@/models/url.model';
import { TArticleLocalized } from '@/db/schema';
import EmptyData from './EmptyData';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';

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
          <li key={article.id}>
            {isAdmin && (
              <Link
                className="flex items-center gap-4 bg-muted w-fit p-1 rounded-sm text-muted-foreground"
                href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${article.id}`}
              >
                <PencilLine className="size-5" />
                {!article.published && <span>Not Published</span>}
              </Link>
            )}
            <ArticleCard lang={lang} article={article} />
          </li>
        );
      })}
    </ul>
  ) : (
    <EmptyData lang={lang} />
  );

export default ArticleList;
