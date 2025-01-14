import { ARTICLE_IMG } from '@/models/article.model';
import { ELanguage } from '@/models/language.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { isFileExists } from './imagePathValidate';
import { TArticleLocalized } from '@/db/schema';
import { BLOG_CARD_IMAGE } from '@/models/blog.model';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

const { BLOG } = ESegment;

export const generatePostListJsonLd = ({
  lang,
  title,
  description,
  posts,
}: {
  lang: ELanguage;
  title: string;
  description: string;
  posts: TArticleLocalized[] | null;
}) => {
  if (!posts) return {};

  return {
    '@context': 'https://schema.org/',
    '@type': 'CollectionPage',
    headline: title,

    inLanguage: lang,

    description,

    url: `${BASE_URL}/${lang}/${BLOG}`,

    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'http://schema.org/ItemListOrderAscending',
      itemListElement: posts.map((post, index) => {
        const imgSrc = `${ARTICLE_IMG.path}${post.imageName || `${post.slug}.jpg`}`;
        const imgPath = isFileExists(imgSrc)
          ? imgSrc
          : BLOG_CARD_IMAGE.defaultImgSrc;

        return {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          url: `${BASE_URL}/${lang}/${BLOG}/${post.slug}`,
          datePublished: post.createdAt.toISOString(),
          dateModified: post.updatedAt.toISOString(),

          image: {
            '@type': 'ImageObject',
            url: `${BASE_URL}${imgPath}`,
            width: 1024,
            height: 1024,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/${lang}/${BLOG}/${post.slug}`,
          },
          position: index + 1,
        };
      }),
    },
  };
};
