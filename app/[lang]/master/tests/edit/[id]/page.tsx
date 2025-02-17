import EmptyData from '@/components/custom/EmptyData';
import SeoLink from '@/components/custom/SeoLink';
import TestFormClient from '@/components/custom/TestFormClient';
import { Title } from '@/components/custom/Title';
import { getTestByIdForUpdate } from '@/db/queriesTestEdit';
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

  const testId = parseInt(pageId, 10);

  try {
    const { test, categories } = await getTestByIdForUpdate(testId);

    const productionHref = `/${lang}/${ESegment.TESTS}/${test.slug}`;
    return (
      <>
        <Title className="flex flex-col">
          Edit Test:
          <SeoLink
            className="text-xl"
            href={productionHref}
            isTargetBlank
            title="Go to test"
          >
            {test.titleEn} 🔗
          </SeoLink>
        </Title>

        <TestFormClient
          editorApiKey={process.env.TINY_MCE_API_KEY || ''}
          availableCategories={categories}
          test={test}
        />
      </>
    );
  } catch (error) {
    toast.error(JSON.stringify(error));
    return <EmptyData lang={lang} description={(error as Error).message} />;
  }
};

export default Page;
