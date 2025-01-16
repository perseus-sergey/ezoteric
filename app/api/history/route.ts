import { auth } from '@/app/(auth)/auth';
import { getChatsByUserEmail } from '@/db/queries';

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const chats = await getChatsByUserEmail({ userEmail: session.user.email! });
  return Response.json(chats);
}
