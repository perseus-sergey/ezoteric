import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ELanguage } from '@/models/language.model';
import { HEADER_LOGIN } from '@/models/header.model';
import { User } from 'lucide-react';
import { providerMap } from '@/app/[lang]/(auth)/auth';
import { AUTH_PROVIDER_LOGOS } from '@/models/auth.model';
import { restProviderLinksAction } from '@/app/[lang]/(auth)/actions';

export const LoginProviders = ({
  lang,
  withIcons = false,
}: {
  lang: ELanguage;
  withIcons?: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={withIcons ? 'ghost' : 'outline'}>
          {withIcons && <User className="text-muted-foreground" />}
          {HEADER_LOGIN.signin[lang]}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {...providerMap.map(
          (provider) =>
            provider.id !== 'credentials' && (
              <DropdownMenuItem key={provider.id}>
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
              </DropdownMenuItem>
            )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// <Link href={`/${lang}/login`}>
//   {withIcons && <User className="text-muted-foreground" />}
//   {HEADER_LOGIN.signin[lang]}
// </Link>;
