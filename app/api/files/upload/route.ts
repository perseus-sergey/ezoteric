import { isAdminAuth } from '@/lib/utils/loggedUser';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'File size should be less than 2MB',
    })
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(
          file.type
        ),
      {
        message: 'File type should be JPEG, PNG, or PDF',
      }
    ),
});

export async function POST(request: Request) {
  const isAdmin = await isAdminAuth();

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Please log in as Admin first.' },
      { status: 401 }
    );
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }
  console.log('🚀 ~ POST ~ request:', request.body);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadDir = formData.get('uploadDir') || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const filename = file.name;

    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(
        `${uploadDir ? `${uploadDir}/` : ''}${filename}`,
        fileBuffer,
        {
          access: 'public',
          addRandomSuffix: false,
        }
      );

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: `Upload failed: Error: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to process request: Error: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
}
