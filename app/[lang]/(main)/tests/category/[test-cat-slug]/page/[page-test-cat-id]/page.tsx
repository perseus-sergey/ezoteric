import { getELangKey } from '@/lib/utils/getLanguage';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { validSearchParam } from '@/lib/utils/validSearchParam';
import {
  META_TESTS,
  META_TESTS_CATEGORY_PAGINATED,
  TESTS_H1,
  TESTS_PAGINATION_PARAMS,
} from '@/models/tests.model';
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
import { getTestsChunk } from '@/db/queriesTests';
import TestsPage from '@/components/custom/TestsPage';
import { PAGE_CAPTION } from '@/models/breadcrumb.model';

const { perPage } = TESTS_PAGINATION_PARAMS;
const { TESTS, TEST_CAT_SLUG, LANG, CATEGORY, PAGE_TEST_CAT_ID, PAGE } =
  ESegment;

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
  const categorySlug = p[TEST_CAT_SLUG];
  const pageId = parseInt(p[PAGE_TEST_CAT_ID], 10);

  if (isNaN(pageId)) notFound();

  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const isAdmin = await isAdminAuth();

  const { categoryName } = await getTestsChunk(
    (pageId - 1) * perPage,
    perPage,
    lang,
    isAdmin,
    searchQuery,
    categorySlug
  );

  const meta = categoryName
    ? META_TESTS_CATEGORY_PAGINATED[lang](categoryName, pageId)
    : META_TESTS[lang]();

  const getPath = (lang: ELanguage) =>
    `/${lang}/${TESTS}/${CATEGORY}/${categorySlug}/${PAGE}/${pageId}`;

  return {
    metadataBase: new URL(baseUrl),
    ...meta,
    openGraph: {
      ...DEFAULT_META_OG,
      ...meta,
      url: getPath(lang),
    },
    alternates: {
      canonical: getPath(lang),
      languages: {
        en: getPath(ELanguage.EN),
        uk: getPath(ELanguage.UA),
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
  const categorySlug = p[TEST_CAT_SLUG];
  const pageId = parseInt(p[PAGE_TEST_CAT_ID], 10);

  if (isNaN(pageId)) notFound();

  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const isAdmin = await isAdminAuth();

  const { tests, totalCount, categoryName } = await getTestsChunk(
    (pageId - 1) * perPage,
    perPage,
    lang,
    isAdmin,
    searchQuery,
    categorySlug
  );

  return (
    <TestsPage
      lang={lang}
      isAdmin={isAdmin}
      tests={tests}
      totalCount={totalCount}
      searchParams={sParams}
      pageNumber={pageId}
      h1Title={`${TESTS_H1[lang]}: ${categoryName}`}
      metaData={
        categoryName
          ? META_TESTS_CATEGORY_PAGINATED[lang](categoryName, pageId)
          : META_TESTS[lang]()
      }
      startUrl={`/${lang}/${TESTS}/${CATEGORY}/${categorySlug}`}
      searchQuery={searchQuery}
      breadcrumbsItems={[
        {
          title: TESTS_H1[lang],
          href: TESTS,
        },
        {
          title: `«${categoryName}»`,
          href: `${TESTS}/${CATEGORY}/${categorySlug}`,
        },
        { title: `${PAGE_CAPTION[lang]} №${pageId}` },
      ]}
    />
  );
}
