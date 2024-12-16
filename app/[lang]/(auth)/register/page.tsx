import { ESegment } from "@/models/url.model";
import { getELangKey } from "@/lib/utils/getLanguage";
import RegisterPage from "@/components/custom/register-page";

type TProps = Readonly<{
  params: Promise<{ [key in ESegment]: string }>;
}>;

export default async function Page({ params }: TProps) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return <RegisterPage lang={lang} />;
}
