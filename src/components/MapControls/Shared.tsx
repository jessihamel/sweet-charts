export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block font-light uppercase">{children}</label>
);

export const MoreInfo = ({ children }: { children: React.ReactNode }) => (
  <div className="mr-4 mt-4 text-sm">{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...rest }: ButtonProps) => (
  <button
    className="m-2 rounded-sm border border-gray-300 px-2 text-brand hover:bg-slate-100"
    {...rest}
  >
    {children}
  </button>
);

export const SELECT_CLASS = 'px-2 py-1 mt-4 rounded-sm border border-brand w-full max-w-96';

export const NUMERIC_INPUT_CLASS = 'px-1 border border-brand max-w-32';
