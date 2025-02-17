import { ELanguage } from '@/models/language.model';
import BottomInfoPanel from './BottomInfoPanel';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import SeoLink from './SeoLink';
import { IMG_PROPERTIES } from '@/models/image.model';
import { ARTICLE_IMG, TArticleLocalized } from '@/models/article.model';
import { BLOG_CARD_IMAGE, getSeoCardLinkTitle } from '@/models/blog.model';
import { ESegment } from '@/models/url.model';
import { cutText } from '@/lib/utils/cutText';
import { getImageSrc } from '@/controllers/articles.controller';
import { INFO_PANEL_CAPTION } from '@/models/infoPanel.model';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import ValidImage from './ValidImage';
import TagList from './TagList';

interface IArticleCardProps {
  lang: ELanguage;
  article: TArticleLocalized;
}

const { BLOG } = ESegment;

const ArticleCard = ({ lang, article }: IArticleCardProps) => {
  const imgSrc = getImageSrc(article.slug, article.imageSrc);
  const currDate = getFormattedDateStrYearFirst(article.updatedAt);

  return (
    <Card className="min-h-[410px] flex flex-col md:flex-row items-center justify-between gap-4 p-4">
      <div className="h-full flex flex-col flex-1 justify-between">
        <CardTitle className="p-6">
          <SeoLink
            href={`/${lang}/${BLOG}/${article.slug}`}
            title={getSeoCardLinkTitle(article.title)[lang]}
          >
            {article.title}
          </SeoLink>
        </CardTitle>

        <CardContent>
          <p className="text-muted-foreground">
            {cutText(article.description, 250)}
          </p>
        </CardContent>

        <CardFooter className="flex-col items-start gap-4">
          <TagList tags={article.articleTags} lang={lang} />

          <BottomInfoPanel
            items={[
              {
                caption: INFO_PANEL_CAPTION.views,
                value: article.viewCount,
              },
              {
                caption: INFO_PANEL_CAPTION.date,
                value: <time dateTime={currDate}>{currDate}</time>,
              },
              // { name: commentsTitle[lang], value: comment_count },
            ]}
            lang={lang}
          />
        </CardFooter>
      </div>

      <SeoLink
        href={`/${lang}/${BLOG}/${article.slug}`}
        title={getSeoCardLinkTitle(article.title)[lang]}
      >
        <ValidImage
          defaultSrc={BLOG_CARD_IMAGE.defaultImgSrc}
          className="rounded-sm"
          sizes={`${BLOG_CARD_IMAGE.size.width * 0.7}px`}
          // sizes="(max-width: 768px) 20vw, 10vw"
          src={imgSrc}
          placeholder="blur"
          blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          alt={ARTICLE_IMG.getAlt(article.title)[lang]}
          {...BLOG_CARD_IMAGE.size}
        />
      </SeoLink>
    </Card>
  );
};

export default ArticleCard;
