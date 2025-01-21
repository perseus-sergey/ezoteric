import { IUploadFile } from '@/models/uploadFile.model';
import { LoaderIcon } from './icons';
import Image from 'next/image';

export const PreviewUploaded = ({
  uploadFile,
  isUploading = false,
}: {
  uploadFile: IUploadFile;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = uploadFile;

  return (
    <div className="flex flex-col gap-2 max-w-16">
      <div className="h-20 w-16 bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith('image') ? (
            <Image
              key={url}
              src={url}
              width={64}
              height={80}
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
      </div>

      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
