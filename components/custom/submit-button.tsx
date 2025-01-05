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
        <span className="animate-spin">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? 'Loading' : 'Submit form'}
      </span>
    </Button>
  );
}
