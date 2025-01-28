'use client';

import { Button } from '@/components/ui/button';
import { getTagsFromDb, insertTagToDb } from '@/db/queriesTag';
import { TNewTag, TTag } from '@/db/schema';
import { PlusCircle } from 'lucide-react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import ModalUpdateTag from './ModalUpdateTag';
import UpdatedTag from './UpdatedTag';
import useSWR from 'swr';
import { LoadingAnimated } from '@/svg/LoadingAnimated';

const TagUpdatePage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [wrap, setWrap] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  // Fetch tags using SWR
  const {
    data: tags,
    error,
    isLoading,
    mutate,
  } = useSWR<TTag[], Error>('tags', getTagsFromDb);

  useEffect(() => {
    const handleResize = () => {
      if (listRef.current) {
        const listHeight = listRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        setWrap(listHeight > windowHeight && windowWidth > 640);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [tags]);

  const addTag = useCallback(
    async (insertedTag: TNewTag) => {
      const res = await insertTagToDb(insertedTag);

      if (!res) {
        toast.error(`Error while adding new tag to DB`);
        return;
      }
      if (res instanceof Error) throw res;

      // Update SWR cache after successful addition
      mutate([...tags!, res], { revalidate: false });

      toast.success(`Tag ${res.slug} added successfully`);
      setOpenAddModal(false);
    },
    [tags, mutate]
  );

  if (error) {
    return (
      <>
        <h2 className="font-bold text-xl text-center">
          При завантаженні тегів сталася помилка
        </h2>
        {JSON.stringify(error)}
      </>
    );
  }

  if (!tags) {
    return (
      <div className="flex items-center gap-4">
        <LoadingAnimated /> Loading...
      </div>
    );
  }

  return (
    <>
      {/* Tag List */}
      <ul
        ref={listRef}
        className={clsx(
          'flex flex-col flex-wrap gap-4 p-4',
          wrap && 'flex-wrap max-h-[80dvh]'
        )}
      >
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Suspense key={tag.id} fallback={<div>Loading tag...</div>}>
              {/* Add Suspense for each tag */}
              <UpdatedTag tag={tag} />
            </Suspense>
          ))
        ) : (
          <li className="text-gray-500">No Tags found</li>
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
      <ModalUpdateTag
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={addTag}
      />
    </>
  );
};

export default TagUpdatePage;
