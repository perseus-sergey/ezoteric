'use client';

import { PreviewUploaded } from '@/components/custom/PreviewUploaded';
import { Button } from '@/components/ui/button';
import { makeUrlSearchParams } from '@/lib/utils/urlMaker';
import { fetcher } from '@/lib/utils/utils';
import { DEFAULT_LANG } from '@/models/language.model';
import {
  IBlobListResponse,
  IUploadBlobResponse,
} from '@/models/uploadFile.model';
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

  // SWR Infinite Loading for Files
  const { data, size, setSize, isLoading, mutate } =
    useSWRInfinite<IBlobListResponse>(
      (pageIndex, previousPageData) => {
        // If no previous page data or no more pages, return null
        if (previousPageData && !previousPageData.hasMore) return null;

        // Construct URL with cursor for pagination
        const params = new URLSearchParams();
        if (pageIndex > 0 && previousPageData?.cursor) {
          params.append('cursor', previousPageData.cursor);
        }

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
          page.blobs.map((blob) => ({
            url: blob.url,
            name: blob.pathname,
            contentType: 'image',
          }))
        )
      : [];
  }, [data]);

  // Determine if there are more files to load
  const hasMore = data ? data[data.length - 1]?.hasMore : true;

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
          const { url, pathname, contentType } =
            (await response.json()) as IUploadBlobResponse;
          mutate(); // Revalidate the files list
          return {
            url,
            name: pathname,
            contentType,
          };
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
        (file) =>
          !files.some(
            (existingFile) => existingFile.name === `post/${file.name}`
          )
      );

      if (newFiles.length === 0) {
        toast.info('All selected files are already uploaded.');
        return;
      }

      // Set upload queue for UI feedback
      setUploadQueue(newFiles.map((file) => file.name));

      try {
        const uploadPromises = newFiles.map((file) => uploadFile(file));
        await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [files, uploadFile]
  );

  const handleRemove = useCallback(
    async (fileUrl: string) => {
      setIsDeleteProcess(true);

      try {
        // Send delete request
        const searchParams = makeUrlSearchParams({
          [EUrlSearchParam.URL]: fileUrl,
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
                blobs: page.blobs.filter((blob) => blob.url !== fileUrl),
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
                      <ExternalLink className="size-3 text-stone-600" />
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
                onRemove={() => handleRemove(file.url)}
                isDeleteProcess={isDeleteProcess}
                key={file.url}
                uploadFile={file}
              />
            ))}
          </div>

          <div>
            {hasMore && (
              <Button
                onClick={() => setSize(size + 1)}
                disabled={isLoading}
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
