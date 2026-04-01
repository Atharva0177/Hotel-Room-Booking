export const RoomFilters = ({ filters, setFilters, onClear }) => (
  <aside className="premium-panel self-start rounded-2xl border border-gold/30 p-4 md:sticky md:top-24 md:p-5">
    <h3 className="font-accent text-sm uppercase tracking-widest text-gold">Filters</h3>
    <div className="mt-3 space-y-3 text-sm">
      <select value={filters.type} onChange={(e) => setFilters((v) => ({ ...v, type: e.target.value }))} className="w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10">
        <option value="">All Types</option>
        <option value="STANDARD">Standard</option>
        <option value="DELUXE">Deluxe</option>
        <option value="SUITE">Suite</option>
        <option value="PRESIDENTIAL">Presidential</option>
      </select>
      <input type="number" min="0" placeholder="Min price" value={filters.minPrice} onChange={(e) => setFilters((v) => ({ ...v, minPrice: e.target.value }))} className="w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10" />
      <input type="number" min="0" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters((v) => ({ ...v, maxPrice: e.target.value }))} className="w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10" />
      <button onClick={onClear} className="w-full rounded-lg border border-gold px-3 py-2 text-xs uppercase tracking-wider text-gold transition hover:bg-gold/10">Clear Filters</button>
    </div>
  </aside>
);
