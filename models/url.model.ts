export const MAIN_URL = 'https://ezoteric.net';

export enum EUrlSearchParam {
  QUERY = 'q',
  INTERVAL = 'interval',
  PAGE = 'page',
  DATE = 'date',
  LANGUAGE_URL = 'lang',
  LATITUDE = 'lat',
  LONGITUDE = 'lng',
  URL = 'url',
}

export enum ESegment {
  ID = 'id',
  LANG = 'lang',
  SLUG = 'slug',
  PAGE = 'page',
  MASTER = 'master',
  BLOG = 'blog',
  TAG = 'tag',
  ARTICLE_EDIT = 'edit',
  ARTICLE_ADD = 'add',
  UPLOAD_IMAGE = 'blob-storage',
  CHAT_VIEWER = 'chat-viewer',
  TAGS_EDIT = 'tags',
}

export type TParams = Promise<{ [key in ESegment]: string }>;

export type TSearchParams = Promise<{
  [key in EUrlSearchParam]: string | string[] | undefined;
}>;

export type TUrlSearchParams = Partial<
  Record<EUrlSearchParam, string | string[]>
>;
