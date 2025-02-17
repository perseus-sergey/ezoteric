import { Title } from '@/components/custom/Title';
import { Suspense } from 'react';
import CategoriesUpdatePage from '@/components/custom/CategoriesUpdatePage';

export const dynamic = 'force-dynamic';

const Page = async () => {
  return (
    <>
      <Title>Edit Test Categories</Title>
      <article className="bg-tertiary/90 grow p-4 rounded-lg">
        <Suspense>
          <CategoriesUpdatePage />
        </Suspense>
      </article>
    </>
  );
};

export default Page;
