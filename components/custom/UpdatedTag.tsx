'use client';

import { TNewTag, TTag } from '@/db/schema';
import { deleteTagFromDb, updateTagToDb } from '@/db/queriesTag';
import { DEFAULT_LANG } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import { ExternalLink, PencilLine } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import ModalUpdateTag from './ModalUpdateTag';
import useSWR from 'swr';
import { clsx } from 'clsx';
import { LoadingAnimated } from '@/svg/LoadingAnimated';

const UpdatedTag = ({ tag }: { tag: TTag }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isDeleteProcess, setIsDeleteProcess] = useState(false);
  const { mutate } = useSWR<TTag[]>('tags');

  const updateTag = useCallback(
    async (updatedTag: TNewTag) => {
      try {
        const res = await updateTagToDb(tag.id, updatedTag);

        if (!res) {
          toast.error(`Error while updating tag to DB`);
          return;
        }

        if (res instanceof Error) throw res;

        toast.success(`Tag ${res.slug} updated successfully`);
        setOpenEditModal(false);

        // Update the SWR cache with the updated tag.
        mutate((tags) => {
          if (!tags) return; // Handle the case where tags is undefined
          const updatedTags = tags.map((t) => (t.id === tag.id ? res : t));
          return updatedTags;
        });
      } catch (error) {
        console.error('Error updating tag:', error);
        toast.error(`Error updating tag: ${error}`);
      }
    },
    [tag.id, mutate]
  );

  const removeTag = useCallback(async () => {
    setIsDeleteProcess(true);
    try {
      const res = await deleteTagFromDb(tag.id);

      if (typeof res === 'number') {
        // Handle the case where the tag is used by articles (same as before)
        toast.error('Remove this tag from the article first.', {
          description: (
            <p className="flex items-center gap-2">
              At least{' '}
              <Link
                href={`/${DEFAULT_LANG}/${ESegment.MASTER}/${ESegment.BLOG}/${ESegment.ARTICLE_EDIT}/${res}`}
                className="flex gap-1 items-center justify-center"
              >
                <span className="font-bold underline">1 article</span>

                <ExternalLink className="size-3 text-stone-600" />
              </Link>{' '}
              uses this tag.
            </p>
          ),
          duration: 8000,
        });
        return;
      }

      toast.success(`Tag ${res.slug} (${res.nameEn}) deleted successfully`);

      // Update the SWR cache after deleting a tag.
      mutate((tags) => {
        if (!tags) return; // Handle undefined tags
        return tags.filter((t) => t.id !== tag.id);
      });
    } catch (error) {
      toast.error(`Error deleting tag! ${error}`);
    } finally {
      setIsDeleteProcess(false);
    }
  }, [tag.id, mutate]);

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
            title="Edit Tag"
            onClick={() => setOpenEditModal(true)}
          >
            <span>{tag.nameEn}</span>
            {isDeleteProcess ? (
              <LoadingAnimated className="size-4" />
            ) : (
              <PencilLine className="size-3 opacity-50" />
            )}
          </button>
        </div>
      </li>

      {openEditModal && (
        <ModalUpdateTag
          open={openEditModal}
          setOpen={setOpenEditModal}
          onSubmit={updateTag}
          tag={tag}
          removeTag={removeTag}
        />
      )}
    </>
  );
};

export default UpdatedTag;
