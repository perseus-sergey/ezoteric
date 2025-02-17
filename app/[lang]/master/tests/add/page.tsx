import EmptyData from '@/components/custom/EmptyData';
import TestFormClient from '@/components/custom/TestFormClient';
import { Title } from '@/components/custom/Title';
import { getTestCategoriesFromDb } from '@/db/queriesTests';
import { getELangKey } from '@/lib/utils/getLanguage';
import { TParams } from '@/models/url.model';

export const dynamic = 'force-dynamic';

export const maxDuration = 60;

const Page = async ({ params }: { params: TParams }) => {
  const p = await params;

  const lang = getELangKey(p.lang);

  try {
    const categories = await getTestCategoriesFromDb();

    return (
      <>
        <Title className="flex flex-col">Add New Test:</Title>

        <TestFormClient
          availableCategories={categories}
          editorApiKey={process.env.TINY_MCE_API_KEY || ''}
        />
      </>
    );
  } catch (error) {
    return <EmptyData lang={lang} description={(error as Error).message} />;
  }
};

export default Page;
