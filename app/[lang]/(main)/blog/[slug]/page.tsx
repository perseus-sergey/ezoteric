import * as motion from 'motion/react-client';

import BottomInfoPanel from '@/components/custom/BottomInfoPanel';
import DangerHtml from '@/components/custom/DangerHtml';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { getArticleBySlug, updateArticleView } from '@/db/queriesArticle';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { getELangKey } from '@/lib/utils/getLanguage';
import { IMG_PROPERTIES } from '@/models/image.model';
import { notFound } from 'next/navigation';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import BrCrumb from '@/components/custom/BrCrumb';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import {
  ARTICLE_IMG,
  NOT_PUBLISHED,
  SIMILAR_ARTICLES,
} from '@/models/article.model';
import { BLOG_CARD_IMAGE, BLOG_H1 } from '@/models/blog.model';
import { Metadata } from 'next';
import { DEFAULT_META_OG } from '@/models/root.model';
import { ELanguage } from '@/models/language.model';
import { generatePostJsonLd } from '@/lib/utils/generatePostJsonLd';
import { INFO_PANEL_CAPTION } from '@/models/infoPanel.model';
import { getImageSrc } from '@/controllers/articles.controller';
import ValidImage from '@/components/custom/ValidImage';
import SpotifyPlayer from '@/components/custom/SpotifyPlayer';
import EditPostLink from '@/components/custom/EditPostLink';
import TagList from '@/components/custom/TagList';
import SimilarArticlesBlock from '@/components/custom/SimilarArticlesBlock';
import { Suspense } from 'react';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: {
  params: TParams;
}): Promise<Metadata> => {
  const p = await params;
  const lang = getELangKey(p.lang);
  const { slug } = p;
  const article = await getArticleBySlug(slug, lang);
  if (!article) notFound();
  const { title, keywords, description, updatedAt } = article;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    openGraph: {
      ...DEFAULT_META_OG,
      title,
      description,
      url: `/${lang}/${BLOG}/${slug}`,
      publishedTime: getFormattedDateStrYearFirst(updatedAt),
    },
    alternates: {
      canonical: `/${lang}/${BLOG}/${slug}`,
      languages: {
        en: `/${ELanguage.EN}/${BLOG}/${slug}`,
        uk: `/${ELanguage.UA}/${BLOG}/${slug}`,
      },
    },
  };
};

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);
  const { slug } = p;

  const article = await getArticleBySlug(slug, lang);

  if (!article) notFound();

  const {
    title,
    h1,
    text,
    description,
    updatedAt,
    imageSrc,
    viewCount,
    id,
    published,
    spotifyId,
    articleTags,
  } = article;

  const tagIds = articleTags?.map((articleTag) => articleTag.tag.id);

  const currDate = getFormattedDateStrYearFirst(updatedAt);

  const imgSrc = getImageSrc(slug, imageSrc, false, '');

  const isAdmin = await isAdminAuth();

  await updateArticleView(id, isAdmin);

  return (
    <article className="relative mx-auto">
      <BrCrumb
        items={[
          {
            title: BLOG_H1[lang],
            href: BLOG,
          },
          { title },
        ]}
        lang={lang}
      />

      <Title>{h1 || title}</Title>

      {!published && (
        <section
          role="alert"
          aria-live="polite"
          className="max-w-xl mx-auto text-yellow-100 bg-destructive font-georgia text-xl p-6 my-6 border border-slate-400 rounded-lg shadow-md"
        >
          {NOT_PUBLISHED[lang]}
        </section>
      )}

      {description && <TextUnderH1>{description}</TextUnderH1>}

      {!!imgSrc && (
        <div className="size-fit relative my-4 mx-auto sm:border-2 border-white sm:shadow-md sm:rounded-lg">
          <ValidImage
            defaultSrc={BLOG_CARD_IMAGE.defaultImgSrc}
            className="rounded-lg"
            src={imgSrc}
            alt={ARTICLE_IMG.getAlt(title)[lang]}
            placeholder="blur"
            blurDataURL={IMG_PROPERTIES.defaultImgBlur}
            priority
            sizes={`${ARTICLE_IMG.size.width * 0.5}px`}
            {...ARTICLE_IMG.size}
          />

          {spotifyId && (
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              whileInView={{ opacity: 0.6, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                opacity: 0.9,
                width: '50%',
                transition: { duration: 0.2 },
              }}
              className="absolute bottom-0 left-0 p-1"
            >
              <SpotifyPlayer trackId={spotifyId} />
            </motion.div>
          )}
        </div>
      )}

      {text && (
        <div className="article-text relative py-8 sm:px-16 px-4 bg-tertiary rounded-2xl">
          {isAdmin && (
            <EditPostLink
              href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${id}`}
              isPublished={published}
              isVisible
            />
          )}

          <DangerHtml text={text} />

          <section className="flex items-center justify-end sm:justify-between gap-2 flex-wrap sm:flex-nowrap">
            <TagList tags={article.articleTags} lang={lang} />

            <div className="py-1 px-4 flex justify-end whitespace-nowrap">
              <BottomInfoPanel
                lang={lang}
                items={[
                  {
                    caption: INFO_PANEL_CAPTION.views,
                    value: viewCount || 0,
                  },
                  {
                    caption: INFO_PANEL_CAPTION.date,
                    value: <time dateTime={currDate}>{currDate}</time>,
                  },
                ]}
              />
            </div>
          </section>
        </div>
      )}

      {tagIds && tagIds.length > 0 ? (
        <Suspense>
          <SimilarArticlesBlock
            title={SIMILAR_ARTICLES.title[lang]}
            lang={lang}
            articleId={article.id}
            tagIds={tagIds}
            type="articles"
          />
        </Suspense>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePostJsonLd({ lang, article })),
        }}
      />
    </article>
  );
}
