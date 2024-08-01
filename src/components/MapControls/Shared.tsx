export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block uppercase font-light">{children}</label>
);

export const MoreInfo = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 mr-4 text-sm [&_a]:underline [&_a]:decoration-dashed">{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...rest }: ButtonProps) => (
  <button className="m-2 px-2 border border-gray-300 rounded-sm hover:bg-slate-100" {...rest}>
    {children}
  </button>
);

export const SELECT_CLASS = 'px-2 py-1 mt-4 rounded-sm border border-slate-500 w-full max-w-96';

export const NUMERIC_INPUT_CLASS = 'px-1 border border-slate-500 max-w-32';
