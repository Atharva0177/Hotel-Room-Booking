import { useState } from 'react';
import { useEffect } from 'react';
import { galleryService } from '../services/galleryService';

const getGalleryKey = (item) =>
  `${(item.category || '').trim().toLowerCase()}|${(item.imageUrl || '').trim().toLowerCase()}|${(item.title || '').trim().toLowerCase()}`;

const defaultTabs = ['Rooms', 'Pool', 'Restaurant', 'Events', 'Exterior'];

export const GalleryPage = () => {
  const [active, setActive] = useState('Rooms');
  const [tabs, setTabs] = useState(defaultTabs);
  const [groupedImages, setGroupedImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await galleryService.getAll();
        const grouped = response.data.data || {};
        setGroupedImages(grouped);

        const keys = Object.keys(grouped);
        if (keys.length > 0) {
          setTabs(keys);
          if (!keys.includes(active)) {
            setActive(keys[0]);
          }
        }
      } catch (_error) {
        setGroupedImages({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeImages = groupedImages[active] || [];
  const uniqueActiveImages = [];
  const seenActive = new Set();
  activeImages.forEach((image) => {
    const key = getGalleryKey(image);
    if (!seenActive.has(key)) {
      seenActive.add(key);
      uniqueActiveImages.push(image);
    }
  });

  return (
    <section className="pb-16">
      <div className="premium-panel rounded-3xl border border-gold/25 p-6 md:p-8">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Visual Journey</p>
        <h1 className="font-display text-5xl text-gold">Gallery</h1>
        <p className="mt-3 max-w-3xl text-ivory/80">
          Explore curated moments from rooms, dining, events, and the atmosphere that defines Aurelia Grand.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)} className={`rounded-lg border px-3 py-1.5 text-xs uppercase tracking-wider transition ${active === tab ? 'border-gold bg-gold text-auburn' : 'border-gold/40 bg-white/5 text-gold hover:bg-gold/10'}`}>
            {tab}
          </button>
        ))}
      </div>
      {loading && <p className="mt-6 text-ivory/70">Loading gallery...</p>}
      {!loading && tabs.length === 0 && <p className="mt-6 text-ivory/70">No gallery images available right now.</p>}
      <div className="mt-6 columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3">
        {uniqueActiveImages.map((image, i) => (
          <img
            key={image.id || `${active}-${i}`}
            src={image.imageUrl}
            alt={image.title || `${active} ${i + 1}`}
            className="w-full rounded-xl border border-gold/15"
            loading="lazy"
          />
        ))}
      </div>
      {!loading && tabs.length > 0 && uniqueActiveImages.length === 0 && (
        <p className="mt-4 text-ivory/70">No images in this category.</p>
      )}
    </section>
  );
};
