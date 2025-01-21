import { Title } from '@/components/custom/Title';
import UploadFileWidget from '@/components/custom/UploadFileWidget';

const Page = async () => {
  return (
    <>
      <Title className="flex flex-col">Upload images for Articles</Title>

      <UploadFileWidget />
    </>
  );
};

export default Page;
