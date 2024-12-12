import { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { ELanguage } from "@/models/language.model";
import { getELangKey } from "@/lib/utils/getLanguage";
import { ESegment, MAIN_URL } from "@/models/url.model";
import { DEFAULT_META_DATA } from "@/models/meta/home.model";
import { DEFAULT_META_OG } from "@/models/meta/root.model";

const basesUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

type TProps = Readonly<{
  children: React.ReactNode;
  params: { [key in ESegment]: string };
}>;

export const dynamicParams = false;

export const generateMetadata = async (props: TProps): Promise<Metadata> => {
  const { params } = await props;
  const lang = getELangKey(params.lang);

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

export default async function Layout(props: TProps) {
  const { params } = await props;

  const lang = getELangKey(params.lang);

  const { children } = props;

  return (
    <html lang={lang} className="!scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
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
      </body>
    </html>
  );
}
