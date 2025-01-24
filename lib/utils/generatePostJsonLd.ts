import { TArticleLocalized } from '@/db/schema';
import { ARTICLE_IMG } from '@/models/article.model';
import { ELanguage } from '@/models/language.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { isFileExists } from './imagePathValidate';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

const { BLOG } = ESegment;

export const generatePostJsonLd = ({
  lang,
  article,
  imgSrc,
  imgHeight,
  imgWidth,
  isMainPage = false,
}: {
  lang: ELanguage;
  article: TArticleLocalized;
  imgSrc?: string;
  imgWidth?: number;
  imgHeight?: number;
  isMainPage?: boolean;
}) => {
  const imgPath =
    imgSrc || `${ARTICLE_IMG.path}${article.imageSrc || `${article.slug}.jpg`}`;
  const isImgExists = isFileExists(imgPath);
  const relativeImgPath = isImgExists ? imgPath : undefined;
  return {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline: article.title,

    inLanguage: lang,

    ...(relativeImgPath
      ? {
          image: {
            '@type': 'ImageObject',
            url: `${BASE_URL}${relativeImgPath}`,
            width: imgHeight || 1024,
            height: imgWidth || 1024,
          },
        }
      : {}),

    author: {
      '@type': 'Person',
      name: 'Ezoteric',
      url: `${BASE_URL}/${lang}`,
    },

    datePublished: article.createdAt.toISOString(),

    dateModified: article.updatedAt.toISOString(),

    description: article.description,

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${lang}${isMainPage ? '' : `/${BLOG}/${article.slug}`}`,
    },

    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME, // Your website name
      url: `${BASE_URL}/${lang}`,
      // logo: {
      //   // Optional: Your website logo URL
      //   '@type': 'ImageObject',
      //   url: `${BASE_URL}/Images/InstallsatOrig_400.png`,
      // },
    },

    ...(article.keywords ? { keywords: article.keywords } : {}),
    articleBody: article.text, //  The main text content (might be too long for search engines; consider using a summary)
  };
};
