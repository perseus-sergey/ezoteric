import { compare } from 'bcrypt-ts';
import NextAuth, { User, Session } from 'next-auth';
import { Provider } from 'next-auth/providers';
import Google from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

const providers: Provider[] = [
  Google,
  Credentials({
    credentials: {},
    async authorize(credentials: Record<string, string> | undefined) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const { email, password } = credentials;

      const users = await getUser(email);
      if (users.length === 0) return null;

      try {
        const passwordsMatch = await compare(password, users[0].password!);
        if (passwordsMatch) return users[0] as User;
      } catch (error) {
        console.log('🚀 ~ authorize ~ error:', error);
        return null;
      }

      return null;
    },
  }),
];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  providers,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();

    return { id: providerData.id, name: providerData.name };
  }

  return { id: provider.id, name: provider.name };
});
