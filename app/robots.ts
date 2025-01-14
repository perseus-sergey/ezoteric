import { ELanguage } from '@/models/language.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { MetadataRoute } from 'next';

const { MASTER } = ESegment;

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        ...Object.values(ELanguage).map((lang) => `/${lang}/${MASTER}/`),
        `/api/`,
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
