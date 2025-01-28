import { Title } from '@/components/custom/Title';
import TagUpdatePage from '@/components/custom/TagUpdatePage';
import { Suspense } from 'react';
import { getTagsFromDb } from '@/db/queriesTag';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const tags = await getTagsFromDb();

  return (
    <>
      <Title>Edit Tags for Articles</Title>
      <article className="bg-tertiary/90 grow p-4 rounded-lg">
        {tags instanceof Error ? (
          <h2 className="font-bold text-xl">
            При завантаженні тегів сталася помилка:
            <br />
            {JSON.stringify(tags)}
          </h2>
        ) : (
          <Suspense>
            <TagUpdatePage tags={tags} />
          </Suspense>
        )}
      </article>
    </>
  );
};

export default Page;
