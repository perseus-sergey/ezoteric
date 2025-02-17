'use client';

import { Button } from '@/components/ui/button';
import { TNewTestCategory, TTestCategory } from '@/db/schema';
import { PlusCircle } from 'lucide-react';
import { Suspense, useCallback, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { getCatsFromDb, insertCategoryToDb } from '@/db/queriesTestEdit';
import UpdatedTestCategory from './UpdatedTestCategory';
import ModalUpdateTestCategory from './ModalUpdateTestCategory';

const CategoriesUpdatePage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  // Fetch categories using SWR
  const {
    data: categories,
    error,
    isLoading,
    mutate,
  } = useSWR<TTestCategory[], Error>('categories', getCatsFromDb);

  const addCategory = useCallback(
    async (insertedCat: TNewTestCategory) => {
      const res = await insertCategoryToDb(insertedCat);

      // Update SWR cache after successful addition
      mutate([...categories!, res], { revalidate: false });

      toast.success(`Category ${res.slug} added successfully`);
      setOpenAddModal(false);
    },
    [categories, mutate]
  );

  if (error) {
    return (
      <>
        <h2 className="font-bold text-xl text-center">
          При завантаженні Категорій сталася помилка
        </h2>
        {JSON.stringify(error)}
      </>
    );
  }

  if (!categories) {
    return (
      <div className="flex items-center gap-4">
        <LoadingAnimated /> Loading...
      </div>
    );
  }

  return (
    <>
      {/* Category List */}
      <ul className="flex flex-col flex-wrap gap-4 p-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Suspense key={cat.id} fallback={<div>Loading cat...</div>}>
              <UpdatedTestCategory category={cat} />
            </Suspense>
          ))
        ) : (
          <li className="text-gray-500">No categories found</li>
        )}
      </ul>

      <Button
        disabled={isLoading}
        type="button"
        title="Add Tag"
        className="group fixed z-50 md:bottom-8 bottom-4 right-1/4 bg-primary size-14 rounded-full"
        onClick={() => setOpenAddModal(true)}
        variant="outline"
      >
        <PlusCircle className="size-8 group-hover:scale-110 transition-transform duration-200 text-slate-100" />
      </Button>

      {/* Modals */}
      <ModalUpdateTestCategory
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={addCategory}
      />
    </>
  );
};

export default CategoriesUpdatePage;
