import { ESegment } from "@/models/url.model";
import { getELangKey } from "@/lib/utils/getLanguage";
import LoginPage from "@/components/custom/login-page";

type TProps = Readonly<{
  params: Promise<{ [key in ESegment]: string }>;
}>;
export default async function Page({ params }: TProps) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return <LoginPage lang={lang} />;
}
