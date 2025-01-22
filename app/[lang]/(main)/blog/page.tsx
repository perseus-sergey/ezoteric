import ArticleList from '@/components/custom/ArticleList';
import BrCrumb from '@/components/custom/BrCrumb';
import Pagination from '@/components/custom/Pagination';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { getArticlesChunk } from '@/db/queriesArticle';
import { generatePostListJsonLd } from '@/lib/utils/generatePostListJsonLd';
import { getELangKey } from '@/lib/utils/getLanguage';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { validSearchParam } from '@/lib/utils/validSearchParam';
import {
  BLOG_PAGINATION_PARAMS,
  BLOG_H1,
  BLOG_COUNT_CAPTION,
  META_BLOG,
} from '@/models/blog.model';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_OG } from '@/models/root.model';
import {
  ESegment,
  EUrlSearchParam,
  MAIN_URL,
  TParams,
  TSearchParams,
} from '@/models/url.model';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const { perPage, offsetNumber } = BLOG_PAGINATION_PARAMS;
const { BLOG } = ESegment;

const basesUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 24 hours

export const generateMetadata = async ({
  params,
}: {
  params: TParams;
}): Promise<Metadata> => {
  const p = await params;
  const lang = getELangKey(p.lang);

  return {
    metadataBase: new URL(basesUrl),
    ...META_BLOG[lang],
    openGraph: {
      ...DEFAULT_META_OG,
      ...META_BLOG[lang],
      url: `/${lang}/${BLOG}`,
    },
    alternates: {
      canonical: `/${lang}/${BLOG}`,
      languages: {
        en: `/${ELanguage.EN}/${BLOG}`,
        uk: `/${ELanguage.UA}/${BLOG}`,
      },
    },
  };
};

export default async function Page({
  params,
  searchParams,
}: {
  params: TParams;
  searchParams: TSearchParams;
}) {
  const p = await params;
  const sParams = await searchParams;
  const lang = getELangKey(p.lang);

  const page = validSearchParam(EUrlSearchParam.PAGE, sParams) || '1';
  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const { articles, totalCount } = await getArticlesChunk({
    perPage,
    offset: (pageNumber - 1) * perPage,
    searchQuery,
    lang,
  });

  const articlesCount =
    !articles || articles.length === 0 ? 0 : totalCount || 0;
  const totalPages = Math.ceil(articlesCount / perPage);

  const isAdmin = await isAdminAuth();

  const jsonLD = generatePostListJsonLd({
    lang,
    title: META_BLOG[lang].title,
    description: META_BLOG[lang].description,
    posts: articles,
  });

  return (
    <article className="relative mx-auto">
      <BrCrumb items={[{ title: BLOG_H1[lang] }]} lang={lang} />

      <Title>{BLOG_H1[lang]}</Title>

      <TextUnderH1>{META_BLOG[lang].description}</TextUnderH1>

      <Suspense>
        {/* <Filter
          lang={lang}
          idName="article-search-input"
          placeholder={placeholder[lang]}
          labelTitle={labelTitle[lang]}
          searchQueryTitle={EUrlSearchParam.ARTICLE}
        /> */}
      </Suspense>

      <p className="text-tertiary-foreground font-bold bg-tertiary w-fit px-8 py-2 my-2 rounded-sm">{`${BLOG_COUNT_CAPTION[lang]}${articlesCount}`}</p>

      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={offsetNumber}
        totalPages={totalPages}
        searchParams={sParams}
      />

      <ArticleList articleList={articles} lang={lang} isAdmin={isAdmin} />

      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={offsetNumber}
        totalPages={totalPages}
        searchParams={sParams}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLD),
        }}
      />
    </article>
  );
}
