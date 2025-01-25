import { isAdminAuth } from '@/lib/utils/loggedUser';
import { EUrlSearchParam } from '@/models/url.model';
import { del, list, put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const revalidate = 0;

const PAGINATION_LIMIT = 300;

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');

    const {
      blobs,
      cursor: nextCursor,
      hasMore,
    } = await list({
      limit: PAGINATION_LIMIT,
      cursor: cursor || undefined,
      // Optionally add prefix if you want to filter blobs
      // prefix: 'your-specific-folder/'
    });

    return NextResponse.json({
      blobs,
      cursor: nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Blob listing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list blobs',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const isAdmin = await isAdminAuth();

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Please log in as Admin first.' },
      { status: 401 }
    );
  }

  if (request.body === null) {
    return NextResponse.json(
      { error: 'Request body is empty' },
      { status: 400 }
    );
  }

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

export async function DELETE(request: Request) {
  const isAdmin = await isAdminAuth();

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Please log in as Admin first.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);

  const urlToDelete = searchParams.get(EUrlSearchParam.URL) as string;

  if (!urlToDelete) {
    return NextResponse.json(
      { error: 'Request url is empty' },
      { status: 400 }
    );
  }

  await del(urlToDelete);

  return NextResponse.json({});
}
