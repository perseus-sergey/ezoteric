import { getELangKey } from '@/lib/utils/getLanguage';
import LoginPage from '@/components/custom/login-page';
import { TParams } from '@/models/url.model';

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return <LoginPage lang={lang} />;
}
