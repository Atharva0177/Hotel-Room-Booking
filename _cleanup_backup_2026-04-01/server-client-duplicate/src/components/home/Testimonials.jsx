import { StarRating } from '../ui/StarRating';

const testimonials = [
  { name: 'Aarav', rating: 5, quote: 'Impeccable service and stunning design.' },
  { name: 'Elena', rating: 5, quote: 'An unforgettable luxury getaway.' },
  { name: 'Mira', rating: 4, quote: 'Loved the suites and spa experience.' },
];

export const Testimonials = () => (
  <section className="mt-16">
    <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Loved By Travelers</p>
    <h2 className="font-display text-4xl text-gold">Guest Testimonials</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {testimonials.map((item) => (
        <article key={item.name} className="premium-panel rounded-2xl border border-gold/25 p-5 transition duration-300 hover:-translate-y-1">
          <StarRating rating={item.rating} />
          <p className="mt-3 text-ivory/85">"{item.quote}"</p>
          <p className="mt-3 font-accent text-sm uppercase tracking-widest text-gold">{item.name}</p>
        </article>
      ))}
    </div>
  </section>
);
