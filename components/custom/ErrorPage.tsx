import { ELanguage } from '@/models/language.model';

interface IErrorPageProps {
  resetFn: () => void;
}

const ERROR_PAGE_TITLE = {
  [ELanguage.UA]:
    '⚠ Не вдалося завантажити контент. Будь ласка, спробуйте пізніше.',
  [ELanguage.EN]: '⚠ Failed to load content. Please try again later.',
};

const ErrorPage = ({ resetFn }: IErrorPageProps) => (
  <section className="flex flex-col justify-center items-center min-h-screen gap-8 p-4 bg-tertiary border border-stone-400 rounded-md">
    <h1 className="text-4xl text-center font-bold text-pink-700">Error Page</h1>

    {[ERROR_PAGE_TITLE[ELanguage.EN], ERROR_PAGE_TITLE[ELanguage.UA]].map(
      (title) => (
        <p key={title} className="text-xl text-center font-bold">
          {title}
        </p>
      )
    )}
    <button
      type="button"
      className="py-2 px-3 font-bold text-white text-center text-xl sm:text-2xl border border-solid border-blue-300 cursor-pointer rounded-md bg-gradient-to-b from-sky-400 to-blue-500 hover:to-blue-600 shadow"
      style={{ textShadow: '0 -1px 1px rgba(0, 0, 0, 0.25)' }}
      onClick={() => resetFn()}
    >
      Try again / Спробувати знову
    </button>
  </section>
);

export default ErrorPage;
