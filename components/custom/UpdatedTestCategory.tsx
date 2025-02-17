'use client';

import { TNewTestCategory, TTestCategory } from '@/db/schema';
import { DEFAULT_LANG } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import { ExternalLink, PencilLine } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { clsx } from 'clsx';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { deleteCategoryFromDb, updateCategoryInDb } from '@/db/queriesTestEdit';
import ModalUpdateTestCategory from './ModalUpdateTestCategory';

const UpdatedTestCategory = ({ category }: { category: TTestCategory }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isDeleteProcess, setIsDeleteProcess] = useState(false);
  const { mutate } = useSWR<TTestCategory[]>('categories');

  const updateTag = useCallback(
    async (updatedCategory: TNewTestCategory) => {
      try {
        const res = await updateCategoryInDb(category.id, updatedCategory);

        toast.success(`Category ${res.slug} updated successfully`);
        setOpenEditModal(false);

        // Update the SWR cache with the updated category.
        mutate((categories) => {
          if (!categories) return; // Handle the case where categories is undefined
          const updatedCategories = categories.map((cat) =>
            cat.id === category.id ? res : cat
          );
          return updatedCategories;
        });
      } catch (error) {
        console.error(error);
        toast.error(`${error}`);
      }
    },
    [category.id, mutate]
  );

  const deleteCategory = useCallback(async () => {
    setIsDeleteProcess(true);
    try {
      const res = await deleteCategoryFromDb(category.id);

      if (typeof res === 'number') {
        // Handle the case where the category is used by articles (same as before)
        toast.error('Remove this category from the test first.', {
          description: (
            <p className="flex items-center gap-2">
              At least{' '}
              <Link
                href={`/${DEFAULT_LANG}/${ESegment.MASTER}/${ESegment.TESTS}/${ESegment.ARTICLE_EDIT}/${res}`}
                className="flex gap-1 items-center justify-center"
              >
                <span className="font-bold underline">1 test</span>

                <ExternalLink className="size-3 text-stone-600" />
              </Link>{' '}
              uses this category.
            </p>
          ),
          duration: 8000,
        });
        return;
      }

      toast.success(
        `Category ${res.slug} (${res.nameEn}) deleted successfully`
      );

      // Update the SWR cache after deleting a category.
      mutate((categories) => {
        if (!categories) return; // Handle undefined categories
        return categories.filter((cat) => cat.id !== category.id);
      });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsDeleteProcess(false);
    }
  }, [category.id, mutate]);

  return (
    <>
      <li className="flex items-center gap-4 w-fit group">
        <div className="flex items-center gap-4">
          <button
            disabled={isDeleteProcess}
            className={clsx(
              'flex items-center gap-2',
              isDeleteProcess && 'opacity-30'
            )}
            title="Edit Category"
            onClick={() => setOpenEditModal(true)}
          >
            <span>{category.nameEn}</span>
            {isDeleteProcess ? (
              <LoadingAnimated className="size-4" />
            ) : (
              <PencilLine className="size-3 opacity-50" />
            )}
          </button>
        </div>
      </li>

      {openEditModal && (
        <ModalUpdateTestCategory
          open={openEditModal}
          setOpen={setOpenEditModal}
          onSubmit={updateTag}
          category={category}
          deleteCategory={deleteCategory}
        />
      )}
    </>
  );
};

export default UpdatedTestCategory;
