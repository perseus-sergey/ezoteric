export enum ELanguage {
  UA = "uk",
  EN = "en",
}

const { UA, EN } = ELanguage;

export const DEFAULT_LANG = EN;

export interface ILang {
  [UA]: string;
  [EN]: string;
}
