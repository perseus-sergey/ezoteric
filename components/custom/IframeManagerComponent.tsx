'use client';

// import { useEffect } from 'react';
// import iframemanager from '@orestbida/iframemanager';
// import {
//   getUserPreferences,
//   acceptService as cookieConsentAcceptService,
// } from 'vanilla-cookieconsent';
import { ELanguage } from '@/models/language.model';

export default function IframeManagerComponent({ lang }: { lang: ELanguage }) {
  // useEffect(() => {
  //   const im = iframemanager();

  //   im.run({
  //     currLang: lang, // або динамічно встановлюйте мову, наприклад, з контексту
  //     services: {
  //       spotify: {
  //         embedUrl:
  //           'https://open.spotify.com/embed/track/{data-id}?utm_source=generator',
  //         iframe: {
  //           allow:
  //             'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  //         },
  //         languages: {
  //           uk: {
  //             notice:
  //               'Цей контент розміщено стороннім сервісом Spotify.  При показі зовнішнього контенту ви приймаєте <a rel="noreferrer noopener" href="https://www.spotify.com/legal/end-user-agreement/" target="_blank">умови використання</a> spotify.com.',
  //             loadBtn: 'Завантажити Spotify плеєр',
  //             loadAllBtn: 'Завжди завантажувати Spotify плеєр',
  //           },
  //           en: {
  //             notice:
  //               'This content is hosted by a third-party service Spotify. By showing the external content you accept the <a rel="noreferrer noopener" href="https://www.spotify.com/legal/end-user-agreement/" target="_blank">terms and conditions</a> of spotify.com.',
  //             loadBtn: 'Load Spotify Player',
  //             loadAllBtn: 'Always load Spotify Player',
  //           },
  //         },
  //       },
  //       // Додайте конфігурації для інших iframe сервісів, якщо потрібно (YouTube, Vimeo, тощо)
  //     },
  //     onChange: ({ changedServices, eventSource }) => {
  //       if (eventSource.type === 'click') {
  //         const servicesToAccept = [
  //           ...(getUserPreferences().acceptedServices['functionality'] || []), // Залежить від категорії, яку ви використовуєте для iframe
  //           ...changedServices,
  //         ];
  //         cookieConsentAcceptService(servicesToAccept, 'functionality'); // Ваша категорія для iframe
  //       }
  //     },
  //   });

  //   return () => {
  //     im.reset(true); // Важливо для React компонентів при unmount
  //   };
  // }, []);

  return lang; // Компонент не рендерить нічого видимого
}
