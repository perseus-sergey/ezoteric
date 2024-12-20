import { ELanguage } from "@/models/language.model";
import {
  IModalAiResponseProps,
  MODAL_NUMEROLOGY,
} from "@/models/meta/home.model";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  lang: ELanguage;
  aiResult: IModalAiResponseProps | null;
  openDialogFn: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

const { modalCaption, modalCloseBtn } = MODAL_NUMEROLOGY;

export const ModalNumerologyResponse = ({
  lang,
  aiResult,
  openDialogFn,
  isOpen,
}: IProps) => (
  <AlertDialog open={isOpen} onOpenChange={openDialogFn}>
    <AlertDialogContent className="overflow-y-auto">
      <AlertDialogHeader>
        {aiResult ? (
          <>
            <AlertDialogTitle className="text-center text-2xl">
              {modalCaption[lang]}
            </AlertDialogTitle>
            <AlertDialogTitle>
              {`Numerology results for "${aiResult.formData.username}" (${aiResult.formData.birthdate})`}
            </AlertDialogTitle>
            {aiResult.aiResponse ? (
              <ul className="max-h-[40dvh] overflow-y-auto">
                <li>
                  <AlertDialogDescription>
                    <strong>Life Path Number:</strong>{" "}
                    {aiResult.aiResponse.lifePathNumber} -{" "}
                    {aiResult.aiResponse.lifePathNumberInterpretation}
                  </AlertDialogDescription>
                </li>
                <li>
                  <AlertDialogDescription>
                    <strong>Destiny Number:</strong>{" "}
                    {aiResult.aiResponse.destinyNumber} -{" "}
                    {aiResult.aiResponse.destinyNumberInterpretation}
                  </AlertDialogDescription>
                </li>
                <li>
                  <AlertDialogDescription>
                    <strong>Personality Number:</strong>{" "}
                    {aiResult.aiResponse.personalityNumber} -{" "}
                    {aiResult.aiResponse.personalityNumberInterpretation}
                  </AlertDialogDescription>
                </li>
                <li>
                  <AlertDialogDescription>
                    <strong>Overall Interpretation:</strong>{" "}
                    {aiResult.aiResponse.overallInterpretation}
                  </AlertDialogDescription>
                </li>
              </ul>
            ) : (
              <AlertDialogDescription>
                На жаль, під час виконання сталася помилка. Будь ласка,
                спробуйте пізніше.
              </AlertDialogDescription>
            )}
          </>
        ) : (
          <>
            <AlertDialogTitle>
              На жаль, під час виконання сталася помилка.
            </AlertDialogTitle>
            <AlertDialogDescription>
              Будь ласка, спробуйте пізніше.
            </AlertDialogDescription>
          </>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{modalCloseBtn[lang]}</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
