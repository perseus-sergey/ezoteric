interface ITextUnderH1Props {
  children?: React.ReactNode;
}

const TextUnderH1 = ({ children }: ITextUnderH1Props) => (
  <section
    style={{
      textShadow: '0px 1px 1px #ffffff',
      background:
        'linear-gradient(to bottom, rgba(144, 191, 240, 0.34) 50%, rgba(107, 168, 229, 0.57) 51%, rgba(189, 243, 253, 0.36) 100%)',
    }}
    className="text-blue-950 text-xl py-2 px-5 m-2 border border-solid border-white rounded-lg shadow-md shadow-blue-900"
  >
    {children}
  </section>
);

export default TextUnderH1;
