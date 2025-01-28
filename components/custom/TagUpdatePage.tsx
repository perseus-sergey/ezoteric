'use client';

import { Button } from '@/components/ui/button';
import { deleteTagFromDb, insertTagToDb, updateTagToDb } from '@/db/queriesTag';
import { NewTag, TTag } from '@/db/schema';
import { DEFAULT_LANG } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import { AlertCircle, LucideLink, PencilLine, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ModalTagUpdate from './ModalUpdateTag';
import { clsx } from 'clsx';

const TagUpdatePage = ({ tags: dbTags }: { tags: TTag[] }) => {
  const [tags, setTags] = useState<Array<TTag>>(dbTags); // Initialize with dbTags
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TTag | null>(null);
  const [isDeleteProcess, setIsDeleteProcess] = useState(false);
  const [wrap, setWrap] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

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
    async (insertedTag: NewTag) => {
      const res = await insertTagToDb(insertedTag);

      if (!res) {
        toast.error(`Error while adding new tag to DB`);
        return;
      }
      if (res instanceof Error) throw res;

      setTags([...tags, res]); // Update the tags state after successful addition
      toast.success(`Tag ${res.slug} added successfully`);
      setOpenAddModal(false); // Close the modal
    },
    [tags]
  );

  const updateTag = useCallback(
    async (tagId: number, updatedTag: NewTag) => {
      const res = await updateTagToDb(tagId, updatedTag);

      if (!res) {
        toast.error(`Error while updating tag to DB`);
        return;
      }
      if (res instanceof Error) throw res;

      // Update the tags state after a successful update
      setTags(tags.map((tag) => (tag.id === tagId ? res : tag)));
      toast.success(`Tag ${res.slug} updated successfully`);
      setOpenEditModal(false); // Close the modal
    },
    [tags]
  );

  const removeTag = useCallback(
    async (tagId: number) => {
      setIsDeleteProcess(true);

      try {
        const res = await deleteTagFromDb(tagId);

        if (typeof res === 'number') {
          // Handle the case where the tag is used by articles
          toast.error(
            <div className="flex flex-col gap-2 items-center w-full">
              <p className="flex items-center gap-2">
                <AlertCircle className="size-5" />
                At least{' '}
                <Link
                  href={`/${DEFAULT_LANG}/${ESegment.MASTER}/${ESegment.BLOG}/${ESegment.ARTICLE_EDIT}/${res}`}
                  className="flex gap-2 items-center justify-center"
                >
                  1 article
                  <LucideLink className="size-3 text-stone-600" />
                </Link>{' '}
                uses this tag.
              </p>
              <p className="text-right">
                Please remove this tag from the article first.
              </p>
            </div>,
            { duration: 8000 }
          );
          return;
        }
        // Update the tags state after deleting
        setTags(tags.filter((tag) => tag.id !== tagId));
        toast.success(`Tag ${res.slug} (${res.nameEn}) deleted successfully`);
      } catch (error) {
        toast.error(`Error deleting tag! ${error}`);
      } finally {
        setIsDeleteProcess(false);
      }
    },
    [tags]
  );

  return (
    <>
      {/* Tag List  */}
      <ul
        ref={listRef}
        className={clsx(
          'flex flex-col flex-wrap gap-4 p-4',
          wrap && 'flex-wrap max-h-[80dvh]',
          isDeleteProcess && 'cursor-wait'
        )}
      >
        {tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag.id} className="flex items-center gap-4 w-fit group">
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2"
                  title="Edit Tag"
                  onClick={() => {
                    setSelectedTag(tag);
                    setOpenEditModal(true);
                  }}
                >
                  <span>{tag.nameEn}</span>
                  <PencilLine className="size-3 opacity-50" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No Tags found</li>
        )}
      </ul>

      <Button
        type="button"
        title="Add Tag"
        className="group fixed z-50 md:bottom-8 bottom-4 right-1/4 bg-primary size-14 rounded-full"
        onClick={() => setOpenAddModal(true)}
        variant="outline"
      >
        <PlusCircle className="size-8 group-hover:scale-110 transition-transform duration-200 text-slate-100" />
      </Button>

      {/* Modals */}
      <ModalTagUpdate
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={addTag}
      />

      {selectedTag && ( // Conditionally render edit modal
        <ModalTagUpdate
          open={openEditModal}
          setOpen={setOpenEditModal}
          onSubmit={(updatedTag) => updateTag(selectedTag.id, updatedTag)}
          tag={selectedTag} // Pass the selected tag for editing
          removeTag={removeTag}
        />
      )}
    </>
  );
};

export default TagUpdatePage;
