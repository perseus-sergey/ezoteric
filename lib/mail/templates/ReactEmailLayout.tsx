import { DEFAULT_META_OG } from '@/models/root.model';
import { MAIN_URL } from '@/models/url.model';
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { ReactNode } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export const ReactEmailLayout = ({
  subject,
  children,
}: {
  subject: string;
  children: ReactNode;
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{subject}</Preview>
        <Container>
          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src={`${baseUrl}/images/header-ezoteric-mail.jpg`}
              />
            </Row>
            <Row style={{ textAlign: 'center', paddingTop: '16px' }}>
              <Img
                width={50}
                style={{ margin: '0 auto' }}
                src={`${baseUrl}/images/ezoteric-logo-email.png`}
              />{' '}
              {DEFAULT_META_OG.siteName}
            </Row>

            {children}
          </Section>

          <Section style={containerImageFooter}>
            <Img
              style={image}
              width={620}
              src={`${baseUrl}/images/footer-mail-ezoteric.png`}
            />
          </Section>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgb(0,0,0, 0.7)',
            }}
          >
            © 2024 | www.ezoteric.net
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.2)',
  borderRadius: '6px',
  overflow: 'hidden',
};

const image = {
  maxWidth: '100%',
};

const containerImageFooter = {
  padding: '45px 0 0 0',
};
