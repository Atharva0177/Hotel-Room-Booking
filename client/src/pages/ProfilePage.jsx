import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';

export const ProfilePage = () => {
  const { user, fetchMe } = useAuth();
  const { myBookings, fetchMyBookings } = useBooking();

  useEffect(() => {
    fetchMe();
    fetchMyBookings();
  }, [fetchMe, fetchMyBookings]);

  return (
    <section className="pb-16">
      <h1 className="font-display text-5xl text-gold">My Profile</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="rounded-xl border border-gold/30 bg-black/20 p-5 lg:col-span-1">
          <h2 className="font-display text-3xl">My Info</h2>
          <p className="mt-2">{user?.firstName} {user?.lastName}</p>
          <p>{user?.email}</p>
          <p>{user?.phone}</p>
        </article>
        <article className="rounded-xl border border-gold/30 bg-black/20 p-5 lg:col-span-2">
          <h2 className="font-display text-3xl">My Bookings</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr><th className="px-2 py-1 text-left">Code</th><th className="px-2 py-1 text-left">Room</th><th className="px-2 py-1 text-left">Status</th><th className="px-2 py-1 text-left">Amount</th></tr></thead>
              <tbody>
                {myBookings.map((item) => (
                  <tr key={item.id} className="border-t border-gold/20"><td className="px-2 py-1">{item.bookingCode}</td><td className="px-2 py-1">{item.room?.name}</td><td className="px-2 py-1">{item.status}</td><td className="px-2 py-1">₹{Math.round(item.finalPrice)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};
