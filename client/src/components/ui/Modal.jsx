export const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-xl border border-gold/40 bg-auburn p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl text-gold">{title}</h3>
          <button onClick={onClose} className="text-sm uppercase text-ivory/70">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
