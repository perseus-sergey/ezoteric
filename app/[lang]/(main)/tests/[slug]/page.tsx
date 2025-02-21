import * as React from 'react';
import * as motion from 'motion/react-client';

import BottomInfoPanel from '@/components/custom/BottomInfoPanel';
import DangerHtml from '@/components/custom/DangerHtml';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { getELangKey } from '@/lib/utils/getLanguage';
import { IMG_PROPERTIES } from '@/models/image.model';
import { notFound } from 'next/navigation';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import BrCrumb from '@/components/custom/BrCrumb';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { TEST_IMG, NOT_PUBLISHED } from '@/models/test.model';
import { Metadata } from 'next';
import { DEFAULT_META_OG } from '@/models/root.model';
import { ELanguage } from '@/models/language.model';
import { generatePostJsonLd } from '@/lib/utils/generatePostJsonLd';
import { INFO_PANEL_CAPTION } from '@/models/infoPanel.model';
import { getImageSrc } from '@/controllers/articles.controller';
import ValidImage from '@/components/custom/ValidImage';
import SpotifyPlayer from '@/components/custom/SpotifyPlayer';
import EditPostLink from '@/components/custom/EditPostLink';
import { getTestBySlug, updateTestView } from '@/db/queriesTests';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import TestExecution from '@/components/custom/TestExecution';
import { TESTS_CARD_IMAGE, TESTS_H1 } from '@/models/tests.model';
import SimilarArticlesBlock from '@/components/custom/SimilarArticlesBlock';

const { TESTS, CATEGORY, MASTER, ARTICLE_EDIT } = ESegment;

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
  const test = await getTestBySlug(slug, lang);
  if (!test) notFound();
  const { title, keywords, description, updatedAt } = test;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    openGraph: {
      ...DEFAULT_META_OG,
      title,
      description,
      url: `/${lang}/${TESTS}/${slug}`,
      publishedTime: getFormattedDateStrYearFirst(updatedAt),
    },
    alternates: {
      canonical: `/${lang}/${TESTS}/${slug}`,
      languages: {
        en: `/${ELanguage.EN}/${TESTS}/${slug}`,
        uk: `/${ELanguage.UA}/${TESTS}/${slug}`,
      },
    },
  };
};

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);
  const { slug } = p;

  const test = await getTestBySlug(slug, lang);

  if (!test) notFound();

  const {
    h1Text,
    text,
    description,
    updatedAt,
    imageSrc,
    viewCount,
    completedCount,
    id,
    published,
    spotifyId,
    category,
  } = test;

  const currDate = getFormattedDateStrYearFirst(updatedAt);

  const imgSrc = getImageSrc(slug, imageSrc, false, '');

  const isAdmin = await isAdminAuth();

  await updateTestView(id, isAdmin);

  return (
    <article className="relative mx-auto">
      <BrCrumb
        items={[
          {
            title: TESTS_H1[lang],
            href: TESTS,
          },
          { title: h1Text },
        ]}
        lang={lang}
      />

      <Title>{h1Text}</Title>

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
            defaultSrc={TESTS_CARD_IMAGE.defaultImgSrc}
            className="rounded-lg"
            src={imgSrc}
            alt={TEST_IMG.getAlt(h1Text)[lang]}
            placeholder="blur"
            blurDataURL={IMG_PROPERTIES.defaultImgBlur}
            priority
            sizes={`${TEST_IMG.size.width * 0.5}px`}
            {...TEST_IMG.size}
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
        <div className="article-text relative py-8 sm:px-16 px-2 bg-tertiary rounded-2xl">
          {isAdmin && (
            <EditPostLink
              isPublished={published}
              href={`/${lang}/${MASTER}/${TESTS}/${ARTICLE_EDIT}/${id}`}
              isVisible
            />
          )}

          <DangerHtml text={text} />

          <div className="w-full flex justify-center">
            <TestExecution test={test} lang={lang} isAdmin={isAdmin} />
          </div>

          <section className="flex items-center justify-end sm:justify-between gap-2 flex-wrap sm:flex-nowrap">
            <motion.div
              className="list-none"
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -70 }}
              transition={{ type: 'spring' }}
            >
              <Badge variant="outline">
                <Link
                  className="text-nowrap"
                  href={`/${lang}/${TESTS}/${CATEGORY}/${category.slug}`}
                >
                  {category.name}
                </Link>
              </Badge>
            </motion.div>

            <div className="py-1 px-4 flex justify-end whitespace-nowrap">
              <BottomInfoPanel
                lang={lang}
                items={[
                  {
                    caption: INFO_PANEL_CAPTION.views,
                    value: viewCount || 0,
                  },
                  {
                    caption: INFO_PANEL_CAPTION.completed,
                    value: completedCount || 0,
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

      <React.Suspense>
        <SimilarArticlesBlock lang={lang} articleId={id} catId={category.id} />
      </React.Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generatePostJsonLd({ lang, article: test, isTestPage: true })
          ),
        }}
      />
    </article>
  );
}
