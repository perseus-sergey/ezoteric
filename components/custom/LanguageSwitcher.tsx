'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ELanguage } from '@/models/language.model';
import { Button } from '../ui/button';
import { LANGUAGE_SELECT } from '@/models/header.model';
import { clsx } from 'clsx';

const { EN, UA } = ELanguage;

const LanguageSwitcher = ({
  withCaption = false,
}: {
  withCaption?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentUrlLang = pathname.split('/')[1];
  const currentLang = getELangKey(currentUrlLang);

  const { ariaLabel, caption, icon } = LANGUAGE_SELECT[currentLang];

  const handleLanguageChange = () => {
    const newLang = currentLang === EN ? UA : EN;
    const pathSegments = pathname.split('/');
    pathSegments[1] = newLang;
    const newPath = pathSegments.join('/');
    router.replace(newPath);
  };

  return (
    <Button
      variant="ghost"
      className={clsx(!withCaption && 'size-10 [&_svg]:size-6')}
      onClick={handleLanguageChange}
    >
      {icon}
      {withCaption && caption}
      {!withCaption && <span className="sr-only">{ariaLabel}</span>}
    </Button>
  );
};

export default LanguageSwitcher;
