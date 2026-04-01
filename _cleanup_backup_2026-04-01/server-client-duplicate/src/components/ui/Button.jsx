export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`rounded-md border border-gold bg-gold px-4 py-2 font-accent text-sm uppercase tracking-wider text-auburn transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    {...props}
  >
    {children}
  </button>
);
