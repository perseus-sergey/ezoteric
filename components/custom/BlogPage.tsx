import ArticleList from '@/components/custom/ArticleList';
import BrCrumb from '@/components/custom/BrCrumb';
import Pagination from '@/components/custom/Pagination';
import SearchInput from '@/components/custom/SearchInput';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { generatePostListJsonLd } from '@/lib/utils/generatePostListJsonLd';
import { TArticleLocalized } from '@/models/article.model';
import {
  BLOG_PAGINATION_PARAMS,
  BLOG_COUNT_CAPTION,
  BLOG_SEARCH_INPUT_PARAMS,
  IMetaBlog,
} from '@/models/blog.model';
import { EBreadcrumb } from '@/models/breadcrumb.model';
import { ELanguage } from '@/models/language.model';
import { ESegment, EUrlSearchParam, TSearchParams } from '@/models/url.model';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const { perPage, offsetNumber } = BLOG_PAGINATION_PARAMS;
const { BLOG } = ESegment;

interface IFilterProps {
  lang: ELanguage;
  isAdmin: boolean;
  startUrl: string;
  articles: TArticleLocalized[] | null;
  totalCount: number | null;
  searchParams: Awaited<TSearchParams>;
  h1Title: string;
  pageNumber: number;
  metaData: IMetaBlog;
  breadcrumbsItems: EBreadcrumb[];
  searchQuery?: string;
}

export default async function BlogPage({
  lang,
  isAdmin,
  startUrl,
  articles,
  totalCount,
  searchParams,
  h1Title,
  pageNumber,
  metaData,
  breadcrumbsItems,
  searchQuery,
}: IFilterProps) {
  const articlesCount =
    !articles || articles.length === 0 ? 0 : totalCount || 0;
  const totalPages = Math.ceil(articlesCount / perPage);

  if (totalPages && pageNumber > totalPages) notFound();

  const jsonLD = generatePostListJsonLd({
    lang,
    title: metaData.title,
    description: metaData.description,
    posts: articles,
  });

  return (
    <article className="relative mx-auto">
      <BrCrumb items={breadcrumbsItems} lang={lang} />

      <Title>{h1Title}</Title>

      <TextUnderH1>{metaData.description}</TextUnderH1>

      <Suspense>
        <SearchInput
          lang={lang}
          startUrl={`/${lang}/${BLOG}`}
          searchQueryTitle={EUrlSearchParam.QUERY}
          {...BLOG_SEARCH_INPUT_PARAMS[lang]}
        />
      </Suspense>

      <p className="text-tertiary-foreground font-bold bg-tertiary w-fit px-8 py-2 my-2 rounded-sm">{`${BLOG_COUNT_CAPTION[lang]}${articlesCount}`}</p>

      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
        startUrl={startUrl}
      />

      <ArticleList
        articleList={articles}
        lang={lang}
        isAdmin={isAdmin}
        searchQuery={searchQuery}
      />

      <Pagination
        lang={lang}
        page={pageNumber || 1}
        offsetNumber={offsetNumber}
        totalPages={totalPages}
        searchParams={searchParams}
        startUrl={startUrl}
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
