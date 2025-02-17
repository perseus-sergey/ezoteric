import { TTagLocalized } from '@/db/schema';
import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const ARTICLE_IMG = {
  path: '/images/post/',

  size: { width: 800, height: 800 },

  getAlt(title: string) {
    return {
      [UA]: `Ілюстрація до статті "${title}"`,
      [EN]: `Illustration for the article "${title}"`,
    };
  },
};

export const NOT_PUBLISHED = {
  [UA]: 'Ви переглядаєте неопубліковану версію статті. Будь ласка, зверніть увагу, що інформація може бути застарілою або неточною. Слідкуйте за оновленнями.',
  [EN]: 'You are viewing an unpublished version of the article. Please note that the information may be out of date or inaccurate. Stay tuned for updates.',
};

export type TArticleLocalized = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  imageSrc: string | null;
  published?: boolean;
  description: string;
  title: string;
  keywords?: string;
  text?: string;
  spotifyId?: string | null;
  viewCount: number;
  articleTags?:
    | {
        tag: TTagLocalized;
      }[]
    | null;
};
