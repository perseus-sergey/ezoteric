import { IUploadFile } from '@/models/uploadFile.model';
import Image from 'next/image';
import CopyClipboardBtn from './CopyClipboardBtn';
import { Trash } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';
import { LoadingAnimated } from '@/svg/LoadingAnimated';
import { clsx } from 'clsx';

export const PreviewUploaded = ({
  uploadFile,
  onRemove,
  isUploading = false,
  isDeleteProcess = false,
}: {
  uploadFile: IUploadFile;
  onRemove?: () => void;
  isDeleteProcess?: boolean;
  isUploading?: boolean;
}) => {
  const [delModalOpen, setDelModalOpen] = useState(false);

  const { name, url, contentType } = uploadFile;

  return (
    <div className="flex flex-col gap-2 group">
      <div className="size-32 bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith('image') ? (
            <Image
              key={url}
              src={url}
              width={64}
              height={64}
              alt={`An image uploadFile${name ? `: ${name}` : ''}`}
              className={clsx(
                'rounded-md size-full',
                isDeleteProcess && 'opacity-50'
              )}
            />
          ) : (
            <div className=""></div>
          )
        ) : (
          <div className=""></div>
        )}

        {isUploading && <LoadingAnimated />}

        {onRemove !== undefined && !isDeleteProcess && (
          <>
            <CopyClipboardBtn
              value={url}
              title="Copy path"
              className="group-hover:visible invisible size-fit p-2 bg-secondary/70 rounded-full absolute right-1 bottom-1"
            />

            <button
              className="group-hover:visible invisible size-fit p-2 bg-destructive/70 text-white rounded-full absolute left-1 bottom-1"
              title="Delete image"
              onClick={() => setDelModalOpen(true)}
            >
              <Trash size={12} className="hover:scale-125 duration-100" />
            </button>

            <ConfirmDialog
              onOpenChange={setDelModalOpen}
              open={delModalOpen}
              title="Delete image"
              description="Are you sure you want to delete this image from storage?"
              confirmBtnCaption="Delete"
              cancelBtnCaption="Cancel"
              onConfirm={onRemove}
            />
          </>
        )}
      </div>

      <div className="text-xs max-w-32 truncate">{name}</div>
    </div>
  );
};
