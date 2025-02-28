import { Title } from '@/components/custom/Title';
import { CodeBlock } from '@/components/custom/CodeBlock';
import { makeLinksForChat } from '@/db/queriesChat';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const links = await makeLinksForChat();

  return (
    <article className="bg-tertiary/90 grow p-4 rounded-lg">
      <Title titleType="h2">Links</Title>
      <CodeBlock copyCode={JSON.stringify(links, null, 2)} />
    </article>
  );
};

export default Page;
