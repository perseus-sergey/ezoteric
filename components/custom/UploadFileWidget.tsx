'use client';

import { PaperclipIcon } from '@/components/custom/icons';
import { PreviewUploaded } from '@/components/custom/PreviewUploaded';
import { Button } from '@/components/ui/button';
import { IUploadFile } from '@/models/uploadFile.model';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

const UploadFileWidget = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [files, setFiles] = useState<Array<IUploadFile>>([]);

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
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedFiles = await Promise.all(uploadPromises);
        const successfullyUploadedFiles = uploadedFiles.filter(
          (file) => file !== undefined
        );

        setFiles((currentFiles) => [
          ...currentFiles,
          ...successfullyUploadedFiles,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setFiles]
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

      {(files.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {files.map((file) => (
            <PreviewUploaded key={file.url} uploadFile={file} />
          ))}

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
        </div>
      )}

      <Button
        className="rounded-full p-1.5 size-fit m-4"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
      >
        <PaperclipIcon />
      </Button>
    </>
  );
};

export default UploadFileWidget;
