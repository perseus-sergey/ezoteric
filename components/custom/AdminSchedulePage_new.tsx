import { TSchedule } from '@/db/schema';
import { ScheduleAdminTable } from './AdminSchedulePageClient';

const ScheduleAdminPage = ({
  initialSchedule,
}: {
  initialSchedule: TSchedule[];
}) => <ScheduleAdminTable initialSchedule={initialSchedule} />;
export default ScheduleAdminPage;
