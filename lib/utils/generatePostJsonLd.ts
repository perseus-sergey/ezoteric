import { ELanguage } from '@/models/language.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { getImageSrc } from '@/controllers/articles.controller';
import { TArticleLocalized } from '@/models/article.model';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

const { BLOG } = ESegment;

export const generatePostJsonLd = ({
  lang,
  article,
  imgHeight,
  imgWidth,
  isMainPage = false,
}: {
  lang: ELanguage;
  article: TArticleLocalized;
  imgWidth?: number;
  imgHeight?: number;
  isMainPage?: boolean;
}) => {
  const imageSrc = getImageSrc(article.slug, article.imageSrc, true, '');
  const imgPath = imageSrc || undefined;
  return {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline: article.title,

    inLanguage: lang,

    ...(imgPath
      ? {
          image: {
            '@type': 'ImageObject',
            url: imgPath,
            width: imgHeight || 828,
            height: imgWidth || 828,
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
