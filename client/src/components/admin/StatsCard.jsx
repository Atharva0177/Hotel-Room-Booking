export const StatsCard = ({ label, value }) => (
  <article className="rounded-lg border border-gold/30 bg-black/20 p-2 sm:p-2.5 md:p-3 lg:p-4">
    <p className="text-[9px] sm:text-xs md:text-xs lg:text-xs uppercase tracking-widest text-gold">{label}</p>
    <p className="mt-1 sm:mt-1.5 font-display text-lg sm:text-xl md:text-2xl lg:text-3xl break-words">{value}</p>
  </article>
);
