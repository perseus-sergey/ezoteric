import { getELangKey } from '@/lib/utils/getLanguage';
import RegisterPage from '@/components/custom/register-page';
import { TParams } from '@/models/url.model';

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return <RegisterPage lang={lang} />;
}
