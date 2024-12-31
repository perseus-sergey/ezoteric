import { ELanguage } from '@/models/language.model';
// import emptyPageImg from 'public/Images/empty_page.png';
import { EMPTY_DATA_MODEL } from '@/models/emptyData.model';

const { text } = EMPTY_DATA_MODEL;

interface IEmptyDataProps {
  lang: ELanguage;
  description?: string;
}

const EmptyData = ({ description, lang }: IEmptyDataProps) => (
  <section
    className="p-5 font-bold text-center text-purple-600 flex flex-col items-center gap-12"
    data-testid="EmptyData"
  >
    {/* <Image src={emptyPageImg} alt={EMPTY_IMG_ALT[lang]} /> */}
    <p>{description || text[lang]}</p>
  </section>
);

export default EmptyData;
