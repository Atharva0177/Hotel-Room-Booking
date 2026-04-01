import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

export const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    api.get('/offers').then((response) => setOffers(response.data.data)).catch(() => setOffers([]));
  }, []);

  return (
    <section className="mt-16">
      <h2 className="font-display text-4xl text-gold">Special Offers</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {offers.map((offer) => (
          <article key={offer.id} className="rounded-xl border border-gold/30 bg-gradient-to-br from-black/20 to-burgundy/20 p-5">
            <p className="font-accent text-gold">{offer.discount}% OFF</p>
            <h3 className="mt-2 font-display text-2xl">{offer.title}</h3>
            <p className="mt-2 text-sm text-ivory/80">{offer.description}</p>
            <button
              className="mt-4 rounded border border-gold px-3 py-1 text-xs uppercase tracking-wider text-gold"
              onClick={() => {
                navigator.clipboard.writeText(offer.code);
                toast.success('Promo code copied');
              }}
            >
              {offer.code}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
