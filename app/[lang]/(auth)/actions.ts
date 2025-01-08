'use server';

import { createUser, getUser } from '@/db/queries';

import { signIn, signOut } from './auth';
import { TAuthFormValues } from '@/lib/schemas/authSchema';

type ActionStatus =
  | 'idle'
  | 'in_progress'
  | 'success'
  | 'failed'
  | 'invalid_data';

export interface ILoginActionState {
  status: ActionStatus;
}

export interface IRegisterActionState {
  status: ActionStatus | 'user_exists';
}

export const login = async (
  values: TAuthFormValues
): Promise<ILoginActionState> => {
  try {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    return { status: error instanceof Error ? 'failed' : 'invalid_data' };
  }
};

export const register = async (
  values: TAuthFormValues
): Promise<IRegisterActionState> => {
  try {
    const [user] = await getUser(values.email);

    if (user) {
      return { status: 'user_exists' };
    } else {
      await createUser(values.email, values.password, values.userName);
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      return { status: 'success' };
    }
  } catch (error) {
    console.log('🚀 ~ Register error:', error);
    return { status: error instanceof Error ? 'failed' : 'invalid_data' };
  }
};

export const logout = async (redirectTo: string) =>
  await signOut({ redirectTo });

export const restProviderLinksAction = async (providerId: string) =>
  await signIn(providerId);
