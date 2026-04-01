import { useEffect } from 'react';
import { useRooms } from '../../hooks/useRooms';
import { RoomCard } from '../rooms/RoomCard';

export const FeaturedRooms = () => {
  const { featuredRooms, fetchFeaturedRooms, loading, error } = useRooms();

  useEffect(() => {
    fetchFeaturedRooms();
  }, [fetchFeaturedRooms]);

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Curated Stays</p>
          <h2 className="font-display text-4xl text-gold">Featured Rooms</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <p className="rounded-xl border border-gold/20 bg-black/20 p-6 text-ivory/70 md:col-span-3">Loading rooms...</p>
        ) : error ? (
          <p className="rounded-xl border border-red-300/40 bg-red-500/10 p-6 text-red-200 md:col-span-3">{error}</p>
        ) : featuredRooms.length ? (
          featuredRooms.map((room) => <RoomCard key={room.id} room={room} />)
        ) : (
          <p className="rounded-xl border border-gold/20 bg-black/20 p-6 text-ivory/70 md:col-span-3">No rooms found yet.</p>
        )}
      </div>
    </section>
  );
};
