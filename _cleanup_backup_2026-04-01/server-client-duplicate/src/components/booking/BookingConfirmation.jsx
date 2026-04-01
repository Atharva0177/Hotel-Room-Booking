export const BookingConfirmation = ({ booking }) => {
  const isConfirmed = booking?.status === 'CONFIRMED';

  return (
    <section className="rounded-xl border border-gold/30 bg-black/20 p-6 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-gold p-3 text-3xl text-gold">✓</div>
      <h2 className="font-display text-4xl text-gold">
        {isConfirmed ? 'Booking Confirmed' : 'Booking Request Submitted'}
      </h2>
      <p className="mt-2">Reference: {booking?.bookingCode}</p>
    </section>
  );
};
