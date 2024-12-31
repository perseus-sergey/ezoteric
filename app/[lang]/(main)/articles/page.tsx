import ArticleList from '@/components/custom/ArticleList';
import Pagination from '@/components/custom/Pagination';
import { Title } from '@/components/custom/Title';
import { getArticlesChunk } from '@/db/queriesArticle';
import { getELangKey } from '@/lib/utils/getLanguage';
import { validSearchParam } from '@/lib/utils/validSearchParam';
import {
  ARTICLE_PAGINATION_PARAMS,
  ARTICLES_COUNT_CAPTION,
} from '@/models/article.model';
import { EUrlSearchParam, TParams, TSearchParams } from '@/models/url.model';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const { perPage } = ARTICLE_PAGINATION_PARAMS;

export default async function Page({
  params,
  searchParams,
}: {
  params: TParams;
  searchParams: TSearchParams;
}) {
  const p = await params;
  const lang = getELangKey(p.lang);

  const page =
    (await validSearchParam(EUrlSearchParam.PAGE, searchParams)) || '1';
  const searchQuery = await validSearchParam(
    EUrlSearchParam.QUERY,
    searchParams
  );

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

  return (
    <article className="relative mx-auto">
      <Title className="mt-10">Welcome to Articles Page</Title>

      <Suspense>
        {/* <Filter
          lang={lang}
          idName="article-search-input"
          placeholder={placeholder[lang]}
          labelTitle={labelTitle[lang]}
          searchQueryTitle={EUrlSearchParam.ARTICLE}
        /> */}
      </Suspense>

      <p className="text-blue-600 font-bold text-center text-lg">{`${ARTICLES_COUNT_CAPTION[lang]}${articlesCount}`}</p>

      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={ARTICLE_PAGINATION_PARAMS.offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
      />

      <ArticleList articleList={articles} lang={lang} />

      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={ARTICLE_PAGINATION_PARAMS.offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </article>
  );
}
