import { getELangKey } from '@/lib/utils/getLanguage';
import { TParams } from '@/models/url.model';
import { providerMap } from '../auth';
import { AUTH_PROVIDER_LOGOS } from '@/models/auth.model';
import { restProviderLinksAction } from '../actions';
import LoginPage from '@/components/custom/login-page';
import { Button } from '@/components/ui/button';

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);

  return (
    <div className="flex flex-col items-start gap-2 py-6">
      <LoginPage lang={lang} />

      {...providerMap.map(
        (provider) =>
          provider.id !== 'credentials' && (
            <Button
              variant="outline"
              onClick={async () => {
                'use server';

                await restProviderLinksAction(provider.id);
              }}
              key={provider.id}
            >
              {AUTH_PROVIDER_LOGOS[provider.id]}
              <span>Sign in with {provider.name}</span>
            </Button>
          )
      )}
    </div>
  );
  // return <LoginPage lang={lang} />;
}
