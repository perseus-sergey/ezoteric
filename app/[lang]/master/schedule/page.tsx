import { Title } from '@/components/custom/Title';
import EmptyData from '@/components/custom/EmptyData';
import { DEFAULT_LANG } from '@/models/language.model';
import ScheduleAdminPage from '@/components/custom/AdminSchedulePage';
import { getScheduleAction } from '@/actions/schedule.actions';
import { TParams } from '@/models/url.model';
import { getELangKey } from '@/lib/utils/getLanguage';

export const dynamic = 'force-dynamic';

type TProps = Readonly<{
  params: TParams;
}>;

const Page = async ({ params }: TProps) => {
  const p = await params;
  const lang = getELangKey(p.lang);

  const scheduleData = await getScheduleAction();
  if (!scheduleData.data) return <EmptyData lang={DEFAULT_LANG} />;

  return (
    <article className="bg-tertiary/90 grow p-4 rounded-lg">
      <Title titleType="h2">Schedule</Title>
      <ScheduleAdminPage initialSchedule={scheduleData.data} lang={lang} />
    </article>
  );
};

export default Page;
