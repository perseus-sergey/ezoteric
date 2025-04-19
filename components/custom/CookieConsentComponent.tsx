'use client';

import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { run } from 'vanilla-cookieconsent';
import { useEffect } from 'react';
import { COOKIES_CONSENT } from '@/models/consent.model';
import { ELanguage } from '@/models/language.model';
import { MANAGE_COOKIE_BTN } from '@/models/header.model';

const { UA, EN } = ELanguage;
export default function CookieConsentComponent({ lang }: { lang: ELanguage }) {
  useEffect(() => {
    run({
      categories: {
        necessary: {
          enabled: true, // this category is enabled by default
          readOnly: true, // this category cannot be disabled
        },

        functionality: {},

        analytics: {},
      },

      language: {
        default: lang,
        translations: {
          en: COOKIES_CONSENT[EN],
          uk: COOKIES_CONSENT[UA],
        },
      },
    });
  }, [lang]);

  return (
    <button
      className="hover:opacity-75"
      type="button"
      data-cc="show-preferencesModal"
      aria-label={MANAGE_COOKIE_BTN[lang].description}
    >
      {MANAGE_COOKIE_BTN[lang].caption}
    </button>
  );
}
