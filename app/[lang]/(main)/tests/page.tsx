import TestsPage from '@/components/custom/TestsPage';
import { getTestsChunk } from '@/db/queriesTests';
import { getELangKey } from '@/lib/utils/getLanguage';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { validSearchParam } from '@/lib/utils/validSearchParam';
import { ELanguage } from '@/models/language.model';
import { DEFAULT_META_OG } from '@/models/root.model';
import {
  META_TESTS,
  TESTS_H1,
  TESTS_PAGINATION_PARAMS,
} from '@/models/tests.model';
import {
  ESegment,
  EUrlSearchParam,
  MAIN_URL,
  TParams,
  TSearchParams,
} from '@/models/url.model';
import { Metadata } from 'next';
const { TESTS } = ESegment;

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

  return {
    metadataBase: new URL(baseUrl),
    ...META_TESTS[lang](),
    openGraph: {
      ...DEFAULT_META_OG,
      ...META_TESTS[lang](),
      url: `/${lang}/${TESTS}`,
    },
    alternates: {
      canonical: `/${lang}/${TESTS}`,
      languages: {
        en: `/${ELanguage.EN}/${TESTS}`,
        uk: `/${ELanguage.UA}/${TESTS}`,
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

  const searchQuery = validSearchParam(EUrlSearchParam.QUERY, sParams);

  const isAdmin = await isAdminAuth();

  const { tests, totalCount } = await getTestsChunk(
    0,
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
      pageNumber={1}
      metaData={META_TESTS[lang](searchQuery)}
      breadcrumbsItems={[{ title: TESTS_H1[lang] }]}
      startUrl={`/${lang}/${TESTS}`}
      searchQuery={searchQuery}
    />
  );
}
