import { ELanguage } from '@/models/language.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { TArticleLocalized } from '@/db/schema';
import { getImageSrc } from '@/controllers/articles.controller';

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
        const imgPath = getImageSrc(post.slug, post.imageSrc, true);

        return {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          url: `${BASE_URL}/${lang}/${BLOG}/${post.slug}`,
          datePublished: post.createdAt.toISOString(),
          dateModified: post.updatedAt.toISOString(),

          image: {
            '@type': 'ImageObject',
            url: imgPath,
            width: 1024,
            height: 1024,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/${lang}/${BLOG}/${post.slug}`,
          },
          author: {
            '@type': 'Person',
            name: 'Ezoteric',
            url: BASE_URL,
          },
          position: index + 1,
        };
      }),
    },
  };
};
