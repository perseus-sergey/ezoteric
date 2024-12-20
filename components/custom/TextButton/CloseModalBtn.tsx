import { ELanguage } from "@/models/language.model";
import { BaseButton } from "./BaseButton";

const closeModalBtn = ({
  closeFn,
  lang,
}: {
  closeFn: () => void;
  lang: ELanguage;
}) => (
  <BaseButton
    ariaLabel={
      lang === ELanguage.UA
        ? "Закрити модальне вікно"
        : "Close the modal window"
    }
    className="absolute top-2 right-2 text-5xl font-extralight text-slate-400 rotate-45"
    onClick={() => closeFn()}
  >
    +
  </BaseButton>
);

export default closeModalBtn;
