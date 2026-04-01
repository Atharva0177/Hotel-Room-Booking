import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { toINR } from '../../utils/priceUtils';

export const RoomCard = ({ room }) => (
  <motion.article
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.32 }}
    whileHover={{ y: -4 }}
    className="premium-card rounded-xl border border-gold/25 bg-black/20 p-3 transition hover:shadow-glow"
  >
    <img src={room.images?.[0]} alt={room.name} className="h-48 sm:h-56 w-full rounded-lg object-cover" loading="lazy" />
    <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
      <h3 className="font-display text-xl sm:text-2xl text-ivory">{room.name}</h3>
      <Badge>{room.type}</Badge>
    </div>
    <p className="mt-1 text-xs sm:text-sm text-ivory/70">{room.bedType} | {room.size} sq ft | Max {room.maxGuests}</p>
    <p className="mt-1.5 sm:mt-2 font-accent text-xs sm:text-sm uppercase text-gold">{toINR(room.pricePerNight)} / night</p>
    <Link to={`/rooms/${room.slug}`} className="mt-2 sm:mt-3 inline-block rounded border border-gold px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs uppercase tracking-wider text-gold hover:bg-gold/10 transition">
      View Details
    </Link>
  </motion.article>
);
