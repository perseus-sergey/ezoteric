import { Title } from '@/components/custom/Title';
import { ESegment } from '@/models/url.model';
import { ELanguage } from '@/models/language.model';
import { getDB } from '@/db/root';
import { tblArticle, tblTests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CodeBlock } from '@/components/custom/CodeBlock';

export const dynamic = 'force-dynamic';

const { BLOG, TESTS } = ESegment;
const { UA } = ELanguage;

const db = getDB();

const getPostsFromDb = async () => {
  try {
    const articles = await db
      .select({
        slug: tblArticle.slug,
        title: tblArticle.titleUa,
        description: tblArticle.descriptionUa,
      })
      .from(tblArticle)
      .where(eq(tblArticle.published, true));

    return articles;
  } catch (error) {
    console.log('getPostsFromDb ~ error:', error);
    return [];
  }
};

const getTestsFromDb = async () => {
  try {
    const tests = await db
      .select({
        slug: tblTests.slug,
        title: tblTests.titleUa,
        description: tblTests.descriptionUa,
      })
      .from(tblTests)
      .where(eq(tblTests.published, true));

    return tests;
  } catch (error) {
    console.log('getTestsFromDb ~ error:', error);
    return [];
  }
};

interface IItemData {
  slug: string;
  title: string;
  description: string;
}

const makeLinks = (startPath: string, itemList: IItemData[]) =>
  itemList.map((item) => ({
    title: item.title,
    description: item.description,
    href: `/${UA}/${startPath}/${item.slug}`,
  }));

const Page = async () => {
  const postList = await getPostsFromDb();
  const testList = await getTestsFromDb();

  const numerologyTest = {
    title: 'Тест з Нумерології',
    description:
      "Тест який визначає: Life Path Number, Soul Number, Destiny Number, Personality Number. Також інтерпретацію кожного отриманого числа і повний висновок. При цьому користувачу потрібно спочатку заповнити форму, написавши своє повне ім'я та дату народження.",
    href: '/uk/#numerology-form-id',
  };

  const links = {
    articles: makeLinks(BLOG, postList),
    tests: [numerologyTest, ...makeLinks(TESTS, testList)],
  };

  return (
    <article className="bg-tertiary/90 grow p-4 rounded-lg">
      <Title titleType="h2">Links</Title>
      <CodeBlock copyCode={JSON.stringify(links, null, 2)} />
    </article>
  );
};

export default Page;
