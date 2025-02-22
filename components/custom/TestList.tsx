import { ELanguage } from '@/models/language.model';
import TestCard from './TestCard';
import EmptyData from './EmptyData';
import EditPostLink from './EditPostLink';
import { TTestLocalized } from '@/models/test.model';
import { ESegment } from '@/models/url.model';

interface ITestListProps {
  lang: ELanguage;
  testList: TTestLocalized[] | null;
  isAdmin: boolean;
  searchQuery?: string;
}

const { MASTER, TESTS, ARTICLE_EDIT } = ESegment;

const TestList = ({ testList, lang, isAdmin, searchQuery }: ITestListProps) =>
  testList && testList.length > 0 ? (
    <ul className="space-y-4">
      {testList.map((test, idx) => {
        return (
          <li key={test.id} className="relative group">
            <TestCard lang={lang} test={test} idxInList={idx} />

            {isAdmin && (
              <EditPostLink
                isPublished={test.published}
                href={`/${lang}/${MASTER}/${TESTS}/${ARTICLE_EDIT}/${test.id}`}
              />
            )}
          </li>
        );
      })}
    </ul>
  ) : (
    <EmptyData lang={lang} queryString={searchQuery} />
  );

export default TestList;
