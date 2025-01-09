import { isAdminAuth } from '@/lib/utils/loggedUser';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const isAdmin = await isAdminAuth();
  if (!isAdmin) notFound();

  return children;
}
