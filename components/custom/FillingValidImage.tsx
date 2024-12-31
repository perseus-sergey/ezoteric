import { IImgParams, IMG_PROPERTIES } from '@/models/image.model';
import FillingImg from './FillingImage';
import { imagePathValidate } from '@/lib/utils/imagePathValidate';

interface IFillingImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: IImgParams;
  defaultImage: IImgParams;
  alt?: string;
  isBlur?: boolean;
  blurImgPath?: string;
  isChangeToGif?: boolean;
  isFillParent?: boolean;
  isPriority?: boolean;
}

const FillingValidImage = ({
  image,
  defaultImage,
  alt = '',
  isBlur = false,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
  // isChangeToGif = false,
  isFillParent = false,
  isPriority,
  className,
}: IFillingImgProps) => {
  const validImg = imagePathValidate(image, defaultImage);
  // const validImg = imagePathValidate(image, defaultImage, isChangeToGif);

  return (
    <FillingImg
      {...validImg}
      alt={alt}
      isBlur={isBlur}
      blurImgPath={blurImgPath}
      isFillParent={isFillParent}
      className={className}
      isPriority={isPriority}
    />
  );
};

export default FillingValidImage;
