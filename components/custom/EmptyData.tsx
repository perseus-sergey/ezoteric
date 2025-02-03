import { ELanguage } from '@/models/language.model';
// import emptyPageImg from 'public/Images/empty_page.png';
import { EMPTY_DATA_MODEL } from '@/models/emptyData.model';
import { EmptyDataSVG } from '@/svg/EmptyDataSVG';

const { text } = EMPTY_DATA_MODEL;

interface IEmptyDataProps {
  lang: ELanguage;
  queryString?: string;
  description?: string;
}

const EmptyData = ({ description, lang, queryString }: IEmptyDataProps) => (
  <section className="flex-1 bg-tertiary border-2 rounded-lg border-stone-300 flex flex-col gap-4 justify-center items-center min-h-[40vh] p-3">
    <EmptyDataSVG className="size-28 animate-pulse" />
    <p>{description || text(queryString)[lang]}</p>
  </section>
);

export default EmptyData;
