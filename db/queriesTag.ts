'use server';

import 'server-only';

import { eq } from 'drizzle-orm';

import { NewTag, tblTag, TTag } from './schema';
import { getDB } from './root';
// import { ELanguage } from '@/models/language.model';

// const { UA } = ELanguage;

const db = getDB();

export const insertTagToDb = async (newTag: NewTag) => {
  try {
    const [tag] = await db.insert(tblTag).values(newTag).returning();
    return tag;
  } catch (error) {
    return error as Error;
  }
};

export const updateTagToDb = async (
  tagId: number,
  updatedTag: Partial<TTag>
) => {
  try {
    const [tag] = await db
      .update(tblTag)
      .set(updatedTag)
      .where(eq(tblTag.id, tagId))
      .returning();
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

    return deletedTag;
  } catch (error) {
    throw error;
  }
};
