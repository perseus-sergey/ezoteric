// 'use server';

import { ELanguage } from '@/models/language.model';

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
import {
  INumerologyResults,
  MODAL_NUMEROLOGY,
} from '@/models/meta/numerology.model';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';

interface IProps {
  lang: ELanguage;
  numerologyResult: INumerologyResults | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

const {
  modalCaption,
  modalCloseBtn,
  modalResponseErrors,
  modalDescription,
  modalResponseParams: {
    lifePathNumberCaption,
    destinyNumberCaption,
    personalityNumberCaption,
    overallInterpretationCaption,
    soulNumberCaption,
  },
} = MODAL_NUMEROLOGY;

export default function ModalNumerologyResponse({
  lang,
  numerologyResult,
  setIsOpen,
  isOpen,
}: IProps) {
  if (!numerologyResult) return null;

  const {
    formData,
    lifePathInvolvedNumbers,
    lifePathNumber,
    lifePathNumberInterpretation,
    soulInvolvedNumbers,
    soulNumber,
    soulNumberInterpretation,
    personalityInvolvedNumbers,
    personalityNumber,
    personalityNumberInterpretation,
    overallInterpretation,
    destinyInvolvedNumbers,
    destinyNumber,
    destinyNumberInterpretation,
  } = numerologyResult;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">
            {modalCaption[lang]}
          </AlertDialogTitle>
          <AlertDialogTitle>
            {`${modalDescription[lang]} "${formData.username}" (${getFormattedDateStrYearFirst(formData.birthdate)})`}
          </AlertDialogTitle>
          {numerologyResult ? (
            <ul className="max-h-[40dvh] space-y-4 overflow-y-auto">
              <li>
                <AlertDialogDescription>
                  <strong>{lifePathNumberCaption[lang]}:</strong>{' '}
                  {lifePathNumber}{' '}
                  {lifePathInvolvedNumbers.length > 0 &&
                    `(${lifePathInvolvedNumbers.join(', ')})`}{' '}
                  - {lifePathNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{soulNumberCaption[lang]}:</strong> {soulNumber}{' '}
                  {soulInvolvedNumbers.length > 0 &&
                    `(${soulInvolvedNumbers.join(', ')})`}{' '}
                  - {soulNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{destinyNumberCaption[lang]}:</strong> {destinyNumber}{' '}
                  {destinyInvolvedNumbers.length > 0 &&
                    `(${destinyInvolvedNumbers.join(', ')})`}{' '}
                  - {destinyNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{personalityNumberCaption[lang]}:</strong>{' '}
                  {personalityNumber}{' '}
                  {personalityInvolvedNumbers.length > 0 &&
                    `(${personalityInvolvedNumbers.join(', ')})`}{' '}
                  - {personalityNumberInterpretation}
                </AlertDialogDescription>
              </li>
              <li>
                <AlertDialogDescription>
                  <strong>{overallInterpretationCaption[lang]}:</strong>{' '}
                  {overallInterpretation}
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
