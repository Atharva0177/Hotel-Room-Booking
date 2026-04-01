export const Badge = ({ children, className = '' }) => (
  <span className={`rounded-full border border-gold/60 bg-gold/10 px-3 py-1 text-xs uppercase tracking-widest text-gold ${className}`}>
    {children}
  </span>
);
