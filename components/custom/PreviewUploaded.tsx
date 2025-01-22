import { IUploadFile } from '@/models/uploadFile.model';
import { LoaderIcon } from './icons';
import Image from 'next/image';
import CopyClipboardBtn from './CopyClipboardBtn';
import { Trash } from 'lucide-react';

export const PreviewUploaded = ({
  uploadFile,
  onRemove,
  isUploading = false,
}: {
  uploadFile: IUploadFile;
  onRemove?: () => void;
  isUploading?: boolean;
}) => {
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
              className="rounded-md size-full"
            />
          ) : (
            <div className=""></div>
          )
        ) : (
          <div className=""></div>
        )}

        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon />
          </div>
        )}

        {onRemove !== undefined && (
          <>
            <CopyClipboardBtn
              value={url}
              title="Copy path"
              className="group-hover:visible invisible size-fit p-2 bg-secondary/70 rounded-full absolute right-1 bottom-1"
            />

            <button
              className="group-hover:visible invisible size-fit p-2 bg-destructive/70 text-white rounded-full absolute left-1 bottom-1"
              title="Delete image"
              onClick={onRemove}
            >
              <Trash size={12} className="hover:scale-125 duration-100" />
            </button>
          </>
        )}
      </div>

      <div className="text-xs max-w-32 truncate">{name}</div>
    </div>
  );
};
