import {
  deleteImageInfoFromDB,
  getArticleByImage,
  getImageInfoFromDB,
  insertImageInfoToDB,
} from '@/db/queriesImages';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import { BLOB_STORAGE_PATH } from '@/models/image.model';
import { EUrlSearchParam } from '@/models/url.model';
import { del, list, put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const revalidate = 0;

// const PAGINATION_LIMIT = 50;

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
    const page = parseInt(searchParams.get('page') || '1', 10);

    const { images, hasMore } = await getImageInfoFromDB(page);

    return NextResponse.json({
      images,
      hasMore,
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images from database' },
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

    const filename = `${uploadDir ? `${uploadDir}/` : ''}${file.name}`;

    // 🆕 Перевірка існування файлу
    const { blobs } = await list({
      prefix: filename,
      limit: 1,
    });

    if (blobs.length > 0) {
      return NextResponse.json(
        { error: `File with name ${file.name} already exists in storage` },
        { status: 409 } // Conflict status code
      );
    }

    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(filename, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
      });

      await insertImageInfoToDB(file.name);

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
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Please log in as Admin first.' },
        { status: 401 }
      );
    }

    // Extract URL from search params
    const { searchParams } = new URL(request.url);
    const fileNameToDelete = searchParams.get(EUrlSearchParam.URL);

    // Validate File Name
    if (!fileNameToDelete) {
      return NextResponse.json(
        { error: 'Request Name is empty' },
        { status: 400 }
      );
    }

    const fileUrl = `${BLOB_STORAGE_PATH}${fileNameToDelete}`;

    // Check if the file is used in any published articles
    const articleUsingImage = await getArticleByImage(fileUrl);

    if (articleUsingImage) {
      return NextResponse.json(
        {
          error: 'File is already used in a published article',
          articleDetails: {
            title: articleUsingImage.title,
            pathName: articleUsingImage.pathName,
          },
        },
        { status: 409 } // Conflict status
      );
    }

    try {
      // Delete the file
      await del(fileUrl);

      await deleteImageInfoFromDB(fileNameToDelete);
    } catch (deleteError) {
      console.error('File deletion error:', deleteError);
      return NextResponse.json(
        {
          error: 'Failed to delete file',
          details:
            deleteError instanceof Error
              ? deleteError.message
              : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Successful deletion
    return NextResponse.json(
      { message: 'File successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in file deletion:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
