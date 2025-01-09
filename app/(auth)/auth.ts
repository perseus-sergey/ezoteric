import NextAuth from 'next-auth';
import { Provider } from 'next-auth/providers';
import Google from 'next-auth/providers/google';

const providers: Provider[] = [Google];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({ providers });

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();

    return { id: providerData.id, name: providerData.name };
  }

  return { id: provider.id, name: provider.name };
});
