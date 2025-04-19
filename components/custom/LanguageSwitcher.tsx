'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ELanguage } from '@/models/language.model';
import { Button } from '../ui/button';
import { LANGUAGE_SELECT } from '@/models/header.model';
import { TooltipSimple } from './TooltipSimple';
import { useEffect, useState } from 'react';

const { EN, UA } = ELanguage;

const LANGUAGE_STORAGE_KEY = 'ezoteric_net_language';

const getLanguageFromStorage = (): ELanguage | null => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && (storedLanguage === EN || storedLanguage === UA)) {
    return storedLanguage as ELanguage;
  }
  return null;
};

const setLanguageToStorage = (lang: ELanguage) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
};

const LanguageSwitcher = ({
  withCaption = false,
}: {
  withCaption?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentUrlLang = pathname.split('/')[1];
  const urlLang = getELangKey(currentUrlLang);

  const [currentLang, setCurrentLang] = useState<ELanguage>(EN); // Default to EN initially

  useEffect(() => {
    // 1. Check localStorage on component mount
    const storedLang = getLanguageFromStorage();
    if (storedLang) {
      setCurrentLang(storedLang);
      // If localStorage language is different from URL language, update URL to match localStorage
      if (storedLang !== urlLang) {
        const pathSegments = pathname.split('/');
        pathSegments[1] = storedLang;
        const newPath = pathSegments.join('/');
        router.replace(newPath); // Update URL to localStorage language
        return; // Prevent further language setting logic in this effect
      }
    } else if (urlLang) {
      // 2. If no localStorage, use URL language if valid
      setCurrentLang(urlLang);
      setLanguageToStorage(urlLang); // Store URL language in localStorage for future visits
    } else {
      // 3. If neither localStorage nor URL language, default to EN (already set as initial state)
      setLanguageToStorage(EN);
    }
  }, [pathname, urlLang, router]);

  const { ariaLabel, caption, icon } = LANGUAGE_SELECT[currentLang];

  const handleLanguageChange = () => {
    const newLang = currentLang === EN ? UA : EN;
    setCurrentLang(newLang);
    setLanguageToStorage(newLang);

    const pathSegments = pathname.split('/');
    pathSegments[1] = newLang;
    const newPath = pathSegments.join('/');
    router.replace(newPath);
  };

  return (
    <TooltipSimple content={ariaLabel}>
      <Button
        variant="ghost"
        className={!withCaption ? 'size-10 [&_svg]:size-6' : 'gap-4'}
        onClick={handleLanguageChange}
      >
        {icon}
        {withCaption && caption}
        {!withCaption && <span className="sr-only">{ariaLabel}</span>}
      </Button>
    </TooltipSimple>
  );
};

export default LanguageSwitcher;
