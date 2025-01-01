import { Metadata } from 'next';
import { Toaster } from 'sonner';

// import './globals.css';

import { Navbar } from '@/components/custom/navbar';
import { ThemeProvider } from '@/components/custom/theme-provider';
import { ELanguage } from '@/models/language.model';
import { getELangKey } from '@/lib/utils/getLanguage';
import { ESegment, MAIN_URL, TParams } from '@/models/url.model';
import { DEFAULT_META_OG } from '@/models/root.model';
import { DEFAULT_META_DATA } from '@/models/meta/default.model';

// =================================================================
// improve components/custom/NotFoundPage.tsx
// change comparing user with db app/[lang]/(auth)/auth.ts, db/queries.ts
// change app/[lang]/(main)/twitter-image.png, app/[lang]/(main)/opengraph-image.png, app/favicon.ico
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

  return (
    <html lang={lang} className="!scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-secondary">
        <main className="max-w-5xl mx-auto p-2 sm:px-4 pt-14">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            <Navbar lang={lang} />
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
