import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { INFO_PANEL_CAPTION } from '@/models/infoPanel.model';
import { ELanguage } from '@/models/language.model';
import ArticleCard from './ArticleCard';
import { cutText } from '@/lib/utils/cutText';
import { BLOG_CARD_IMAGE, getSeoCardLinkTitle } from '@/models/blog.model';
import { ESegment } from '@/models/url.model';
import { TArticleLocalized } from '@/db/schema';
import EmptyData from './EmptyData';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { isFileExists } from '@/lib/utils/imagePathValidate';
import Image from 'next/image';
import { IMG_PROPERTIES } from '@/models/image.model';
import { ARTICLE_IMG } from '@/models/article.model';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

interface IArticleListProps {
  lang: ELanguage;
  articleList: TArticleLocalized[] | null;
  isAdmin: boolean;
}

const ArticleList = ({ articleList, lang, isAdmin }: IArticleListProps) =>
  articleList && articleList.length > 0 ? (
    <ul className="space-y-4">
      {articleList.map(
        ({ id, title, description, viewCount, updatedAt, imageName, slug }) => {
          const currDate = getFormattedDateStrYearFirst(updatedAt);
          const imgSrc = `${ARTICLE_IMG.path}${imageName || `${slug}.jpg`}`;
          const imgPath = isFileExists(imgSrc)
            ? imgSrc
            : BLOG_CARD_IMAGE.defaultImgSrc;

          return (
            <li key={id}>
              {isAdmin && (
                <Link href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${id}`}>
                  <PencilLine className="size-4 text-muted-foreground" />
                </Link>
              )}
              <ArticleCard
                lang={lang}
                seoCardLinkTitle={getSeoCardLinkTitle(title)[lang]}
                articleTitle={title}
                image={
                  <Image
                    className="rounded-sm"
                    src={imgPath}
                    placeholder="blur"
                    blurDataURL={IMG_PROPERTIES.defaultImgBlur}
                    alt={ARTICLE_IMG.getAlt(title)[lang]}
                    {...BLOG_CARD_IMAGE.size}
                  />
                }
                articleDescription={cutText(description, 250)}
                href={`/${lang}/${BLOG}/${slug}`}
                infoPanelItems={[
                  { caption: INFO_PANEL_CAPTION.views, value: viewCount },
                  {
                    caption: INFO_PANEL_CAPTION.date,
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
