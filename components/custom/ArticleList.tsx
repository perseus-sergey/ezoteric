import { ELanguage } from '@/models/language.model';
import ArticleCard from './ArticleCard';
import EmptyData from './EmptyData';
import { TArticleLocalized } from '@/models/article.model';
import EditPostLink from './EditPostLink';

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
              <EditPostLink
                lang={lang}
                isPublished={article.published}
                articleId={article.id}
              />
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <EmptyData lang={lang} />
  );

export default ArticleList;
