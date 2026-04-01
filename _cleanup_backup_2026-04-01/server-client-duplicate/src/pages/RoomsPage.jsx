import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms';
import { RoomFilters } from '../components/rooms/RoomFilters';
import { RoomCard } from '../components/rooms/RoomCard';
import { Spinner } from '../components/ui/Spinner';

export const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const { rooms, loading, fetchRooms } = useRooms();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') === 'ALL' ? '' : searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    guests: searchParams.get('adults') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  });

  useEffect(() => {
    fetchRooms(filters);
  }, [filters, fetchRooms]);

  return (
    <section className="pb-16">
      <div className="premium-panel mb-8 rounded-3xl border border-gold/25 p-6 md:p-8">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Tailored Stays</p>
        <h1 className="font-display text-5xl text-gold">Rooms & Suites</h1>
        <p className="mt-3 max-w-3xl text-ivory/80">
          Choose from curated room categories with elevated comfort, signature amenities, and immersive city views.
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <RoomFilters filters={filters} setFilters={setFilters} onClear={() => setFilters({ type: '', minPrice: '', maxPrice: '', guests: '' })} />
        <div>
          {loading ? (
            <Spinner />
          ) : rooms.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="premium-panel rounded-2xl border border-gold/30 p-8 text-center text-ivory/80">No rooms match your filters.</div>
          )}
        </div>
      </div>
    </section>
  );
};
