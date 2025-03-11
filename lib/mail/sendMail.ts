import { DEFAULT_META_OG } from '@/models/root.model';
import { createTransport } from 'nodemailer';

export async function sendMail({
  to,
  subject,
  body,
}: {
  to?: string;
  subject: string;
  body: string;
}) {
  const MAIL_FROM = process.env.MAIL_FROM;
  const MAIL_SMTP_PASS = process.env.MAIL_SMTP_PASS;
  const SMTP_HOST = process.env.MAIL_SMTP_HOST;
  const SMTP_PORT = 465;

  if (!MAIL_FROM || !MAIL_SMTP_PASS || !SMTP_HOST || !SMTP_PORT) {
    console.error(
      'Необхідно встановити змінні середовища MAIL_FROM, MAIL_SMTP_PASS, SMTP_HOST, та SMTP_PORT'
    );
    throw new Error('Email configuration is missing in environment variables.');
  }

  const transport = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // true для порту 465, false для інших портів
    auth: {
      user: MAIL_FROM,
      pass: MAIL_SMTP_PASS,
    },
  });

  try {
    await transport.verify();
  } catch (error) {
    console.error(`Mail Transport Error: ${error}`);

    return;
  }

  try {
    await transport.sendMail({
      from: `${DEFAULT_META_OG.siteName} <${MAIL_FROM}>`,
      to: to || MAIL_FROM,
      subject,
      html: body,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
