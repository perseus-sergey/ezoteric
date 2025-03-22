import { Title } from '@/components/custom/Title';
import EmptyData from '@/components/custom/EmptyData';
import { DEFAULT_LANG } from '@/models/language.model';
import { getScheduleAction } from '@/actions/schedule.actions';
import { ScheduleAdminTable } from '@/components/custom/AdminSchedulePageClient';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const scheduleData = await getScheduleAction();
  if (!scheduleData.data) return <EmptyData lang={DEFAULT_LANG} />;

  return (
    <article className="bg-tertiary/90 grow p-4 rounded-lg">
      <Title titleType="h2">Schedule</Title>
      <ScheduleAdminTable initialSchedule={scheduleData.data} />
    </article>
  );
};

export default Page;
