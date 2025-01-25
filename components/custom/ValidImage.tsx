'use client';

import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useState } from 'react';

interface IValidImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  defaultSrc: string;
  src: string;
  alt: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  placeholder?: PlaceholderValue | undefined;
  blurDataURL?: string | undefined;
  priority?: boolean | undefined;
}

const ValidImage = ({
  src,
  alt,
  defaultSrc,
  className,
  ...props
}: IValidImgProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(defaultSrc);
  };

  return (
    <Image
      className={className}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default ValidImage;
