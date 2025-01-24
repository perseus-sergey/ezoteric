import EmptyData from '@/components/custom/EmptyData';
import { FormEditArticle } from '@/components/custom/FormEditArticle';
import SeoLink from '@/components/custom/SeoLink';
import { Title } from '@/components/custom/Title';
import { getArticleByIdForUpdate } from '@/db/queriesArticle';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ESegment, TParams } from '@/models/url.model';
import * as React from 'react';

export const dynamic = 'force-dynamic';

export const maxDuration = 60;

const Page = async ({ params }: { params: TParams }) => {
  const p = await params;

  const lang = getELangKey(p.lang);
  const pageId = p.id;

  const articleId = parseInt(pageId, 10);

  const dbResult = await getArticleByIdForUpdate(articleId);

  if (dbResult instanceof Error)
    return <EmptyData lang={lang} description={dbResult.message} />;

  const productionHref = `/${lang}/${ESegment.BLOG}/${dbResult.slug}`;

  return (
    <>
      <Title className="flex flex-col">
        Edit Article:
        <SeoLink
          className="text-xl"
          href={productionHref}
          isTargetBlank
          title="Go to article"
        >
          {dbResult.titleEn} 🔗
        </SeoLink>
      </Title>

      <FormEditArticle
        article={dbResult}
        // revalidateUrl={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
    </>
  );
};

export default Page;
