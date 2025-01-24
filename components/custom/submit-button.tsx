import { Button } from '../ui/button';
import { LoadingAnimated } from '@/svg/LoadingAnimated';

export function SubmitButton({
  pending,
  submitCaption,
  pendingCaption,
}: {
  pending: boolean;
  submitCaption: React.ReactNode;
  pendingCaption: React.ReactNode;
}) {
  return (
    <Button
      type={pending ? 'button' : 'submit'}
      aria-disabled={pending}
      disabled={pending}
      className="flex gap-2 items-center text-white"
    >
      {pending ? pendingCaption : submitCaption}
      {pending && <LoadingAnimated />}
    </Button>
  );
}
SubmitButton.displayName = 'SubmitButton';
