import { getPostsSiteMap, getTestsSiteMap } from '@/db/queriesSiteMap';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;
const { UA, EN } = ELanguage;

const { BLOG, TESTS } = ESegment;

type TChangeFrequency =
  | 'always'
  | 'never'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

interface IItemData {
  startPath?: ESegment;
  changeFrequency?: TChangeFrequency;
  addedPath?: string;
}

interface IItemsData extends IItemData {
  itemList: { slug: string; updatedAt?: Date }[];
}

const getSiteMapItem = ({
  startPath,
  changeFrequency = 'never',
}: IItemData) => {
  const endPath = startPath ? `/${startPath}` : '';

  return {
    url: `${BASE}/${DEFAULT_LANG}${endPath}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
    alternates: {
      languages: {
        en: `${BASE}/${EN}${endPath}`,
        uk: `${BASE}/${UA}${endPath}`,
      },
    },
  };
};

const getSiteMapItemList = ({
  startPath,
  itemList,
  changeFrequency = 'never',
  addedPath,
}: IItemsData) =>
  itemList.map((item) => {
    const endPath = `${startPath}/${item.slug}${addedPath ? `/${addedPath}` : ''}`;

    return {
      url: `${BASE}/${DEFAULT_LANG}/${endPath}`,
      lastModified: item.updatedAt
        ? item.updatedAt.toISOString()
        : new Date().toISOString(),
      changeFrequency,
      alternates: {
        languages: {
          en: `${BASE}/${EN}/${endPath}`,
          uk: `${BASE}/${UA}/${endPath}`,
        },
      },
    };
  });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postList = await getPostsSiteMap();
  const testList = await getTestsSiteMap();

  return [
    getSiteMapItem({ changeFrequency: 'daily' }),

    getSiteMapItem({ startPath: BLOG, changeFrequency: 'daily' }),

    getSiteMapItem({ startPath: TESTS, changeFrequency: 'daily' }),

    ...getSiteMapItemList({
      startPath: BLOG,
      itemList: postList,
      changeFrequency: 'daily',
    }),

    ...getSiteMapItemList({
      startPath: TESTS,
      itemList: testList,
      changeFrequency: 'daily',
    }),
  ];
}
