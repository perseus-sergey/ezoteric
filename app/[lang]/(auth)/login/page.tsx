import { ESegment } from "@/models/url.model";
import { getELangKey } from "@/lib/utils/getLanguage";
import LoginPage from "@/components/custom/login-page";

type TProps = Readonly<{
  params: { [key in ESegment]: string };
}>;
export default async function Page(props: TProps) {
  const { params } = await props;
  const lang = getELangKey(params.lang);

  return <LoginPage lang={lang} />;
}
