import { Header } from '@/components/custom/Header';
import NotFoundPage from '@/components/custom/NotFoundPage';
import { DEFAULT_LANG } from '@/models/language.model';
import { auth } from './(auth)/auth';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import Footer from '@/components/custom/Footer';

export default async function NotFound() {
  const session = (await auth()) || undefined;
  const isAdmin = await isAdminAuth(session);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header isAdmin={isAdmin} session={session} lang={DEFAULT_LANG} />
        <NotFoundPage />
        <Footer
          lang={DEFAULT_LANG}
          isAdmin={isAdmin}
          isAuthorizedUser={!!session?.user}
        />
      </body>
    </html>
  );
}
