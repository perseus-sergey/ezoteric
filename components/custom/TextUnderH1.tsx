interface ITextUnderH1Props {
  children?: React.ReactNode;
}

const TextUnderH1 = ({ children }: ITextUnderH1Props) => (
  <section className="max-w-3xl mx-auto text-mutex-foreground bg-slate-200 dark:bg-slate-600 font-georgia text-xl py-2 px-5 m-2 border border-slate-200 rounded-lg shadow-md">
    {children}
  </section>
);

export default TextUnderH1;
