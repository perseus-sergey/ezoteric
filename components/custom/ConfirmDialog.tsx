'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';

export const ConfirmDialog = ({
  title,
  description,
  cancelBtnCaption = 'Cancel',
  confirmBtnCaption = 'Confirm',
  onConfirm,
  open,
  onOpenChange,
}: {
  title: string;
  description: ReactNode;
  confirmBtnCaption?: ReactNode;
  cancelBtnCaption?: ReactNode;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?(open: boolean): void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelBtnCaption}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground"
            onClick={onConfirm}
          >
            {confirmBtnCaption}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
