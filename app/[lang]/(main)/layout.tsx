import { getELangKey } from '@/lib/utils/getLanguage';
import ChatWidget from '@/components/custom/ChatWidget';
import { generateUUID } from '@/lib/utils/utils';
import { Suspense } from 'react';
import { auth } from '@/app/(auth)/auth';

type TProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>;

export default async function Layout({ children, params }: TProps) {
  const p = await params;
  const lang = getELangKey(p.lang);

  const session = (await auth()) || undefined;

  const id = generateUUID();

  return (
    <>
      {children}

      <Suspense>
        <ChatWidget
          key={id}
          id={id}
          lang={lang}
          userImgSrc={session?.user?.image}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />
      </Suspense>
    </>
  );
}
