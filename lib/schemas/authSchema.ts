import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  userName: z.union([
    z.literal(''),
    z.string().min(3, 'Username must be at least 3 characters long'),
  ]),
});

export type TAuthFormValues = z.infer<typeof authSchema>;
