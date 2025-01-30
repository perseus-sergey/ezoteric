import { FormAddEditArticle } from '@/components/custom/FormAddEditArticle';
import { Title } from '@/components/custom/Title';
import { getTagsFromDb } from '@/db/queriesTag';
import { TTag } from '@/db/schema';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export const maxDuration = 60;

const Page = async () => {
  let tags: TTag[] = [];

  try {
    tags = await getTagsFromDb();
  } catch (error) {
    toast('Error:', { description: `${(error as Error).message}` });
  }

  return (
    <>
      <Title className="flex flex-col">Add New Article:</Title>

      <FormAddEditArticle
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
        availableTags={tags}
      />
    </>
  );
};

export default Page;
