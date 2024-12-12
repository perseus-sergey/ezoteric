import { ESegment } from "@/models/url.model";
import { getELangKey } from "@/lib/utils/getLanguage";
import RegisterPage from "@/components/custom/register-page";

type TProps = Readonly<{
  params: { [key in ESegment]: string };
}>;

export default async function Page(props: TProps) {
  const { params } = await props;
  const lang = getELangKey(params.lang);

  return <RegisterPage lang={lang} />;
}
