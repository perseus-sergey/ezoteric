import EmptyData from '@/components/custom/EmptyData';
import { FormAddEditArticle } from '@/components/custom/FormAddEditArticle';
import SeoLink from '@/components/custom/SeoLink';
import { Title } from '@/components/custom/Title';
import { getArticleByIdForUpdate } from '@/db/queriesArticle';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ESegment, TParams } from '@/models/url.model';
import * as React from 'react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export const maxDuration = 60;

const Page = async ({ params }: { params: TParams }) => {
  const p = await params;

  const lang = getELangKey(p.lang);
  const pageId = p.id;

  const articleId = parseInt(pageId, 10);

  try {
    const { article, tags } = await getArticleByIdForUpdate(articleId);

    const productionHref = `/${lang}/${ESegment.BLOG}/${article.slug}`;
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
            {article.titleEn} 🔗
          </SeoLink>
        </Title>

        <FormAddEditArticle
          editorApiKey={process.env.TINY_MCE_API_KEY || ''}
          availableTags={tags}
          article={article}
        />
      </>
    );
  } catch (error) {
    toast.error(JSON.stringify(error));
    return <EmptyData lang={lang} description={(error as Error).message} />;
  }
};

export default Page;
