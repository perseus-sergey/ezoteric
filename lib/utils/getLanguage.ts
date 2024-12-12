import { DEFAULT_LANG, ELanguage } from "@/models/language.model";

export const getELangKey = (lang: string): ELanguage =>
  Object.values(ELanguage).includes(lang as ELanguage)
    ? (lang as ELanguage)
    : DEFAULT_LANG;
