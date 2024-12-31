import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { INFO_PANEL_TITLES } from '@/models/infoPanel.model';
import { ELanguage } from '@/models/language.model';
import ArticleCard from './ArticleCard';
import { cutText } from '@/lib/utils/cutText';
import {
  ARTICLE_CARD_IMAGE,
  ARTICLE_IMG,
  getSeoCardLinkTitle,
} from '@/models/article.model';
import { ESegment } from '@/models/url.model';
import { TArticleLocalized } from '@/db/schema';
import EmptyData from './EmptyData';
import FillingValidImage from './FillingValidImage';

const {
  date: dateTitle,
  views: viewsTitle,
  // comments: commentsTitle,
} = INFO_PANEL_TITLES;

interface IArticleListProps {
  lang: ELanguage;
  articleList: TArticleLocalized[] | null;
}

const ArticleList = ({ articleList, lang }: IArticleListProps) =>
  articleList && articleList.length > 0 ? (
    <ul>
      {articleList.map(
        ({ id, title, description, view, updatedAt, imageName, slug }) => {
          const currDate = getFormattedDateStrYearFirst(updatedAt);

          return (
            <li key={id}>
              <ArticleCard
                // lang={lang}
                seoCardLinkTitle={getSeoCardLinkTitle(title)[lang]}
                articleTitle={
                  <>
                    <div className="bg-[url('/Images/package_network_4729.png')] size-8 shrink-0" />
                    {title}
                  </>
                }
                image={
                  <FillingValidImage
                    image={{
                      src: `${ARTICLE_IMG.path}${imageName}`,
                      ...ARTICLE_CARD_IMAGE.size,
                    }}
                    defaultImage={{
                      src: `${ARTICLE_CARD_IMAGE.defaultImgSrc}`,
                      ...ARTICLE_CARD_IMAGE.size,
                    }}
                    alt={ARTICLE_IMG.getAlt(title)[lang]}
                    isFillParent
                  />
                }
                articleDescription={cutText(description, 250)}
                href={`/${lang}/${ESegment.ARTICLES}/${slug}`}
                infoPanelItems={[
                  { name: viewsTitle[lang], value: view },
                  {
                    name: dateTitle[lang],
                    value: <time dateTime={currDate}>{currDate}</time>,
                  },
                  // { name: commentsTitle[lang], value: comment_count },
                ]}
              />
            </li>
          );
        }
      )}
    </ul>
  ) : (
    <EmptyData lang={lang} />
  );

export default ArticleList;
