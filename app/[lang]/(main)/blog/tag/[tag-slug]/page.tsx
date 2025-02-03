import BlogPage from '@/components/custom/BlogPage';
import { getArticlesChunk } from '@/db/queriesArticle';
import { getELangKey } from '@/lib/utils/getLanguage';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { validSearchParam } from '@/lib/utils/validSearchParam';
import {
  BLOG_PAGINATION_PARAMS,
  BLOG_H1,
  META_BLOG,
  META_BLOG_TAG,
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

const { perPage } = BLOG_PAGINATION_PARAMS;
const { BLOG, TAG_SLUG, LANG, TAG } = ESegment;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 24 hours

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: TParams;
  searchParams: TSearchParams;
}): Promise<Metadata> => {
  const p = await params;
  const sParams = await searchParams;
  const lang = getELangKey(p[LANG]);
  const tagSlug = p[TAG_SLUG];

  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const isAdmin = await isAdminAuth();

  const { tagName } = await getArticlesChunk(
    0,
    perPage,
    lang,
    isAdmin,
    searchQuery,
    tagSlug
  );

  const meta = tagName ? META_BLOG_TAG[lang](tagName) : META_BLOG[lang]();

  return {
    metadataBase: new URL(baseUrl),
    ...meta,
    openGraph: {
      ...DEFAULT_META_OG,
      ...meta,
      url: `/${lang}/${BLOG}/${TAG}/${tagSlug}`,
    },
    alternates: {
      canonical: `/${lang}/${BLOG}/${TAG}/${tagSlug}`,
      languages: {
        en: `/${ELanguage.EN}/${BLOG}/${TAG}/${tagSlug}`,
        uk: `/${ELanguage.UA}/${BLOG}/${TAG}/${tagSlug}`,
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
  const lang = getELangKey(p[LANG]);
  const tagSlug = p[TAG_SLUG];

  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const isAdmin = await isAdminAuth();

  const { articles, totalCount, tagName } = await getArticlesChunk(
    0,
    perPage,
    lang,
    isAdmin,
    searchQuery,
    tagSlug
  );

  return (
    <BlogPage
      lang={lang}
      isAdmin={isAdmin}
      articles={articles}
      totalCount={totalCount}
      searchParams={sParams}
      pageNumber={1}
      h1Title={`${BLOG_H1[lang]}: ${tagName}`}
      metaData={tagName ? META_BLOG_TAG[lang](tagName) : META_BLOG[lang]()}
      startUrl={`/${lang}/${BLOG}/${TAG}/${tagSlug}`}
      searchQuery={searchQuery}
      breadcrumbsItems={[
        {
          title: BLOG_H1[lang],
          href: BLOG,
        },
        { title: `Tag: «${tagName}»` },
      ]}
    />
  );
}
