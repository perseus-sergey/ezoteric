import { IMG_PROPERTIES } from '@/models/image.model';
import Image from 'next/image';

interface IFillingImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src: string;
  alt?: string;
  isFillParent?: boolean;
  isBigImage?: boolean;
  isBlur?: boolean;
  blurImgPath?: string;
  isPriority?: boolean;
  quality?: number;
}

const FillingImg = ({
  width,
  height,
  src,
  alt = '',
  className,
  quality = 75,
  isFillParent = false,
  isBigImage = false,
  isBlur = false,
  isPriority = false,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
}: IFillingImgProps) =>
  isFillParent ? (
    <div
      style={{
        position: 'relative',
        height: `${height}px`,
        // maxHeight: '80vh',
        // width: `${width}px`,
        minWidth: isBigImage ? 0 : `${width}px`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        sizes={`${width}px`}
        fill
        style={{
          objectFit: 'contain',
        }}
        placeholder={isBlur ? 'blur' : 'empty'}
        blurDataURL={blurImgPath}
        priority={isPriority}
        quality={quality}
        className={`${isBigImage ? '' : 'shrink-0'} ${className ? className : ''}`}
      />
    </div>
  ) : (
    <Image
      width={width}
      height={height}
      className={`${isBigImage ? '' : 'shrink-0'} ${className ? className : ''}`}
      style={{ minWidth: width, minHeight: height }}
      placeholder={isBlur ? 'blur' : 'empty'}
      blurDataURL={blurImgPath}
      src={src}
      alt={alt}
      priority={isPriority}
    />
  );

export default FillingImg;
