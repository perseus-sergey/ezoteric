import { Title } from '@/components/custom/Title';
import EmptyData from '@/components/custom/EmptyData';
import { DEFAULT_LANG } from '@/models/language.model';
import { getScheduleAction } from '@/actions/schedule.actions';
import AppointmentBookingForm from '@/components/custom/AppointmentBookingForm';
import { auth } from '@/app/(auth)/auth';
import { notFound } from 'next/navigation';
import { isAuthorized } from '@/lib/utils/loggedUser';
import { TParams } from '@/models/url.model';
import { getELangKey } from '@/lib/utils/getLanguage';
import { SCHEDULE_PAGE } from '@/models/schedule.model';

export const dynamic = 'force-dynamic';

type TProps = Readonly<{
  params: TParams;
}>;

const { titleH1 } = SCHEDULE_PAGE;

const Page = async ({ params }: TProps) => {
  const p = await params;
  const lang = getELangKey(p.lang);

  const session = await auth();
  const userEmail = session?.user?.email;

  const authorized = await isAuthorized(session);
  if (!authorized || !userEmail) notFound();

  const scheduleData = await getScheduleAction(false);
  if (!scheduleData.data) return <EmptyData lang={DEFAULT_LANG} />;

  return (
    <article className="bg-tertiary/90 grow p-4 rounded-lg">
      <Title titleType="h2">{titleH1[lang]}</Title>
      <AppointmentBookingForm
        lang={lang}
        initialSchedule={scheduleData.data}
        userEmail={userEmail}
      />
    </article>
  );
};

export default Page;
