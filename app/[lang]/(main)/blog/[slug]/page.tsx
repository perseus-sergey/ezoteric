import * as React from 'react';

import BottomInfoPanel from '@/components/custom/BottomInfoPanel';
import DangerHtml from '@/components/custom/DangerHtml';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { getArticleBySlug, updateArticleView } from '@/db/queriesArticle';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { getELangKey } from '@/lib/utils/getLanguage';
import { IMG_PROPERTIES } from '@/models/image.model';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import BrCrumb from '@/components/custom/BrCrumb';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { ARTICLE_IMG, NOT_PUBLISHED } from '@/models/article.model';
import { BLOG_H1 } from '@/models/blog.model';
import { Metadata } from 'next';
import { DEFAULT_META_OG } from '@/models/root.model';
import { ELanguage } from '@/models/language.model';
import { generatePostJsonLd } from '@/lib/utils/generatePostJsonLd';
import { INFO_PANEL_CAPTION } from '@/models/infoPanel.model';
import { getImageSrc } from '@/controllers/articles.controller';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

const basesUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: {
  params: TParams;
}): Promise<Metadata> => {
  const p = await params;
  const lang = getELangKey(p.lang);
  const { slug } = p;
  const article = await getArticleBySlug({ lang, slug });
  if (!article) notFound();
  const { title, keywords, description, updatedAt } = article;

  return {
    metadataBase: new URL(basesUrl),
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

  const article = await getArticleBySlug({ lang, slug });

  if (!article) notFound();

  const {
    title,
    text,
    description,
    updatedAt,
    imageSrc,
    viewCount,
    id,
    published,
  } = article;

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
            href: ESegment.BLOG,
          },
          { title },
        ]}
        lang={lang}
      />

      <Title>{title}</Title>

      {isAdmin && (
        <Link
          href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${id}`}
          className="flex items-center gap-4 bg-muted w-fit p-1 rounded-sm text-muted-foreground"
        >
          <PencilLine className="size-5" />
          {!published && <span>Not Published</span>}
        </Link>
      )}

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
        <Image
          className="my-4 mx-auto sm:border-2 border-white sm:shadow-md rounded"
          src={imgSrc}
          alt={ARTICLE_IMG.getAlt(title)[lang]}
          placeholder="blur"
          blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          priority
          {...ARTICLE_IMG.size}
        />
      )}

      <div className="article-text py-8 px-16 bg-tertiary rounded-2xl">
        <DangerHtml text={text} />
      </div>

      <div className="py-1 px-4 sm:w-fit rounded-sm bg-tertiary-gradient">
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePostJsonLd({ lang, article })),
          }}
        />
      </div>
    </article>
  );
}
