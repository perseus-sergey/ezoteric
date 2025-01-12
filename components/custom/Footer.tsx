import { ELanguage } from '@/models/language.model';
import { FOOTER_MODEL } from '@/models/header.model';
import { Mail, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';
const sitePhone = process.env.NEXT_PUBLIC_SITE_PHONE || '';

export const Footer = async ({ lang }: { lang: ELanguage }) => {
  return (
    <footer className="p-4 font-georgia bg-gradient-to-b from-tertiary/70 via-tertiary/90 to-tertiary/40 flex flex-wrap gap-8">
      <section className="w-44 sm:w-auto">
        <h2 className="text-xl font-bold text-center py-4">
          {FOOTER_MODEL.description[lang]}
        </h2>
        <ul className="flex flex-col space-y-2">
          <li className="flex items-center gap-2">
            <Mail className="opacity-50" /> Email:{' '}
            <Link
              className="hover:opacity-75"
              href={`mailto:${siteMail}`}
              aria-label={`Send mail to ${sitePhone}`}
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
      </section>
    </footer>
  );
};
