import { ELanguage } from './language.model';

const { UA, EN } = ELanguage;

export interface EBreadcrumb {
  title: string;
  href?: string;
}

export const homeAriaLabel = {
  [UA]: 'На головну сторінку',
  [EN]: 'Go to the Homepage',
};

export const PAGE_CAPTION = {
  [UA]: 'Сторінка',
  [EN]: 'Page',
};
