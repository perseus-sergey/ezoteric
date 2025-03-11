import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogDescription, DialogTrigger } from '@radix-ui/react-dialog';
import SeoLink from './SeoLink';
import { ELanguage } from '@/models/language.model';
import { ESegment } from '@/models/url.model';
import { providerMap } from '@/app/(auth)/auth';
import { Button } from '../ui/button';
import { restProviderLinksAction } from '@/app/(auth)/actions';
import { AUTH_PROVIDER_LOGOS } from '@/models/auth.model';
import { CalendarLotos } from '@/svg/CalendarLotos';
import { MEET_DIALOG } from '@/models/header.model';

interface MeetDialogProps extends React.HTMLAttributes<HTMLElement> {
  isAuthorized: boolean;
  withIcons?: boolean;
  lang: ELanguage;
}

const {
  linkCaption,
  linkAriaLabel,
  dialogTitle,
  dialogDescription,
  providerCaption,
} = MEET_DIALOG;

const MeetDialog = ({
  isAuthorized,
  lang,
  withIcons = false,
  className,
}: MeetDialogProps) =>
  isAuthorized ? (
    <SeoLink
      title={linkAriaLabel[lang]}
      href={`/${lang}/${ESegment.APPOINTMENT}`}
      className={className}
    >
      {withIcons && <CalendarLotos className="size-6 opacity-50" />}
      {linkCaption[lang]}
    </SeoLink>
  ) : (
    <Dialog>
      <DialogTrigger className={className}>
        {withIcons && <CalendarLotos className="size-6 opacity-50" />}
        {linkCaption[lang]}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle[lang]}!</DialogTitle>
          <DialogDescription>{dialogDescription[lang]}</DialogDescription>
        </DialogHeader>

        <section className="flex flex-col justify-center gap-2">
          {providerMap.map(
            (provider) =>
              provider.id !== 'credentials' && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    'use server';

                    await restProviderLinksAction(provider.id);
                  }}
                  key={provider.id}
                >
                  {AUTH_PROVIDER_LOGOS[provider.id]}
                  <span>
                    {providerCaption[lang]} {provider.name}
                  </span>
                </Button>
              )
          )}
        </section>
      </DialogContent>
    </Dialog>
  );

export default MeetDialog;
