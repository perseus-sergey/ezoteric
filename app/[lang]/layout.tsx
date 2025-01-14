import { Metadata } from 'next';
import { Toaster } from 'sonner';

import { Header } from '@/components/custom/Header';
import { ThemeProvider } from '@/components/custom/theme-provider';
import { ELanguage } from '@/models/language.model';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import { DEFAULT_META_OG } from '@/models/root.model';
import { DEFAULT_META_DATA } from '@/models/meta/default.model';
import ChatWidget from '@/components/custom/ChatWidget';
import { generateUUID } from '@/lib/utils/utils';
import { Footer } from '@/components/custom/Footer';
import { auth } from '../(auth)/auth';
import { isAdminAuth } from '@/lib/utils/loggedUser';

// =================================================================
// поговорити з дочею про консультаціі (можливо поки що прибрати телефон та імейл)
// можливо створити сторінки в соцмережах з взаємними посиланнями
// blog: search input
// blog: priority for first img
// post-update: add checkbox 'published'
// improve components/custom/NotFoundPage.tsx
// meta for all pages
// chat: save to db || ls
// chat: add message time
// change the text components/custom/overview.tsx
// =================================================================

const basesUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

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
    metadataBase: new URL(basesUrl),
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

  const id = generateUUID();

  return (
    <html lang={lang} className="!scroll-smooth" suppressHydrationWarning>
      {/* <body className="antialiased min-h-dvh flex flex-col bg-[url('/images/esoteric_sunrise_meditation.jpg')] bg-no-repeat bg-cover bg-fixed"> */}
      <body className="antialiased min-h-dvh flex flex-col bg-[url('/images/ezoteric_1024.jpeg')] bg-no-repeat bg-cover bg-fixed">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          // disableTransitionOnChange
        >
          <Header isAdmin={isAdmin} session={session} lang={lang} />

          <main className="max-w-5xl flex-1 mx-auto pb-4 px-2 sm:px-4">
            <Toaster position="top-center" />
            {children}
            <ChatWidget
              key={id}
              id={id}
              initialMessages={[]}
              lang={lang}
              userImgSrc={session?.user?.image}
              userName={session?.user?.name}
            />
          </main>
        </ThemeProvider>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
