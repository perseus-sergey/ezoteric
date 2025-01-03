'use client';

import { ELanguage } from '@/models/language.model';
import { login } from '@/app/[lang]/(auth)/actions';
import AuthForm from './auth-form';
import { TAuthFormValues } from '@/lib/schemas/authSchema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage({ lang }: { lang: ELanguage }) {
  const router = useRouter();

  const handleSubmit = async (values: TAuthFormValues) => {
    const res = await login(values);

    if (res.status === 'success') {
      router.refresh();
    } else if (res.status === 'failed') {
      toast.error('Invalid credentials!');
    } else {
      toast.error('Failed validating your submission!');
    }
  };

  return <AuthForm type="login" lang={lang} action={handleSubmit} />;
}
