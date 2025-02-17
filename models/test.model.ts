import { TTestCategoryLocalized } from '@/db/schema';
import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export const TEST_IMG = {
  path: '/images/post/',

  size: { width: 800, height: 800 },

  getAlt(title: string) {
    return {
      [UA]: `Ілюстрація до тесту "${title}"`,
      [EN]: `Illustration for the test "${title}"`,
    };
  },
};

export const NOT_PUBLISHED = {
  [UA]: 'Ви переглядаєте неопубліковану версію тесту. Будь ласка, зверніть увагу, що інформація може бути застарілою або неточною. Слідкуйте за оновленнями.',
  [EN]: 'You are viewing an unpublished version of the test. Please note that the information may be out of date or inaccurate. Stay tuned for updates.',
};

export type TTestLocalized = {
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
  category: TTestCategoryLocalized;
};
