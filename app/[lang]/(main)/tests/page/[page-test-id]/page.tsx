import { getELangKey } from '@/lib/utils/getLanguage';
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
import TestsPage from '@/components/custom/TestsPage';
import {
  META_TESTS_PAGINATED,
  TESTS_H1,
  TESTS_PAGINATION_PARAMS,
} from '@/models/tests.model';
import { getTestsChunk } from '@/db/queriesTests';

const { TESTS, PAGE_ID, PAGE } = ESegment;
const { UA, EN } = ELanguage;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

const { perPage } = TESTS_PAGINATION_PARAMS;

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
    ...META_TESTS_PAGINATED[lang](pageId),
    openGraph: {
      ...DEFAULT_META_OG,
      ...META_TESTS_PAGINATED[lang](pageId),
      url: `/${lang}/${TESTS}/${PAGE}/${pageId}`,
    },
    alternates: {
      canonical: `/${lang}/${TESTS}/${PAGE}/${pageId}`,
      languages: {
        en: `/${EN}/${TESTS}/${PAGE}/${pageId}`,
        uk: `/${UA}/${TESTS}/${PAGE}/${pageId}`,
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

  const { tests, totalCount } = await getTestsChunk(
    (pageId - 1) * perPage,
    perPage,
    lang,
    isAdmin,
    searchQuery
  );

  return (
    <TestsPage
      lang={lang}
      isAdmin={isAdmin}
      tests={tests}
      totalCount={totalCount}
      searchParams={sParams}
      h1Title={TESTS_H1[lang]}
      pageNumber={pageId}
      metaData={META_TESTS_PAGINATED[lang](pageId, searchQuery)}
      startUrl={`/${lang}/${TESTS}`}
      searchQuery={searchQuery}
      breadcrumbsItems={[
        {
          title: TESTS_H1[lang],
          href: TESTS,
        },
        { title: `${PAGE_CAPTION[lang]} №${pageId}` },
      ]}
    />
  );
}
