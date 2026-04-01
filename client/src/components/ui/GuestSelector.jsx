export const GuestSelector = ({ adults, children, setAdults, setChildren }) => (
  <div className="grid gap-2 sm:grid-cols-2">
    <label className="text-sm">
      Adults
      <input
        type="number"
        min="1"
        max="10"
        value={adults}
        onChange={(e) => setAdults(Number(e.target.value))}
        className="mt-1 w-full rounded border border-gold/40 bg-transparent px-2 py-1"
      />
    </label>
    <label className="text-sm">
      Children
      <input
        type="number"
        min="0"
        max="5"
        value={children}
        onChange={(e) => setChildren(Number(e.target.value))}
        className="mt-1 w-full rounded border border-gold/40 bg-transparent px-2 py-1"
      />
    </label>
  </div>
);
