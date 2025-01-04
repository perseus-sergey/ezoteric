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
import Link from 'next/link';
import { PencilLine } from 'lucide-react';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

const {
  date: dateTitle,
  views: viewsTitle,
  // comments: commentsTitle,
} = INFO_PANEL_TITLES;

interface IArticleListProps {
  lang: ELanguage;
  articleList: TArticleLocalized[] | null;
  isAdmin: boolean;
}

const ArticleList = ({ articleList, lang, isAdmin }: IArticleListProps) =>
  articleList && articleList.length > 0 ? (
    <ul>
      {articleList.map(
        ({ id, title, description, view, updatedAt, imageName, slug }) => {
          const currDate = getFormattedDateStrYearFirst(updatedAt);

          return (
            <li key={id}>
              {isAdmin && (
                <Link href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${id}`}>
                  <PencilLine className="size-4 text-muted-foreground" />
                </Link>
              )}
              <ArticleCard
                date={updatedAt}
                // lang={lang}
                seoCardLinkTitle={getSeoCardLinkTitle(title)[lang]}
                articleTitle={
                  <>
                    {/* TODO: Change bg */}
                    <div className="bg-[url('/Images/package_network_4729.png')] size-8 shrink-0" />
                    {title}
                  </>
                }
                image={
                  <FillingValidImage
                    className="rounded-sm"
                    image={{
                      src: `${ARTICLE_IMG.path}${imageName || `${slug}.jpg`}`,
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
                href={`/${lang}/${BLOG}/${slug}`}
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
