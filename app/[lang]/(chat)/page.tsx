// import { Chat } from "@/components/custom/chat";
import ChatWidget from "@/components/custom/ChatWidget";
import { Title } from "@/components/custom/Title";
import { getELangKey } from "@/lib/utils/getLanguage";
import { generateUUID } from "@/lib/utils/utils";
import { ESegment } from "@/models/url.model";
// import { Message } from "ai";

type TProps = Readonly<{
  params: Promise<{ [key in ESegment]: string }>;
}>;

export default async function Page({ params }: TProps) {
  const p = await params;
  const lang = getELangKey(p.lang);

  const id = generateUUID();

  // const initialMessages: Message[] = [
  //   {
  //     id,
  //     createdAt: new Date(),
  //     content: `Вітаю Вас в чаті! Мене звати Езобот.
  //       Я досвідчений фахівець в сфері езотеричних знань.
  //       Я прикладу всі зусилля і мої знання щоб дати Вам відповіді на всі ваші запитання.`,
  //     role: "assistant",
  //   },
  // ];

  return (
    <>
      <Title className="mt-10">Main Page</Title>

      {/* <ChatWidget
        key={id}
        id={id}
        initialMessages={initialMessages}
        lang={lang}
      /> */}
      <ChatWidget key={id} id={id} initialMessages={[]} lang={lang} />
    </>
  );
}
