import { isFileExists } from '@/lib/utils/imagePathValidate';
import { ARTICLE_IMG } from '@/models/article.model';
import { BLOG_CARD_IMAGE } from '@/models/blog.model';
import { MAIN_URL } from '@/models/url.model';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const getImageSrc = (
  articleSlug: string,
  articleImageSrc: string | null,
  isFullPath = false,
  defaultSrc = BLOG_CARD_IMAGE.defaultImgSrc
) => {
  const localImgSrc = `${ARTICLE_IMG.path}${`${articleSlug}.jpg`}`;
  const defaultImgSrc = `${isFullPath ? BASE_URL : ''}${defaultSrc}`;

  return articleImageSrc && articleImageSrc.startsWith('https://')
    ? articleImageSrc
    : isFileExists(localImgSrc)
      ? `${isFullPath ? BASE_URL : ''}${localImgSrc}`
      : defaultImgSrc;
};
