'use server';

import 'server-only';

import { eq } from 'drizzle-orm';

import { TNewTag, tblTag } from './schema';
import { getDB } from './root';
// import { ELanguage } from '@/models/language.model';

// const { UA } = ELanguage;

const db = getDB();

export const getTagsFromDb = async () => {
  try {
    const res = await getDB().query.tblTag.findMany({
      orderBy: (tags, { asc }) => [asc(tags.nameEn)],
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const insertTagToDb = async (newTag: TNewTag) => {
  try {
    const [tag] = await db.insert(tblTag).values(newTag).returning();

    // revalidateTag('master');
    return tag;
  } catch (error) {
    return error as Error;
  }
};

export const updateTagToDb = async (tagId: number, updatedTag: TNewTag) => {
  console.log('🚀 ~ updateTagToDb ~ updatedTag:', updatedTag);
  try {
    const [tag] = await db
      .update(tblTag)
      .set(updatedTag)
      .where(eq(tblTag.id, tagId))
      .returning();

    // revalidateTag('master');

    return tag;
  } catch (error) {
    return error as Error;
  }
};

export const deleteTagFromDb = async (tagId: number) => {
  try {
    // Check if tag has any articles and get the first article's slug if exists
    const tagWithArticles = await db.query.tblTag.findFirst({
      where: (tag, { eq }) => eq(tag.id, tagId),
      with: {
        articleTags: {
          with: {
            article: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (tagWithArticles?.articleTags.length) {
      // Return the slug of the first associated article
      return tagWithArticles.articleTags[0].article.id;
    }

    // If no articles are associated, proceed with deletion
    const [deletedTag] = await db
      .delete(tblTag)
      .where(eq(tblTag.id, tagId))
      .returning();

    // revalidateTag('master');

    return deletedTag;
  } catch (error) {
    throw error;
  }
};
