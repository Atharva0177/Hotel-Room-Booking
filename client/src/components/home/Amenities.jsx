import { AMENITIES } from '../../constants';

export const Amenities = () => (
  <section className="premium-panel mt-12 sm:mt-16 rounded-xl sm:rounded-2xl border border-gold/20 p-4 sm:p-6 md:p-8">
    <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Signature Experience</p>
    <h2 className="font-display text-3xl sm:text-4xl text-gold">Hotel Amenities</h2>
    <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
      {AMENITIES.map((item, index) => (
        <div
          key={item}
          className="group rounded-xl border border-gold/25 bg-white/5 p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-gold/10"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <p className="text-sm uppercase tracking-[0.12em] text-ivory/90">{item}</p>
        </div>
      ))}
    </div>
  </section>
);
