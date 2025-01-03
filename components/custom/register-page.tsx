'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ELanguage } from '@/models/language.model';
import { register } from '@/app/[lang]/(auth)/actions';
import { TAuthFormValues } from '@/lib/schemas/authSchema';
import AuthForm from './auth-form';

export default function RegisterPage({ lang }: { lang: ELanguage }) {
  const router = useRouter();

  const handleSubmit = async (values: TAuthFormValues) => {
    const res = await register(values);

    if (res.status === 'user_exists') {
      toast.error('Account already exists');
    } else if (res.status === 'failed') {
      toast.error('Failed to create account');
    } else if (res.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (res.status === 'success') {
      toast.success('Account created successfully');
      router.refresh();
    }
  };

  return <AuthForm type="register" lang={lang} action={handleSubmit} />;
}
