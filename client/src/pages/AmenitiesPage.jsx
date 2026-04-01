import { useEffect, useState } from 'react';
import { amenitieService } from '../services/amenitiesService';

const getAmenityKey = (item) =>
  `${(item.title || '').trim().toLowerCase()}|${(item.hours || '').trim().toLowerCase()}|${(item.description || '').trim().toLowerCase()}`;

export const AmenitiesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await amenitieService.getAll();
        setItems(response.data.data || []);
      } catch (_error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uniqueItems = [];
  const seen = new Set();
  items.forEach((item) => {
    const key = getAmenityKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueItems.push(item);
    }
  });

  return (
    <section className="space-y-8 pb-16">
      <div className="premium-panel rounded-3xl border border-gold/25 p-6 md:p-8">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Curated Comfort</p>
        <h1 className="font-display text-5xl text-gold">Amenities</h1>
        <p className="mt-3 max-w-3xl text-ivory/80">
          Discover experiences designed around relaxation, wellness, and indulgence throughout your stay.
        </p>
      </div>
      {loading && <p className="text-ivory/70">Loading amenities...</p>}
      {!loading && uniqueItems.length === 0 && <p className="text-ivory/70">No amenities available right now.</p>}
      {uniqueItems.map((item, index) => (
        <article key={item.id || item.title} className="premium-panel grid gap-4 rounded-2xl border border-gold/30 p-5 md:grid-cols-2">
          <img
            src={item.imageUrl || `https://picsum.photos/seed/amenity-${index}/1000/600`}
            alt={item.title}
            className="h-56 w-full rounded-xl object-cover"
            loading="lazy"
          />
          <div>
            <h2 className="font-display text-3xl">{item.title}</h2>
            <p className="mt-2 text-gold">Hours: {item.hours || 'Available all day'}</p>
            <p className="mt-2 text-ivory/80">{item.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
};
