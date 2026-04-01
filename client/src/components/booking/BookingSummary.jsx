import { toINR } from '../../utils/priceUtils';

export const BookingSummary = ({ room, pricing }) => (
  <div className="rounded-xl border border-gold/30 bg-black/20 p-4">
    <h3 className="font-display text-2xl text-gold">Booking Summary</h3>
    <p className="mt-2">{room?.name}</p>
    <div className="mt-3 space-y-1 text-sm text-ivory/80">
      <p>Units: {pricing.roomsNeeded || 1}</p>
      <p>Subtotal: {toINR(pricing.totalPrice)}</p>
      <p>Tax (18%): {toINR(pricing.taxAmount)}</p>
      <p className="font-semibold text-gold">Total: {toINR(pricing.finalPrice)}</p>
    </div>
  </div>
);
