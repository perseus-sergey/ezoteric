export const MAIN_URL = 'https://ezoteric.net';

export enum EUrlSearchParam {
  QUERY = 'q',
  INTERVAL = 'interval',
  PAGE = 'page',
  DATE = 'date',
  LANGUAGE_URL = 'lang',
  LATITUDE = 'lat',
  LONGITUDE = 'lng',
}

export enum ESegment {
  ID = 'id',
  LANG = 'lang',
  SLUG = 'slug',
  MASTER = 'master',
  BLOG = 'blog',
  ARTICLE_EDIT = 'edit',
  ARTICLE_ADD = 'add',
}

export type TParams = Promise<{ [key in ESegment]: string }>;

export type TSearchParams = Promise<{
  [key in EUrlSearchParam]: string | string[] | undefined;
}>;
