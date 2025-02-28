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
import { Markdown } from '../markdown';
import { HrWithIcon } from '../HrWithIcon';

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

          <AlertDialogDescription>
            {`${modalDescription[lang]} "${formData.username}" (${getFormattedDateStrYearFirst(formData.birthdate)})`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {numerologyResult ? (
          <ul className="max-h-[50dvh] space-y-4 overflow-y-auto">
            <li>
              <strong>{lifePathNumberCaption[lang]}:</strong> {lifePathNumber}{' '}
              {lifePathInvolvedNumbers.length > 0 &&
                `(${lifePathInvolvedNumbers.join(', ')})`}
              <Markdown>{lifePathNumberInterpretation}</Markdown>
            </li>
            <HrWithIcon lang={lang} />
            <li>
              <strong>{soulNumberCaption[lang]}:</strong> {soulNumber}{' '}
              {soulInvolvedNumbers.length > 0 &&
                `(${soulInvolvedNumbers.join(', ')})`}
              <Markdown>{soulNumberInterpretation}</Markdown>
            </li>
            <HrWithIcon lang={lang} />
            <li>
              <strong>{destinyNumberCaption[lang]}:</strong> {destinyNumber}{' '}
              {destinyInvolvedNumbers.length > 0 &&
                `(${destinyInvolvedNumbers.join(', ')})`}
              <Markdown>{destinyNumberInterpretation}</Markdown>
            </li>
            <HrWithIcon lang={lang} />
            <li>
              <strong>{personalityNumberCaption[lang]}:</strong>{' '}
              {personalityNumber}{' '}
              {personalityInvolvedNumbers.length > 0 &&
                `(${personalityInvolvedNumbers.join(', ')})`}
              <Markdown>{personalityNumberInterpretation}</Markdown>
            </li>
            <HrWithIcon lang={lang} />
            <li>
              <strong>{overallInterpretationCaption[lang]}:</strong>{' '}
              <Markdown>{overallInterpretation}</Markdown>
            </li>
          </ul>
        ) : (
          modalResponseErrors[lang].join(' ')
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{modalCloseBtn[lang]}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
