'use client';

import { PreviewUploaded } from '@/components/custom/PreviewUploaded';
import { Button } from '@/components/ui/button';
import { getArticleByImage } from '@/db/queriesArticle';
import { makeUrlSearchParams } from '@/lib/utils/urlMaker';
import { DEFAULT_LANG } from '@/models/language.model';
import {
  IUploadFile,
  IUploadBlobResponse,
  IBlobListResponse,
} from '@/models/uploadFile.model';
import { ESegment, EUrlSearchParam } from '@/models/url.model';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { DownloadCloud, ExternalLink, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const VercelBlobWidget = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [files, setFiles] = useState<Array<IUploadFile>>([]);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteProcess, setIsDeleteProcess] = useState(false);

  const fetchBlobs = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      // If resetList is true, we're fetching the first page
      const queryParams = new URLSearchParams();
      if (cursor) {
        queryParams.append('cursor', cursor);
      }

      const response = await fetch(
        `/api/files/upload?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch blobs');
      }

      const result = (await response.json()) as IBlobListResponse;

      // filter files already uploaded
      const newFiles = result.blobs.filter(
        (file) => !files.some((existingFile) => existingFile.url === file.url)
      );

      // If resetting list, replace blobs. Otherwise, append.
      setFiles((prevBlobs) => [
        ...prevBlobs,
        ...newFiles.map(({ url, pathname }) => ({
          name: pathname,
          url,
          contentType: 'image',
        })),
      ]);

      // Update cursor and hasMore status
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to fetch blobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, cursor, files]);

  useEffect(() => {
    fetchBlobs();
  }, []);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadDir', 'post');

    try {
      const response = await fetch(`/api/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()) as IUploadBlobResponse;
        const { url, pathname, contentType } = data;

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
      toast.error(`Failed to upload file! Error: ${(error as Error).message}`);
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      if (selectedFiles.length === 0) return;

      // Фільтруємо файли, які вже існують
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

      setUploadQueue(newFiles.map((file) => file.name));

      try {
        const uploadPromises = newFiles.map((file) => uploadFile(file));
        const uploadedFiles = await Promise.all(uploadPromises);
        const successfullyUploadedFiles = uploadedFiles.filter(
          (file) => file !== undefined
        );

        setFiles((currentFiles) => [
          ...successfullyUploadedFiles,
          ...currentFiles,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setFiles, files]
  );

  const handleRemove = useCallback(async (fileUrl: string) => {
    setIsDeleteProcess(true);
    const findDbRes = await getArticleByImage(fileUrl);

    if (findDbRes instanceof Error) {
      toast.error('Error occurred while searching for this image in database');
      return;
    }
    if (findDbRes) {
      toast.error(
        () => (
          <div className="flex flex-col gap-2 items-center w-full">
            <p className="flex items-center gap-2">
              File is already used in published article
            </p>
            <Link
              href={`/${DEFAULT_LANG}/${ESegment.BLOG}/${findDbRes.slug}`}
              className="flex gap-1 items-center justify-center"
            >
              <span className="font-bold underline">{findDbRes.title}</span>

              <ExternalLink className="size-3 text-stone-600" />
            </Link>
            <p className="text-right">
              First remove the article from published
            </p>
          </div>
        ),
        { duration: 8000 }
      );
      return;
    }

    const searchParams = makeUrlSearchParams({
      [EUrlSearchParam.URL]: fileUrl,
    }).toString();

    try {
      const response = await fetch(`/api/files/upload?${searchParams}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.url !== fileUrl)
        );
        toast.success('SUCCESS: File deleted!');
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error(`Error deleting file! ${error}`);
    } finally {
      setIsDeleteProcess(false);
    }
  }, []);

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

      {files?.length > 0 || uploadQueue?.length > 0 || isLoading ? (
        <>
          <div className="flex flex-wrap justify-center gap-2">
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
                onClick={fetchBlobs}
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
};

export default VercelBlobWidget;
