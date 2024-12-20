import ChatWidget from "@/components/custom/ChatWidget";
import { Title } from "@/components/custom/Title";
import { getELangKey } from "@/lib/utils/getLanguage";
import { cn, generateUUID } from "@/lib/utils/utils";
import { ESegment } from "@/models/url.model";
import Image from "next/image";
import sunrise_meditation_1200 from "../../../public/images/sunrise_meditation_1200.jpg";
import hands_with_artifacts_500 from "../../../public/images/hands_with_artifacts_500.jpg";
import { MAIN_TEXT } from "@/models/meta/home.model";
import NumerologyForm from "@/components/custom/numerology-form";

type TProps = Readonly<{
  params: Promise<{ [key in ESegment]: string }>;
}>;

const {
  h1,
  h1_p,
  h2_1,
  h2_1_p,
  h2_1_ul,
  h2_2,
  h2_2_p,
  h2_3,
  h2_3_p,
  h2_3_phone,
  numerologyForm,
} = MAIN_TEXT;

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
    <article className="relative mx-auto">
      <div className="relative mx-auto">
        <Image src={sunrise_meditation_1200} alt="image for img" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-65% to-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-90% to-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent from-90% to-secondary"></div>
      </div>

      <Title>{h1[lang]}</Title>

      {h1_p[lang].map((text, i) => (
        <p key={i}>{text}</p>
      ))}

      <TitleH2>{h2_1[lang]}</TitleH2>
      <div className="flex flex-wrap lg:flex-nowrap">
        <div className="relative lg:shrink-0 mx-auto lg:m-0">
          <Image src={hands_with_artifacts_500} alt="image for img" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-65% to-secondary"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent from-90% to-secondary"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent from-90% to-secondary"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent from-90% to-secondary"></div>
        </div>

        <div className="space-y-8">
          {h2_1_p[lang].map((text, i) => (
            <p key={i} className="text-center p-4 text-xl">
              {text}
            </p>
          ))}
          <ul className="p-0 sm:pl-8">
            {h2_1_ul[lang].map((li) => (
              <li key={li[0]} className="py-1">
                <strong>{li[0]}</strong>: {li[1]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="p-4 flex gap-8 items-center justify-center flex-wrap lg:flex-nowrap bg-slate-300 dark:bg-slate-600">
        <div>
          <TitleH2>{h2_2[lang]}</TitleH2>

          {h2_2_p[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}

          <h3 className="font-bold font-georgia p-1 sm:p-2 text-center text-xl sm:text-2xl">
            {numerologyForm.resultDescription.title[lang]}
          </h3>
          {numerologyForm.resultDescription.texts[lang].map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <NumerologyForm lang={lang} />
      </section>

      <TitleH2>{h2_3[lang]}</TitleH2>
      {h2_3_p[lang].map((text, i) => (
        <p key={i}>{text}</p>
      ))}
      <ul>
        <li>Email: info@ezoteric.net</li>
        <li>{h2_3_phone[lang]}: +380 XX XXX XX XX</li>
      </ul>

      <ChatWidget key={id} id={id} initialMessages={[]} lang={lang} />
    </article>
  );
}

interface ITitleH2 extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const TitleH2 = ({ children, className, ...attributes }: ITitleH2) => (
  <h2
    className={cn(
      "font-bold font-georgia p-2 sm:p-6 text-center text-2xl sm:text-3xl",
      className,
    )}
    {...attributes}
  >
    {children}
  </h2>
);
