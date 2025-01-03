'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { ELanguage } from '@/models/language.model';
import { authSchema, TAuthFormValues } from '@/lib/schemas/authSchema';
import SeoLink from './SeoLink';
import { ESegment } from '@/models/url.model';

export default function AuthForm({
  type, // "login" or "register"
  lang,
  action, // Функція для логіки входу чи реєстрації
}: {
  type: 'login' | 'register';
  lang: ELanguage;
  action: (data: TAuthFormValues) => Promise<void>;
}) {
  const form = useForm<TAuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      userName: '',
    },
  });
  async function onSubmit(data: TAuthFormValues) {
    await action(data);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-center">
          {type === 'login' ? 'Sign In' : 'Sign Up'}
        </h3>
        {type === 'register' && (
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create an account with your email and password
          </p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* User Name */}
            {type === 'register' && (
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@gmail.com"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete={
                        type === 'register'
                          ? 'new-password'
                          : 'current-password'
                      }
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {type === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
          {type === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <SeoLink
            title="Відкрити форму реєстрації"
            href={`/${lang}/${type === 'login' ? ESegment.REGISTER : ESegment.LOGIN}`}
            className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </SeoLink>
          {type === 'login' ? ' for free.' : ' instead.'}
        </p>
      </div>
    </div>
  );
}
