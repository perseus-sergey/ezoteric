import { getELangKey } from '@/lib/utils/getLanguage';
import BlogPage from '@/components/custom/BlogPage';
import {
  BLOG_H1,
  BLOG_PAGINATION_PARAMS,
  META_BLOG_PAGINATED,
} from '@/models/blog.model';
import { PAGE_CAPTION } from '@/models/breadcrumb.model';
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
import { validSearchParam } from '@/lib/utils/validSearchParam';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { getArticlesChunk } from '@/db/queriesArticle';
const { BLOG, PAGE_ID, PAGE } = ESegment;
const { UA, EN } = ELanguage;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

const { perPage } = BLOG_PAGINATION_PARAMS;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 24 hours

export const generateMetadata = async ({
  params,
}: {
  params: TParams;
}): Promise<Metadata> => {
  const p = await params;
  const lang = getELangKey(p.lang);
  const pageId = parseInt(p[PAGE_ID], 10);

  if (isNaN(pageId)) notFound();

  return {
    metadataBase: new URL(baseUrl),
    ...META_BLOG_PAGINATED[lang](pageId),
    openGraph: {
      ...DEFAULT_META_OG,
      ...META_BLOG_PAGINATED[lang](pageId),
      url: `/${lang}/${BLOG}/${PAGE}/${pageId}`,
    },
    alternates: {
      canonical: `/${lang}/${BLOG}/${PAGE}/${pageId}`,
      languages: {
        en: `/${EN}/${BLOG}/${PAGE}/${pageId}`,
        uk: `/${UA}/${BLOG}/${PAGE}/${pageId}`,
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
  const pageId = parseInt(p[PAGE_ID], 10);

  if (isNaN(pageId)) notFound();

  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const isAdmin = await isAdminAuth();

  const { articles, totalCount } = await getArticlesChunk(
    (pageId - 1) * perPage,
    perPage,
    lang,
    isAdmin,
    searchQuery
  );

  return (
    <BlogPage
      lang={lang}
      isAdmin={isAdmin}
      articles={articles}
      totalCount={totalCount}
      searchParams={sParams}
      h1Title={BLOG_H1[lang]}
      pageNumber={pageId}
      metaData={META_BLOG_PAGINATED[lang](pageId, searchQuery)}
      startUrl={`/${lang}/${BLOG}`}
      breadcrumbsItems={[
        {
          title: BLOG_H1[lang],
          href: BLOG,
        },
        { title: `${PAGE_CAPTION[lang]}: ${pageId}` },
      ]}
    />
  );
}
