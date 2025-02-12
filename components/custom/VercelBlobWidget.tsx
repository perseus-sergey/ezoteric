'use client';

import { PreviewUploaded } from '@/components/custom/PreviewUploaded';
import { Button } from '@/components/ui/button';
import { makeUrlSearchParams } from '@/lib/utils/urlMaker';
import { fetcher } from '@/lib/utils/utils';
import { BLOB_STORAGE_PATH } from '@/models/image.model';
import { DEFAULT_LANG } from '@/models/language.model';
import { IUploadBlobResponse } from '@/models/uploadFile.model';
import { ESegment, EUrlSearchParam } from '@/models/url.model';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { DownloadCloud, ExternalLink, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import useSWRInfinite from 'swr/infinite';

export default function VercelBlobWidget() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [isDeleteProcess, setIsDeleteProcess] = useState(false);
  const [isUploadingProcess, setIsUploadingProcess] = useState(false);

  const { data, size, setSize, isLoading, mutate } = useSWRInfinite<{
    images: {
      filename: string;
    }[];
    hasMore: boolean;
  }>(
    (pageIndex, previousPageData) => {
      // Якщо попередня сторінка даних існує і hasMore = false, то більше не запитуємо
      if (previousPageData && !previousPageData.hasMore) return null;

      // Формуємо URL із параметром пагінації
      const params = new URLSearchParams();
      params.append('page', (pageIndex + 1).toString());

      return `/api/files/upload?${params.toString()}`;
    },
    fetcher,
    {
      revalidateFirstPage: true,
      revalidateAll: false,
    }
  );

  // Flatten files from all pages
  const files = useMemo(() => {
    return data
      ? data.flatMap((page) =>
          page.images.map((img) => ({
            url: BLOB_STORAGE_PATH,
            name: img.filename,
            contentType: 'image',
          }))
        )
      : [];
  }, [data]);

  // Determine if there are more files to load
  const hasMore = data ? data.at(-1)?.hasMore : true;

  // File Upload Handler
  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadDir', 'post');

      try {
        const response = await fetch(`/api/files/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { pathname } = (await response.json()) as IUploadBlobResponse;

          // Оновлюємо локальний стан, додаючи новий файл на початок
          mutate(
            (currentData) => {
              if (!currentData) return currentData;

              return [
                {
                  ...currentData[0],
                  images: [{ filename: pathname }, ...currentData[0].images],
                },
                ...currentData.slice(1),
              ];
            },
            { revalidate: false } // Не викликати повторне запитування одразу
          );

          return { name: pathname };
        } else {
          const { error } = await response.json();
          toast.error(error);
        }
      } catch (error) {
        toast.error(`Failed to upload file! ${(error as Error).message}`);
      }
    },
    [mutate]
  );

  // File Change Handler
  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      if (selectedFiles.length === 0) return;

      // Filter out files already in the list
      const newFiles = selectedFiles.filter(
        (file) => !files.some((existingFile) => existingFile.name === file.name)
      );

      if (newFiles.length === 0) {
        toast.info('All selected files are already uploaded.');
        return;
      }

      // Set upload queue for UI feedback
      setUploadQueue(newFiles.map((file) => file.name));

      setIsUploadingProcess(true);

      try {
        // Завантажуємо всі файли
        await Promise.all(newFiles.map((file) => uploadFile(file)));

        // Після завершення всіх завантажень запитуємо сервер для оновлення списку
        mutate();
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
        setIsUploadingProcess(false);
      }
    },
    [files, uploadFile, mutate]
  );

  const handleRemove = useCallback(
    async (fileName: string) => {
      setIsDeleteProcess(true);

      try {
        // Send delete request
        const searchParams = makeUrlSearchParams({
          [EUrlSearchParam.URL]: fileName,
        }).toString();

        const response = await fetch(`/api/files/upload?${searchParams}`, {
          method: 'DELETE',
        });

        // Parse the response
        const result = await response.json();

        if (response.ok) {
          // Successful deletion
          // Optimistically remove the file from the list
          mutate(
            (currentData) => {
              if (!currentData) return currentData;

              return currentData.map((page) => ({
                ...page,
                images: page.images.filter((img) => img.filename !== fileName),
              }));
            },
            { revalidate: false }
          );

          toast.success('File successfully deleted');
        } else {
          // Handle different error scenarios
          if (response.status === 409) {
            // File is used in an article
            toast.error(
              () => (
                <div className="flex flex-col gap-2 items-center w-full">
                  <p className="flex items-center gap-2">
                    File is already used in a published article
                  </p>
                  {result.articleDetails && (
                    <Link
                      href={`/${DEFAULT_LANG}/${ESegment.BLOG}/${result.articleDetails.slug}`}
                      className="flex gap-1 items-center justify-center"
                    >
                      <span className="font-bold underline">
                        {result.articleDetails.title}
                      </span>
                      <ExternalLink className="size-10 text-stone-600" />
                    </Link>
                  )}
                  <p className="text-right">
                    First remove the article from published
                  </p>
                </div>
              ),
              { duration: 8000 }
            );
          } else {
            // Other error scenarios
            toast.error(result.error || 'Failed to delete file');
          }
        }
      } catch (error) {
        // Network or parsing error
        console.error('Error deleting file:', error);
        toast.error(`Error deleting file: ${(error as Error).message}`);
      } finally {
        setIsDeleteProcess(false);
      }
    },
    [mutate]
  );

  return (
    <>
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {files.length > 0 || uploadQueue.length > 0 || isLoading ? (
        <>
          <div className="flex flex-wrap justify-center gap-2">
            {/* Upload Queue Preview */}
            {uploadQueue.map((filename) => (
              <PreviewUploaded
                key={filename}
                uploadFile={{
                  url: '',
                  name: filename,
                  contentType: '',
                }}
                isUploading={true}
              />
            ))}

            {/* Existing Files Preview */}
            {files.map((file) => (
              <PreviewUploaded
                onRemove={() => handleRemove(file.name)}
                isDeleteProcess={isDeleteProcess || isUploadingProcess}
                key={file.name}
                uploadFile={file}
              />
            ))}
          </div>

          <div>
            {hasMore && (
              <Button
                onClick={() => setSize(size + 1)}
                disabled={isUploadingProcess || isDeleteProcess}
                className="w-fit duration-300 my-4"
              >
                {isLoading ? <LoadingAnimated /> : <DownloadCloud />} Load More
              </Button>
            )}

            {!hasMore && files.length > 0 && (
              <p className="mt-4 text-gray-500">No more images to load</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No images found</p>
      )}

      <Button
        title="Add Images"
        disabled={isUploadingProcess || isDeleteProcess}
        className="group fixed z-50 md:bottom-8 bottom-4 right-1/4 bg-primary size-14 rounded-full"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
      >
        <UploadCloud className="size-8 group-hover:scale-110 transition-transform duration-200 text-slate-100" />
      </Button>
    </>
  );
}
