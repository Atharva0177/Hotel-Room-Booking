import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRooms } from '../hooks/useRooms';
import { useBooking } from '../hooks/useBooking';
import { BookingSummary } from '../components/booking/BookingSummary';
import { GuestDetailsForm } from '../components/booking/GuestDetailsForm';

const guestSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

export const BookingPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, fetchRooms } = useRooms();
  const { createBooking, loading } = useBooking();
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');

  const room = rooms.find((item) => item.id === roomId);
  const range = location.state?.range;
  const checkInDate = range?.from ? new Date(range.from) : null;
  const checkOutDate = range?.to ? new Date(range.to) : null;
  const adults = location.state?.adults || 2;
  const children = location.state?.children || 0;

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({ resolver: zodResolver(guestSchema) });

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const pricing = useMemo(() => {
    if (!room || !checkInDate || !checkOutDate) return { totalPrice: 0, taxAmount: 0, finalPrice: 0 };
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
    const totalGuests = Number(adults || 0) + Number(children || 0);
    const roomsNeeded = Math.max(1, Math.ceil(totalGuests / Math.max(1, room.maxGuests)));
    const totalPrice = nights * room.pricePerNight * roomsNeeded;
    const discount = promoCode ? totalPrice * 0.1 : 0;
    const taxed = totalPrice - discount;
    const taxAmount = taxed * 0.18;
    return { totalPrice, taxAmount, finalPrice: taxed + taxAmount, nights, roomsNeeded, totalGuests };
  }, [room, checkInDate, checkOutDate, promoCode, adults, children]);

  const confirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates from the room page.');
      return;
    }

    try {
      const guest = getValues();
      const booking = await createBooking({
        roomId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        adults,
        children,
        guestName: `${guest.firstName} ${guest.lastName}`,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        promoCode,
      });
      toast.success('Booking confirmed');
      navigate(`/booking/confirmation/${booking.bookingCode}`, { state: { booking } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Try different dates or room.');
    }
  };

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      toast('Select your dates first, then continue booking.');
    }
  }, [checkInDate, checkOutDate]);

  if (!room) return <p>Loading booking...</p>;

  return (
    <section className="pb-16">
      <h1 className="font-display text-5xl text-gold">Booking</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-xl border border-gold/30 bg-black/20 p-5">
          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl">Step 1: Review</h2>
              <p className="mt-2">{room.name}</p>
              <p className="mt-1 text-sm text-ivory/70">{checkInDate?.toDateString() || 'Select date'} to {checkOutDate?.toDateString() || 'Select date'}</p>
              <p className="mt-1 text-sm text-ivory/70">
                Guests: {pricing.totalGuests || adults + children} | Auto-selected units: {pricing.roomsNeeded || 1}
              </p>
              {pricing.roomsNeeded > (room.inventoryCount || 1) && (
                <p className="mt-2 rounded border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  Only {room.inventoryCount || 1} unit(s) are available for this room type. Reduce guests or change room.
                </p>
              )}
              <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className="mt-3 rounded border border-gold/30 bg-transparent px-3 py-2" />
              <button onClick={() => setStep(2)} disabled={!checkInDate || !checkOutDate || pricing.roomsNeeded > (room.inventoryCount || 1)} className="mt-3 rounded border border-gold bg-gold px-4 py-2 text-auburn disabled:cursor-not-allowed disabled:opacity-60">Continue</button>
            </div>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit(confirmBooking)}>
              <h2 className="font-display text-3xl">Step 2: Guest Details & Confirmation</h2>
              <div className="mt-3"><GuestDetailsForm register={register} errors={errors} /></div>
              <p className="mt-3 text-sm text-ivory/70">
                Payment will be collected at the hotel counter during check-in.
              </p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="rounded border border-gold/40 px-3 py-2">Back</button>
                <button type="submit" disabled={loading} className="rounded border border-gold bg-gold px-4 py-2 text-auburn disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
        <BookingSummary room={room} pricing={pricing} />
      </div>
    </section>
  );
};
