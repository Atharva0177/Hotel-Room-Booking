import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Wifi, Coffee, Tv, Wind, Users, Maximize2, Eye, Bed, ShieldCheck, Clock3, Sparkles } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import { RoomGallery } from '../components/rooms/RoomGallery';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { GuestSelector } from '../components/ui/GuestSelector';
import { toINR } from '../utils/priceUtils';
import { StarRating } from '../components/ui/StarRating';

export const RoomDetailPage = () => {
  const { slug } = useParams();
  const { selectedRoom, fetchRoomBySlug, loading } = useRooms();
  const [range, setRange] = useState();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    fetchRoomBySlug(slug);
  }, [slug, fetchRoomBySlug]);

  const pricing = useMemo(() => {
    if (!range?.from || !range?.to || !selectedRoom) return null;
    const nights = Math.max(1, Math.ceil((range.to - range.from) / (1000 * 60 * 60 * 24)));
    const guests = Number(adults || 0) + Number(children || 0);
    const roomsNeeded = Math.max(1, Math.ceil(guests / Math.max(1, selectedRoom.maxGuests)));
    const subtotal = nights * selectedRoom.pricePerNight * roomsNeeded;
    const tax = subtotal * 0.18;
    return { nights, roomsNeeded, subtotal, tax, total: subtotal + tax };
  }, [range, selectedRoom, adults, children]);

  const getAmenityIcon = (amenity) => {
    const label = amenity.toLowerCase();
    if (label.includes('wifi') || label.includes('internet')) return Wifi;
    if (label.includes('coffee') || label.includes('bar')) return Coffee;
    if (label.includes('tv') || label.includes('screen')) return Tv;
    if (label.includes('air') || label.includes('climate')) return Wind;
    return Sparkles;
  };

  const defaultSignaturePerks = [
    {
      title: 'Private Butler Service',
      description: 'On-call assistance for unpacking, dining reservations, and bespoke requests.',
      Icon: ShieldCheck,
    },
    {
      title: 'Curated In-Room Dining',
      description: 'Chef-crafted tasting selections with elevated pairings from our sommelier.',
      Icon: Coffee,
    },
    {
      title: 'Sunset Turndown Ritual',
      description: 'Evening ambience setup with aroma preferences and artisanal chocolates.',
      Icon: Star,
    },
  ];

  if (loading || !selectedRoom) return <p>Loading room details...</p>;

  const signaturePerks =
    selectedRoom.signatureExperiences?.length > 0
      ? selectedRoom.signatureExperiences.map((entry, index) => {
          const [title, description] = entry.split('|').map((part) => part?.trim());
          const fallback = defaultSignaturePerks[index % defaultSignaturePerks.length];
          return {
            title: title || fallback.title,
            description: description || fallback.description,
            Icon: fallback.Icon,
          };
        })
      : defaultSignaturePerks;

  const stayPolicies = [
    { label: 'Check-in', value: selectedRoom.checkInTime || 'From 3:00 PM' },
    { label: 'Check-out', value: selectedRoom.checkOutTime || 'Until 11:00 AM' },
    { label: 'Cancellation', value: selectedRoom.cancellationPolicy || 'Free up to 48 hours before arrival' },
    { label: 'Counter Payment', value: selectedRoom.paymentPolicy || 'Pay securely at the property front desk' },
  ];

  const guestAssurancePoints =
    selectedRoom.guestAssurancePoints?.length > 0
      ? selectedRoom.guestAssurancePoints
      : [
          'Personalized pre-arrival planning with concierge coordination.',
          'Priority support for airport transfer, dining, and spa arrangements.',
          'Meticulous housekeeping standards with nightly turndown service.',
        ];

  return (
    <section className="space-y-6 pb-16">
      <div>
        <RoomGallery images={selectedRoom.images} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-5xl text-gold">{selectedRoom.name}</h1>
                  <p className="mt-1 text-sm text-gold uppercase tracking-wider">{selectedRoom.type}</p>
                </div>
              </div>
              <p className="mt-4 text-lg text-ivory/90">{selectedRoom.longDesc}</p>
            </div>

            <div className="grid gap-3 rounded-xl border border-gold/30 bg-black/20 p-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="flex flex-col items-center gap-2 py-2">
                <Users className="h-6 w-6 text-gold" />
                <p className="text-xs text-ivory/70">Max Guests</p>
                <p className="font-semibold text-ivory">{selectedRoom.maxGuests}</p>
              </div>
              <div className="flex flex-col items-center gap-2 py-2">
                <Bed className="h-6 w-6 text-gold" />
                <p className="text-xs text-ivory/70">Bed Type</p>
                <p className="font-semibold text-ivory">{selectedRoom.bedType}</p>
              </div>
              <div className="flex flex-col items-center gap-2 py-2">
                <Maximize2 className="h-6 w-6 text-gold" />
                <p className="text-xs text-ivory/70">Size</p>
                <p className="font-semibold text-ivory">{selectedRoom.size} sq ft</p>
              </div>
              <div className="flex flex-col items-center gap-2 py-2">
                <Eye className="h-6 w-6 text-gold" />
                <p className="text-xs text-ivory/70">View</p>
                <p className="font-semibold text-ivory text-center">{selectedRoom.viewType}</p>
              </div>
              <div className="flex flex-col items-center gap-2 py-2">
                <Users className="h-6 w-6 text-gold" />
                <p className="text-xs text-ivory/70">Units</p>
                <p className="font-semibold text-ivory">{selectedRoom.inventoryCount || 1}</p>
              </div>
            </div>

            {selectedRoom.amenities?.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-2xl text-gold">Amenities</h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedRoom.amenities.map((amenity) => {
                    const AmenityIcon = getAmenityIcon(amenity);
                    return (
                    <div key={amenity} className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2">
                      <AmenityIcon className="h-4 w-4 text-gold" />
                      <span className="text-sm text-ivory/90">{amenity}</span>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-3 font-display text-2xl text-gold">Signature Experiences</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {signaturePerks.map(({ title, description, Icon }) => (
                  <article key={title} className="rounded-xl border border-gold/25 bg-black/25 p-4">
                    <div className="mb-3 inline-flex rounded-lg border border-gold/30 bg-gold/10 p-2">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-medium text-ivory">{title}</h3>
                    <p className="mt-2 text-sm text-ivory/70">{description}</p>
                  </article>
                ))}
              </div>
            </div>

            {selectedRoom.description && (
              <div className="rounded-xl border border-gold/30 bg-black/20 p-4">
                <h3 className="mb-2 font-display text-xl text-gold">About this room</h3>
                <p className="text-ivory/80">{selectedRoom.description}</p>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-gold/25 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-xl text-gold">Stay Details</h3>
                </div>
                <div className="space-y-2 text-sm text-ivory/85">
                  {stayPolicies.map((policy) => (
                    <div key={policy.label} className="flex items-center justify-between gap-3 border-b border-gold/10 pb-2 last:border-b-0 last:pb-0">
                      <span className="text-ivory/70">{policy.label}</span>
                      <span className="text-right font-medium text-ivory">{policy.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gold/25 bg-gradient-to-br from-gold/10 via-black/20 to-black/40 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-xl text-gold">Guest Assurance</h3>
                </div>
                <ul className="space-y-2 text-sm text-ivory/85">
                  {guestAssurancePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedRoom.reviews?.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-2xl text-gold">Guest Reviews</h2>
                <div className="space-y-3">
                  {selectedRoom.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="rounded-lg border border-gold/20 bg-black/20 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-ivory">{review.title}</p>
                          <p className="text-xs text-ivory/60">by {review.user?.firstName} {review.user?.lastName}</p>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="mt-2 text-sm text-ivory/80">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="sticky top-24 h-fit rounded-xl border border-gold/30 bg-black/20 p-5">
            <p className="font-display text-3xl text-gold">{toINR(selectedRoom.pricePerNight)} <span className="text-sm text-ivory/60">/night</span></p>
            <div className="mt-4"><DateRangePicker value={range} onChange={setRange} /></div>
            <div className="mt-4"><GuestSelector adults={adults} children={children} setAdults={setAdults} setChildren={setChildren} /></div>
            {pricing && (
              <div className="mt-4 space-y-2 rounded-lg border border-gold/20 bg-gold/5 p-3 text-sm">
                <div className="flex justify-between text-ivory/80">
                  <span>{pricing.nights} night{pricing.nights !== 1 ? 's' : ''}</span>
                  <span>{toINR(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Rooms required</span>
                  <span>{pricing.roomsNeeded}</span>
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Tax (18%)</span>
                  <span>{toINR(pricing.tax)}</span>
                </div>
                <div className="border-t border-gold/20 pt-2 font-semibold text-gold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{toINR(pricing.total)}</span>
                  </div>
                </div>
              </div>
            )}
            {pricing && pricing.roomsNeeded > (selectedRoom.inventoryCount || 1) && (
              <p className="mt-3 rounded border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                Only {selectedRoom.inventoryCount || 1} unit(s) available for this room type. Reduce guest count or choose another room.
              </p>
            )}
            <Link
              to={pricing && pricing.roomsNeeded > (selectedRoom.inventoryCount || 1) ? '#' : `/booking/${selectedRoom.id}`}
              state={{ range, adults, children }}
              className={`mt-4 block w-full rounded-lg border border-gold px-4 py-3 text-center font-accent uppercase transition ${
                pricing && pricing.roomsNeeded > (selectedRoom.inventoryCount || 1)
                  ? 'cursor-not-allowed bg-gold/30 text-auburn/70 pointer-events-none'
                  : 'bg-gold text-auburn hover:bg-gold/90'
              }`}
            >
              Book Now
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
};
