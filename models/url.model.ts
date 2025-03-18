export const MAIN_URL = 'https://www.ezoteric.net';
export const MAIN_DEV_URL = 'http://localhost:3000';

export const NUMEROLOGY_FORM_ID = 'numerology-form-id';

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
  PAGE = 'page',
  PAGE_ID = 'page-id',
  PAGE_TEST_ID = 'page-test-id',
  PAGE_TEST_CAT_ID = 'page-test-cat-id',
  CATEGORY = 'category',
  CATEGORIES_EDIT = 'categories',
  LANG = 'lang',
  SLUG = 'slug',
  TAG_SLUG = 'tag-slug',
  MASTER = 'master',
  SCHEDULE = 'schedule',
  APPOINTMENT = 'appointment',
  BLOG = 'blog',
  TESTS = 'tests',
  TEST_CAT_SLUG = 'test-cat-slug',
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
