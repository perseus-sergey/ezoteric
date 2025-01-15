interface ITextUnderH1Props {
  children?: React.ReactNode;
}

const TextUnderH1 = ({ children }: ITextUnderH1Props) => (
  <section className="max-w-xl mx-auto text-center sm:text-justify text-tertiary-foreground bg-tertiary font-georgia text-xl p-6 my-6 border border-slate-400 rounded-lg shadow-md">
    {children}
  </section>
);

export default TextUnderH1;
