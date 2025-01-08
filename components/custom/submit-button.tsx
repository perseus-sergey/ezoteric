import { LoaderIcon } from '@/components/custom/icons';

import { Button } from '../ui/button';

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
      {pending && (
        <span className="animate-spin" aria-live="polite" role="status">
          <LoaderIcon />
        </span>
      )}
    </Button>
  );
}
SubmitButton.displayName = 'SubmitButton';
