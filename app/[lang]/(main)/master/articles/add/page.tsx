import { FormAddArticle } from '@/components/custom/FormAddArticle';
import { Title } from '@/components/custom/Title';
// import { getArticleByIdForUpdate } from '@/db/queriesArticle';
import { getELangKey } from '@/lib/utils/getLanguage';
import { TParams } from '@/models/url.model';
import * as React from 'react';

const Page = async ({ params }: { params: TParams }) => {
  const p = await params;

  const lang = getELangKey(p.lang);
  console.log('🚀 ~ Page ~ lang:', lang);

  return (
    <>
      <Title className="flex flex-col">Add New Article:</Title>

      <FormAddArticle
        // revalidateUrl={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
    </>
  );
};

export default Page;
