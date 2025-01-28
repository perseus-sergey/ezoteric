import { Title } from '@/components/custom/Title';
import TagUpdatePage from '@/components/custom/TagUpdatePage';
import { getDB } from '@/db/root';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const tags = await getDB().query.tblTag.findMany();

  return (
    <>
      <Title>Edit Tags for Articles</Title>
      <article className="bg-tertiary/70 grow p-4 rounded-lg">
        <Suspense>
          <TagUpdatePage tags={tags} />
        </Suspense>
      </article>
    </>
  );
};

export default Page;
