import { Metadata } from 'next';
import { Toaster } from 'sonner';

import { Header } from '@/components/custom/Header';
import { ThemeProvider } from '@/components/custom/theme-provider';
import { ELanguage } from '@/models/language.model';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import { BACKGROUND_IMG_ALT, DEFAULT_META_OG } from '@/models/root.model';
import { DEFAULT_META_DATA } from '@/models/meta/default.model';
import Footer from '@/components/custom/Footer';
import { auth } from '../(auth)/auth';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import Image from 'next/image';
import bgImg from '@/public/images/ezoteric_1024.jpeg';
import { Suspense } from 'react';

// =================================================================
// email to admin: На дату - додати Киівський час
// email to admin: Дата створення - з новоі строки
// appointment page - remove past dates from appointment schedule and from db (empty dates)
// apply deleting user account
// select quest - additional question during the session
// show and ability choose time zone in appointment booking form
// date not correct
// delene expirede empty dates from db
// not to show expired date in schedule
// change gemini-1.5 to 2.0 on installsat and 1plus2

// installsat: remove from sitemap pages with schedules (ask ai how it is better to do)
// installsat: remove redundant pages with pagination from sitemap

// можливо створити сторінки в соцмережах з взаємними посиланнями
// **Seamless Handoff:** If possible, integrate the booking system directly into the chat interface for a seamless transition from conversation to appointment scheduling.
// chat: add message time
// JsonLd: add site logo
// =================================================================

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

type TProps = Readonly<{
  children: React.ReactNode;
  params: TParams;
}>;

export const dynamicParams = false;

export const generateMetadata = async ({
  params,
}: TProps): Promise<Metadata> => {
  const p = await params;
  const lang = getELangKey(p.lang);

  return {
    metadataBase: new URL(baseUrl),
    ...DEFAULT_META_DATA[lang],
    openGraph: {
      ...DEFAULT_META_OG,
      title: DEFAULT_META_DATA[lang].title,
      description: DEFAULT_META_DATA[lang].description,
      url: `/${lang}`,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: `/${ELanguage.EN}`,
        uk: `/${ELanguage.UA}`,
      },
    },
  };
};

export async function generateStaticParams() {
  return Object.values(ELanguage).map((l) => ({ [ESegment.LANG]: l }));
}

export default async function Layout({ children, params }: TProps) {
  const p = await params;
  const lang = getELangKey(p.lang);

  const session = (await auth()) || undefined;
  const isAdmin = await isAdminAuth(session);

  return (
    <html lang={lang} className="!scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <div className="fixed overflow-hidden w-svw h-dvh -z-10">
          <Image
            alt={BACKGROUND_IMG_ALT[lang]}
            src={bgImg}
            placeholder="blur"
            // quality={100}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          // disableTransitionOnChange
        >
          <Suspense>
            <Header isAdmin={isAdmin} session={session} lang={lang} />
          </Suspense>

          <main className="max-w-5xl min-h-dvh flex-1 mx-auto pb-4 sm:px-4 flex flex-col">
            <Toaster position="top-center" richColors />
            {children}
          </main>
        </ThemeProvider>

        <Footer
          lang={lang}
          isAuthorizedUser={!!session?.user}
          isAdmin={isAdmin}
        />
      </body>
    </html>
  );
}
