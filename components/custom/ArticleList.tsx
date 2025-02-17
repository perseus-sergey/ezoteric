import { ELanguage } from '@/models/language.model';
import ArticleCard from './ArticleCard';
import EmptyData from './EmptyData';
import { TArticleLocalized } from '@/models/article.model';
import EditPostLink from './EditPostLink';
import { ESegment } from '@/models/url.model';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

interface IArticleListProps {
  lang: ELanguage;
  articleList: TArticleLocalized[] | null;
  isAdmin: boolean;
  searchQuery?: string;
}

const ArticleList = ({
  articleList,
  lang,
  isAdmin,
  searchQuery,
}: IArticleListProps) =>
  articleList && articleList.length > 0 ? (
    <ul className="space-y-4">
      {articleList.map((article) => {
        return (
          <li key={article.id} className="relative group">
            <ArticleCard lang={lang} article={article} />

            {isAdmin && (
              <EditPostLink
                isPublished={article.published}
                href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${article.id}`}
              />
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <EmptyData lang={lang} queryString={searchQuery} />
  );

export default ArticleList;
