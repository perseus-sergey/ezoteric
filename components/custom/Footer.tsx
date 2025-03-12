import { ELanguage } from '@/models/language.model';
import { FOOTER_MODEL } from '@/models/header.model';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Bonsai } from '@/svg/Bonsai';
import MeetDialog from './MeetDialog';
import { MaskWaveTopSlow } from '@/svg/MaskWaveTop';
import { SITE_DOMAIN } from '@/models/root.model';

const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';
// const sitePhone = process.env.NEXT_PUBLIC_SITE_PHONE || '';

export default async function Footer({
  lang,
  isAuthorizedUser,
  isAdmin,
}: {
  lang: ELanguage;
  isAuthorizedUser: boolean;
  isAdmin: boolean;
}) {
  return (
    <>
      <MaskWaveTopSlow className="w-full rotate-180 text-secondary translate-y-px" />
      <footer className="relative w-full pb-4 px-4 font-georgia bg-secondary flex flex-col gap-x-12">
        <section className="flex flex-col justify-start gap-2 sm:-translate-y-4">
          <h2 className="text-xl font-bold py-2">
            {FOOTER_MODEL.description[lang]}
          </h2>

          {isAdmin && (
            <MeetDialog
              lang={lang}
              isAuthorized={isAuthorizedUser}
              withIcons
              className="flex items-center gap-2"
            />
          )}

          <Link
            className="flex flex-row items-center gap-2 hover:opacity-75"
            href={`mailto:${siteMail}`}
            aria-label={`Send mail to ${siteMail}`}
          >
            <Mail className="opacity-50" />
            {siteMail}
          </Link>

          {/* <li className="flex items-center gap-2">
            <PhoneCall className="opacity-50" />{' '}
            {FOOTER_MODEL.phone.caption[lang]}:{' '}
            <Link
              className="hover:opacity-75"
              href={`tel:${sitePhone.replace(/\s+/g, '')}`}
              aria-label={FOOTER_MODEL.phone.ariaLabel[lang]}
            >
              {sitePhone}
            </Link>
          </li> */}
        </section>

        <div className="flex flex-col gap-2 w-full sm:w-fit mt-4 sm:m-0 items-center sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2">
          <Bonsai className="sm:size-12 size-10 opacity-40" />

          <span className="text-sm">© 2024 | {SITE_DOMAIN}</span>
        </div>
      </footer>
    </>
  );
}
