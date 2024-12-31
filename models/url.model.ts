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
  LOGIN = 'login',
  REGISTER = 'register',
  MASTER = 'master',
  ARTICLES = 'articles',
}

export type TParams = Promise<{ [key in ESegment]: string }>;

export type TSearchParams = Promise<{
  [key in EUrlSearchParam]: string | string[] | undefined;
}>;
