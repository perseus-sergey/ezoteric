'use client';

import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useState } from 'react';

interface IValidImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  defaultSrc: string;
  src: string;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  priority?: boolean;
  fill?: boolean;
}

const ValidImage = ({
  src,
  alt,
  defaultSrc,
  className,
  fill,
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
      fill={fill}
      {...props}
    />
  );
};

export default ValidImage;
