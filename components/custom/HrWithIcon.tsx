import { ELanguage } from '@/models/language.model';
import { NumerologyPictogram } from '@/svg/NumerologyPictogram';
import { ReactNode } from 'react';

export const HrWithIcon = ({
  lang,
  children = (
    <NumerologyPictogram
      lang={lang}
      className="size-5 text-foreground/50 mx-2"
    />
  ),
}: {
  lang: ELanguage;
  children?: ReactNode;
}) => (
  <div className="inline-flex items-center justify-center w-full my-8">
    <hr className="w-24 h-px bg-foreground/20 border-0" />
    {/* <BasilLeaves lang={lang} className="size-8 text-foreground/80" /> */}
    {children}
    <hr className="w-24 h-px bg-foreground/20 border-0" />
  </div>
);
