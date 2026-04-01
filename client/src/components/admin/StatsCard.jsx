export const StatsCard = ({ label, value }) => (
  <article className="rounded-xl border border-gold/30 bg-black/20 p-4">
    <p className="text-xs uppercase tracking-widest text-gold">{label}</p>
    <p className="mt-2 font-display text-3xl">{value}</p>
  </article>
);
