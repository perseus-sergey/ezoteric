import { Mail, PhoneCall } from 'lucide-react';
import { Title } from '@/components/custom/Title';
import { getELangKey } from '@/lib/utils/getLanguage';
import { cn } from '@/lib/utils/utils';
import Image from 'next/image';
import sunrise_meditation_1200 from '../../../public/images/sunrise_meditation_1200.jpg';
import hands_with_artifacts_500 from '../../../public/images/hands_with_artifacts_500.jpg';
import { MAIN_TEXT } from '@/models/meta/home.model';
import NumerologyForm from '@/components/custom/numerology-form';
import Link from 'next/link';
import { TParams } from '@/models/url.model';
import { FOOTER_MODEL } from '@/models/header.model';

const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';
const sitePhone = process.env.NEXT_PUBLIC_SITE_PHONE || '';

const {
  h1,
  h1_p,
  h2_1,
  h2_1_p,
  h1_img_alt,
  h2_1_ul,
  h2_1_img_alt,
  h2_2,
  h2_2_p,
  numerologyForm,
} = MAIN_TEXT;

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return (
    <article className="relative mx-auto">
      <div className="relative mx-auto">
        <Image src={sunrise_meditation_1200} alt={h1_img_alt[lang]} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-65% to-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-90% to-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent from-90% to-secondary"></div>
      </div>

      <Title>{h1[lang]}</Title>

      {h1_p[lang].map((text, i) => (
        <p key={i}>{text}</p>
      ))}

      <section className="py-4">
        <TitleH2>{h2_1[lang]}</TitleH2>
        <div className="flex flex-wrap lg:flex-nowrap">
          <div className="relative lg:shrink-0 mx-auto lg:m-0">
            <Image src={hands_with_artifacts_500} alt={h2_1_img_alt[lang]} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-65% to-secondary"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent from-90% to-secondary"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-90% to-secondary"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent from-90% to-secondary"></div>
          </div>

          <div className="space-y-8">
            {h2_1_p[lang].map((text, i) => (
              <p key={i} className="text-center p-4 text-xl">
                {text}
              </p>
            ))}
            <ul className="p-0 sm:pl-8">
              {h2_1_ul[lang].map((li) => (
                <li key={li[0]} className="py-1">
                  <strong>{li[0]}</strong>: {li[1]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="p-4 flex gap-8 items-center justify-center flex-wrap lg:flex-nowrap bg-slate-300 dark:bg-slate-600">
        <div>
          <TitleH2>{h2_2[lang]}</TitleH2>

          {h2_2_p[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}

          <h3 className="font-bold font-georgia p-1 sm:p-2 text-center text-xl sm:text-2xl">
            {numerologyForm.resultDescription.title[lang]}
          </h3>
          {numerologyForm.resultDescription.texts[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <NumerologyForm lang={lang} />
      </section>

      <TitleH2>{FOOTER_MODEL.title[lang]}</TitleH2>
      <p className="text-center font-semibold text-xl pb-4 font-georgia">
        {FOOTER_MODEL.description[lang]}
      </p>
      <ul className="flex flex-wrap items-center gap-4 justify-evenly">
        <li className="flex items-center gap-2">
          <Mail className="opacity-50" /> Email:{' '}
          <Link
            className="hover:opacity-75"
            href={`mailto:${siteMail}`}
            aria-label={FOOTER_MODEL.mail.ariaLabel[lang]}
          >
            {siteMail}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <PhoneCall className="opacity-50" />{' '}
          {FOOTER_MODEL.phone.caption[lang]}:{' '}
          <Link
            className="hover:opacity-75"
            href={`tel:${sitePhone.replace(/\s+/g, '')}`}
            aria-label={FOOTER_MODEL.phone.ariaLabel[lang]}
          >
            {sitePhone}
          </Link>
        </li>
      </ul>

      {/* <ChatWidget key={id} id={id} initialMessages={[]} lang={lang} /> */}
    </article>
  );
}

interface ITitleH2 extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const TitleH2 = ({ children, className, ...attributes }: ITitleH2) => (
  <h2
    className={cn(
      'font-bold font-georgia p-2 sm:p-6 text-center text-2xl sm:text-3xl',
      className
    )}
    {...attributes}
  >
    {children}
  </h2>
);
