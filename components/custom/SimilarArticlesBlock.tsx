import { ELanguage } from '@/models/language.model';
import { getSimilarArticlesByTags, ISimilarArticle } from '@/db/queriesArticle';
import SeoLink from './SeoLink';
import { BLOG_CARD_IMAGE, getSeoCardLinkTitle } from '@/models/blog.model';
import { ESegment } from '@/models/url.model';
import { getImageSrc } from '@/controllers/articles.controller';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import ValidImage from './ValidImage';
import { IMG_PROPERTIES } from '@/models/image.model';
import { ARTICLE_IMG, SIMILAR_ARTICLES } from '@/models/article.model';
import { CalendarCheck2 } from 'lucide-react';
import { getSimilarTestsByCategory } from '@/db/queriesTests';
import { Title } from './Title';
import { SIMILAR_TESTS, TEST_IMG } from '@/models/test.model';
import { getSeoTestLinkTitle } from '@/models/tests.model';

interface IProps {
  articleId: number;
  tagIds?: number[];
  catId?: number;
  lang: ELanguage;
}

const { BLOG, TESTS } = ESegment;

export default async function SimilarArticlesBlock({
  articleId,
  tagIds,
  lang,
  catId,
}: IProps) {
  const similarArticles = tagIds
    ? await getSimilarArticlesByTags(lang, articleId, tagIds)
    : catId
      ? await getSimilarTestsByCategory(lang, articleId, catId)
      : null;

  if (!similarArticles || similarArticles.length === 0) return null;

  return (
    <nav className="mt-4 py-4 bg-tertiary/30 rounded-2xl">
      <Title titleType="h2" className="text-tertiary-foreground">
        {tagIds ? SIMILAR_ARTICLES.title[lang] : SIMILAR_TESTS.title[lang]}
      </Title>
      <ul className="flex flex-wrap gap-4 justify-center">
        {similarArticles.map((similarArticle) => (
          <li key={similarArticle.slug} className="rounded-sm overflow-hidden">
            <ArticleCard
              lang={lang}
              article={similarArticle}
              isTest={!tagIds}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

const ArticleCard = ({
  lang,
  article,
  isTest,
}: {
  lang: ELanguage;
  article: ISimilarArticle;
  isTest: boolean;
}) => {
  const imgSrc = getImageSrc(article.slug, article.imageSrc);
  const currDate = getFormattedDateStrYearFirst(article.updatedAt);

  return (
    <Card className="relative size-72 rounded-none flex flex-col md:flex-row items-center justify-between gap-4 p-4">
      <SeoLink
        href={`/${lang}/${isTest ? TESTS : BLOG}/${article.slug}`}
        title={
          isTest
            ? getSeoTestLinkTitle(article.title)[lang]
            : getSeoCardLinkTitle(article.title)[lang]
        }
      >
        <ValidImage
          defaultSrc={BLOG_CARD_IMAGE.defaultImgSrc}
          sizes={`${BLOG_CARD_IMAGE.size.width * 0.5}px`}
          src={imgSrc}
          placeholder="blur"
          blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          alt={
            isTest
              ? TEST_IMG.getAlt(article.title)[lang]
              : ARTICLE_IMG.getAlt(article.title)[lang]
          }
          fill
        />
      </SeoLink>

      <CardTitle className="absolute bottom-0 inset-x-0 font-georgia bg-gradient-to-t from-80% from-black/50 to-black/5 text-lg font-semibold text-white text-center p-2">
        {article.title}
      </CardTitle>

      <CardContent className="absolute top-0 left-0 flex gap-2 items-center text-sm bg-gradient-to-b from-60% from-black/50 to-black/5 text-white p-2">
        <CalendarCheck2 className="size-4" />
        <time dateTime={currDate}>{currDate}</time>
      </CardContent>

      <CardFooter className="flex-col items-start gap-4"></CardFooter>
    </Card>
  );
};
