// import { Mail, PhoneCall } from 'lucide-react';
import { getELangKey } from '@/lib/utils/getLanguage';
import Image from 'next/image';
import { MAIN_TEXT, NUMEROLOGY_JSX } from '@/models/meta/home.model';
import { MAIN_DEV_URL, MAIN_URL, TParams } from '@/models/url.model';
import { Title } from '@/components/custom/Title';

import hands_with_artifacts_500 from '@/public/images/hands_with_artifacts_500.jpg';
import main_h1_21 from '@/public/images/main_h1_21.jpg';
import { TarotTwoCards } from '@/svg/TarotTwoCards';
import { fetchJsonLd } from '@/lib/utils/utils';
import NumerologyForm from '@/components/custom/numerology-form';

// const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';
// const sitePhone = process.env.NEXT_PUBLIC_SITE_PHONE || '';

const BASE_URL =
  process.env.NODE_ENV !== 'production'
    ? MAIN_DEV_URL
    : process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

const { h1, startBlock, ourServices, startBlockImgAlt } = MAIN_TEXT;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 24 hours

export const dynamicParams = false;

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  const apiRoute = `${BASE_URL}/api/jsonld?lang=${lang}`;
  const jsonLD = await fetchJsonLd(apiRoute);
  // console.log('🚀 ~ Page ~ jsonLD:', jsonLD);

  return (
    <article className="relative mx-auto">
      <div className="relative">
        <Title className="sm:absolute top-0 left-0 to-transparent sm:py-20 py-14">
          {h1[lang]}
        </Title>

        <Image
          src={main_h1_21}
          alt={startBlockImgAlt[lang]}
          placeholder="blur"
          className="rounded-md hidden sm:block"
        />

        <div className="sm:bg-transparent bg-tertiary sm:bg-gradient-to-t from-70% from-tertiary to-transparent py-6 px-12 sm:pt-14 my-2 sm:m-0 sm:absolute bottom-0 left-0 rounded-md">
          {startBlock[lang]}
        </div>
      </div>

      <section className="py-4">
        <Title titleType="h2">{ourServices.title[lang]}</Title>

        <div className="px-8 md:pl-24 bg-secondary/90 rounded-lg my-2 flex items-center justify-around flex-wrap md:flex-nowrap gap-x-8 py-6">
          <div>{ourServices.text[lang]}</div>

          <TarotTwoCards className="size-20 text-foreground/40 shrink-0" />
        </div>

        <div className="flex flex-col lg:flex-row lg:h-[500px] h-fit items-center justify-center rounded-lg bg-secondary text-secondary-foreground overflow-hidden">
          <div className="relative lg:shrink-0 mx-auto lg:m-0">
            <Image
              src={hands_with_artifacts_500}
              alt={ourServices.imgAlt[lang]}
              placeholder="blur"
              className="shrink-0 rounded-none lg:rounded-br-[200px]"
            />
          </div>

          <div className="h-full p-6">
            <ul className="h-full flex flex-col justify-evenly">
              {ourServices.serviceList[lang].map((li) => (
                <li key={li[0]} className="py-1">
                  <strong>{li[0]}</strong>: {li[1]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="p-4 sm:px-12 rounded-lg bg-tertiary">
        {NUMEROLOGY_JSX[lang]}

        <NumerologyForm lang={lang} className="my-4" />
      </section>

      {/* <Title titleType="h2">{FOOTER_MODEL.title[lang]}</Title>
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
      </ul> */}

      {jsonLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
      )}
    </article>
  );
}

// img
// 9
// 11
// 13
// 17
// 19
// 20
