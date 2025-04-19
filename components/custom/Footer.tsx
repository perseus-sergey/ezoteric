import { ELanguage } from '@/models/language.model';
import { FOOTER_MODEL, FOOTER_POLICIES } from '@/models/header.model';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { Bonsai } from '@/svg/Bonsai';
import MeetDialog from './MeetDialog';
import { MaskWaveTopSlow } from '@/svg/MaskWaveTop';
import { SITE_DOMAIN } from '@/models/root.model';
import CookieConsentComponent from './CookieConsentComponent';

// const siteMail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';
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
      <footer className="relative w-full pb-4 px-4 font-georgia bg-secondary flex gap-x-12">
        <section className="flex flex-col">
          <h2 className="text-xl font-bold py-2 flex items-center gap-2">
            <Shield className="opacity-70 size-5" />
            {FOOTER_MODEL.policies.title[lang]}
          </h2>

          <nav className="flex flex-col w-fit pl-6">
            {FOOTER_POLICIES[lang].map((item) => (
              <Link
                key={item.caption}
                className="hover:opacity-75"
                href={item.href}
                aria-label={item.description}
              >
                {item.caption}
              </Link>
            ))}

            <CookieConsentComponent lang={lang} />

            {isAdmin && (
              <MeetDialog
                lang={lang}
                isAuthorized={isAuthorizedUser}
                withIcons
                className="flex items-center gap-2"
              />
            )}
          </nav>
        </section>

        <div className="flex flex-col gap-2 w-full sm:w-fit mt-4 sm:m-0 items-center sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2">
          <Bonsai className="sm:size-12 size-10 opacity-40" />

          <span className="text-sm">
            © 2024 - {new Date().getFullYear()} | {SITE_DOMAIN}
          </span>
        </div>
      </footer>
    </>
  );
}
