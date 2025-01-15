import { ELanguage } from '@/models/language.model';
import {
  IModalAiResponseProps,
  MODAL_NUMEROLOGY,
} from '@/models/meta/home.model';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
  lang: ELanguage;
  aiResult: IModalAiResponseProps | null;
  openDialogFn: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

const {
  modalCaption,
  modalCloseBtn,
  modalResponseErrors,
  modalDescription,
  modalResponseParams: {
    lifePathNumber,
    destinyNumber,
    personalityNumber,
    overallInterpretation,
  },
} = MODAL_NUMEROLOGY;

export default function ModalNumerologyResponse({
  lang,
  aiResult,
  openDialogFn,
  isOpen,
}: IProps) {
  if (!aiResult) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={openDialogFn}>
      <AlertDialogContent className="overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">
            {modalCaption[lang]}
          </AlertDialogTitle>
          <AlertDialogTitle>
            {`${modalDescription[lang]} "${aiResult.formData.username}" (${aiResult.formData.birthdate})`}
          </AlertDialogTitle>
          {aiResult.aiResponse ? (
            <ul className="max-h-[40dvh] space-y-4 overflow-y-auto">
              <li>
                <AlertDialogDescription>
                  <strong>{lifePathNumber[lang]}:</strong>{' '}
                  {aiResult.aiResponse.lifePathNumber} -{' '}
                  {aiResult.aiResponse.lifePathNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{destinyNumber[lang]}:</strong>{' '}
                  {aiResult.aiResponse.destinyNumber} -{' '}
                  {aiResult.aiResponse.destinyNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{personalityNumber[lang]}:</strong>{' '}
                  {aiResult.aiResponse.personalityNumber} -{' '}
                  {aiResult.aiResponse.personalityNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{overallInterpretation[lang]}:</strong>{' '}
                  {aiResult.aiResponse.overallInterpretation}
                </AlertDialogDescription>
              </li>
            </ul>
          ) : (
            <AlertDialogDescription>
              {modalResponseErrors[lang].join(' ')}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{modalCloseBtn[lang]}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
