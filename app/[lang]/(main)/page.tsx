// import { Mail, PhoneCall } from 'lucide-react';
import { getELangKey } from '@/lib/utils/getLanguage';
import Image from 'next/image';
import { MAIN_TEXT } from '@/models/meta/home.model';
import NumerologyForm from '@/components/custom/numerology-form';
import { MAIN_URL, TParams } from '@/models/url.model';
import { Title } from '@/components/custom/Title';
import { DEFAULT_META_DATA } from '@/models/meta/default.model';
import { generatePostJsonLd } from '@/lib/utils/generatePostJsonLd';

import hands_with_artifacts_500 from '@/public/images/hands_with_artifacts_500.jpg';
import main_h1_21 from '@/public/images/main_h1_21.jpg';

// const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';
// const sitePhone = process.env.NEXT_PUBLIC_SITE_PHONE || '';

const { h1, startText, ourServices, startTextImgAlt, numerForm } = MAIN_TEXT;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 24 hours

export const dynamicParams = false;

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  const jsonLD = generatePostJsonLd({
    lang,
    imgHeight: main_h1_21.height,
    imgWidth: main_h1_21.width,
    article: {
      id: 0,
      slug: '',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date(),
      imageSrc: `${BASE_URL}/images/main_h1_21.jpg`,
      viewCount: 1,
      ...DEFAULT_META_DATA[lang],
      text: [
        [...startText[lang].map((text) => `<p>${text}</p>`)],
        [...ourServices.text[lang].map((text) => `<p>${text}</p>`)],
        `<ul className="h-full flex flex-col justify-evenly">
        ${ourServices.serviceList[lang].map((li) => `<li><strong>${li[0]}</strong>: ${li[1]}</li>`)}
        </ul>`,
      ].join(''),
    },
  });

  return (
    <article className="relative mx-auto">
      <div className="relative">
        <Title className="sm:absolute top-0 left-0 to-transparent sm:py-20 py-14">
          {h1[lang]}
        </Title>

        <Image
          src={main_h1_21}
          alt={startTextImgAlt[lang]}
          placeholder="blur"
          className="rounded-md hidden sm:block"
        />

        <div className="sm:bg-transparent bg-tertiary sm:bg-gradient-to-t from-70% from-tertiary to-transparent p-6 sm:pt-14 my-2 sm:m-0 sm:absolute bottom-0 left-0 rounded-md">
          {startText[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>

      <section className="py-4">
        <Title titleType="h2">{ourServices.title[lang]}</Title>

        <div className="bg-secondary/90 rounded-lg my-2 p-6">
          {ourServices.text[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:h-[500px] h-fit items-center justify-center rounded-lg bg-secondary text-secondary-foreground overflow-hidden">
          <div className="relative lg:shrink-0 mx-auto lg:m-0">
            <Image
              src={hands_with_artifacts_500}
              alt={ourServices.imgAlt[lang]}
              placeholder="blur"
              className="shrink-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-80% to-secondary"></div>
            <div className="lg:hidden absolute inset-0 bg-gradient-to-l from-transparent from-80% to-secondary"></div>
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

      <section className="p-4 rounded-lg flex gap-8 items-center justify-center flex-wrap lg:flex-nowrap bg-tertiary">
        <div>
          <Title titleType="h2" className="mb-4">
            {numerForm.title[lang]}
          </Title>

          {numerForm.text[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}

          <h3 className="font-bold font-georgia p-1 sm:p-2 text-center text-xl sm:text-2xl">
            {numerForm.form.resultDescription.title[lang]}
          </h3>
          {numerForm.form.resultDescription.texts[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <NumerologyForm lang={lang} />
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

      {/* <ChatWidget key={id} id={id} initialMessages={[]} lang={lang} /> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLD),
        }}
      />
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
