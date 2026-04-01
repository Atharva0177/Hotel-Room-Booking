import { useLocation, useParams, Link } from 'react-router-dom';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';

export const BookingConfirmationPage = () => {
  const { bookingCode } = useParams();
  const location = useLocation();
  const booking = location.state?.booking || { bookingCode, status: 'PENDING' };
  const isConfirmed = booking?.status === 'CONFIRMED';

  return (
    <section className="mx-auto max-w-2xl pb-16">
      <BookingConfirmation booking={booking} />
      <p className="mt-3 rounded border border-gold/30 bg-black/20 p-3 text-sm text-ivory/80">
        {isConfirmed
          ? 'Your booking is confirmed. Payment is due at the hotel front desk during check-in.'
          : 'Your booking is currently pending admin approval. Once approved, you will receive a confirmation email.'}
      </p>
      <div className="mt-4 flex gap-3">
        <Link to="/profile" className="rounded border border-gold px-4 py-2 text-gold">View My Bookings</Link>
        <button onClick={() => navigator.clipboard.writeText(bookingCode)} className="rounded border border-gold bg-gold px-4 py-2 text-auburn">Copy Code</button>
      </div>
    </section>
  );
};
