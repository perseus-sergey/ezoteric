interface ITextUnderH1Props {
  children?: React.ReactNode;
}

const TextUnderH1 = ({ children }: ITextUnderH1Props) => (
  <section className="max-w-3xl mx-auto text-tertiary-foreground bg-tertiary font-georgia text-xl py-2 px-5 m-2 border border-slate-400 rounded-lg shadow-md">
    {children}
  </section>
);

export default TextUnderH1;
