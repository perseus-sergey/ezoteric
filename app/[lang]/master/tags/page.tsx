import { Title } from '@/components/custom/Title';
import TagUpdatePage from '@/components/custom/TagUpdatePage';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const Page = async () => {
  return (
    <>
      <Title>Edit Tags for Articles</Title>
      <article className="bg-tertiary/90 grow p-4 rounded-lg">
        <Suspense>
          <TagUpdatePage />
        </Suspense>
      </article>
    </>
  );
};

export default Page;
