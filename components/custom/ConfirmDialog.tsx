'use client';

import {
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
  cancelBtnCaption,
  confirmBtnCaption,
  action,
}: {
  title: string;
  description: string;
  confirmBtnCaption: ReactNode;
  cancelBtnCaption: ReactNode;
  action: () => void;
}) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>{cancelBtnCaption}</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground"
          onClick={action}
        >
          {confirmBtnCaption}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
