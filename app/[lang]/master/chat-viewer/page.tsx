import Pagination from '@/components/custom/Pagination';
import { Title } from '@/components/custom/Title';
import { ViewChatItem } from '@/components/custom/ViewChatItem';
import { getChatListChunk } from '@/db/queries';
import { validSearchParam } from '@/lib/utils/validSearchParam';
import { DEFAULT_LANG } from '@/models/language.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url.model';
import { notFound } from 'next/navigation';

const PAGINATION_PER_PAGE = 50;
const PAGINATION_OFFSET = 3;

const Page = async ({ searchParams }: { searchParams: TSearchParams }) => {
  const sParams = await searchParams;

  const page = validSearchParam(EUrlSearchParam.PAGE, sParams) || '1';
  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber)) notFound();

  const { chatList, totalCount } = await getChatListChunk({
    perPage: PAGINATION_PER_PAGE,
    offset: (pageNumber - 1) * PAGINATION_PER_PAGE,
  });

  const chatsCount = !chatList || chatList.length === 0 ? 0 : totalCount || 0;
  const totalPages = Math.ceil(chatsCount / PAGINATION_PER_PAGE);

  return (
    <>
      <Title>Chat Viewer</Title>
      <article className="bg-tertiary/70 grow p-4 rounded-lg">
        <p className="text-tertiary-foreground bg-tertiary text-center w-full px-4 py-2 rounded-sm">
          Total Count: {totalCount}
        </p>
        <Pagination
          lang={DEFAULT_LANG}
          page={pageNumber || 1}
          offsetNumber={PAGINATION_OFFSET}
          totalPages={totalPages}
          searchParams={sParams}
        />

        {chatList && chatList.length > 0 && (
          <ul>
            {chatList.map((chat) => (
              <ViewChatItem key={chat.id} chat={chat} />
            ))}
          </ul>
        )}
      </article>
    </>
  );
};

export default Page;
