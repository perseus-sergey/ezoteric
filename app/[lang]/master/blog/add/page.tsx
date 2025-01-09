import { FormAddArticle } from '@/components/custom/FormAddArticle';
import { Title } from '@/components/custom/Title';

const Page = async () => {
  return (
    <>
      <Title className="flex flex-col">Add New Article:</Title>

      <FormAddArticle
        // revalidateUrl={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
    </>
  );
};

export default Page;
