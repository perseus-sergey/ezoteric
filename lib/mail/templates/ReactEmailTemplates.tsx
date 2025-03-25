import { TSchedule } from '@/db/schema';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
import { DEFAULT_META_OG } from '@/models/root.model';
import { ESegment, MAIN_URL } from '@/models/url.model';
import { Column, Heading, Link, Row, Text } from '@react-email/components';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { ReactEmailLayout } from './ReactEmailLayout';
import {
  formatDateLocal,
  formatTimeLocal,
  getTimezoneWithOffsetStr,
} from '@/lib/utils/formatDate';
import { SCHEDULE_EMAIL } from '@/models/scheduleEmail.model';
import { toZonedTime } from 'date-fns-tz';

interface MailMeetBookToUserProps {
  subject: string;
  meetData: TSchedule;
  lang: ELanguage;
  timeZone: string;
}

const {
  getTitleDescription,
  hello,
  dateCaption,
  team,
  timeCaption,
  timeZoneCaption,
  questionCaption,
  additionalQuestion,
  autoGenerate,
  seeYou,
  sincerely,
} = SCHEDULE_EMAIL;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;
const siteEmail = process.env.NEXT_PUBLIC_SITE_EMAIL || '';

const { MASTER, SCHEDULE } = ESegment;

export const MailMeetBookToUser = ({
  meetData,
  subject,
  lang,
  timeZone,
}: MailMeetBookToUserProps) => {
  const meetDateFormatted = formatDateLocal(meetData.meetDate, lang, timeZone);
  const meetTimeFormatted = formatTimeLocal(meetData.meetDate, timeZone);

  return (
    <ReactEmailLayout subject={subject}>
      <Row style={{ ...boxInfos, paddingBottom: '0' }}>
        <Column>
          <Heading
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {hello[lang]} {meetData.userName},
          </Heading>
          <Heading
            as="h2"
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {getTitleDescription(DEFAULT_META_OG.siteName)[lang]}
          </Heading>

          <Text style={paragraph}>
            <b>{timeZoneCaption[lang]}: </b>
            {getTimezoneWithOffsetStr(timeZone)}
          </Text>
          <Text style={paragraph}>
            <b>{dateCaption[lang]}: </b>
            {meetDateFormatted}
          </Text>
          <Text style={paragraph}>
            <b>{timeCaption[lang]}: </b>
            {meetTimeFormatted}
          </Text>
          <Text style={{ ...paragraph, marginTop: -5 }}>
            <b>{questionCaption[lang]}: </b>
            {meetData.question}
          </Text>

          <Text style={paragraph}>{autoGenerate[lang]}</Text>
          <Text style={{ ...paragraph, marginTop: -5 }}>
            {additionalQuestion[lang]}{' '}
            <Link
              href={`mailto:${siteEmail}`}
              className="text-blue-600 no-underline"
            >
              {siteEmail}
            </Link>
          </Text>

          <Text
            style={{
              color: 'rgb(0,0,0, 0.5)',
              fontSize: 14,
              marginTop: -5,
            }}
          >
            {seeYou[lang]}
          </Text>
          <Text
            style={{
              color: 'rgb(0,0,0, 0.5)',
              fontSize: 14,
              marginTop: -5,
            }}
          >
            {sincerely[lang]},
            <br />
            {team[lang]}
          </Text>
        </Column>
      </Row>
    </ReactEmailLayout>
  );
};

export const MailMeetBookAdmin = ({
  subject,
  meetData,
  lang,
  timeZone,
}: MailMeetBookToUserProps) => {
  const gmtDate = toZonedTime(meetData.meetDate, 'GMT');
  const formattedGmtDate = format(gmtDate, 'yyyy-MM-dd HH:mm');

  return (
    <ReactEmailLayout subject={subject}>
      <Row style={{ ...boxInfos, paddingBottom: '0' }}>
        <Column>
          <Heading
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Нове бронювання сеансу на {DEFAULT_META_OG.siteName},
          </Heading>

          <Text style={paragraph}>
            <b>Ім`я користувача: </b>
            {meetData.userName}
          </Text>

          <Text style={paragraph}>
            <b>Email користувача: </b>
            {meetData.email}
          </Text>

          <Text style={paragraph}>
            <b>На дату: </b>
            {formattedGmtDate} (GMT)
          </Text>
          <Text style={paragraph}>
            <b>Часовий пояс користувача: </b>
            {getTimezoneWithOffsetStr(timeZone)}
          </Text>

          <Text style={{ ...paragraph, marginTop: -5 }}>
            <b>Питання користувача: </b>
            {meetData.question}
          </Text>
          <Text style={{ ...paragraph, marginTop: -5 }}>
            <b>Мова користувача: </b>
            {lang}
          </Text>

          <Text style={paragraph}>
            Перевірте{' '}
            <Link
              href={`${baseUrl}/${DEFAULT_LANG}/${MASTER}/${SCHEDULE}`}
              className="text-blue-600 no-underline"
            >
              розклад адміністратора
            </Link>{' '}
            для деталей.
          </Text>
          <Text
            style={{
              color: 'rgb(0,0,0, 0.5)',
              fontSize: 14,
              marginTop: -5,
            }}
          >
            Дата створення замовлення: {meetData.reservedAt?.toLocaleString()}
            Дата створення замовлення:{' '}
            {format(meetData.reservedAt || '', 'EEEE dd MMMM', {
              locale: lang === ELanguage.UA ? uk : enUS,
            })}
          </Text>
          <Text style={{ ...paragraph, marginTop: -5 }}>
            З повагою,
            <br />
            Система сповіщень {DEFAULT_META_OG.siteName}
          </Text>
        </Column>
      </Row>
    </ReactEmailLayout>
  );
};

const paragraph = {
  fontSize: 16,
};

const boxInfos = {
  padding: '20px',
};
