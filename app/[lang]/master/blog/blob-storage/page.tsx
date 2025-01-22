import { Title } from '@/components/custom/Title';
import VercelBlobWidget from '@/components/custom/VercelBlobWidget';

const Page = async () => {
  return (
    <>
      <Title>Images for Articles Storage</Title>
      <article className="container bg-tertiary/70 grow p-4 rounded-lg">
        <VercelBlobWidget />
      </article>
    </>
  );
};

export default Page;
