import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const HeroSection = () => {
  const { settings } = useSiteSettingsStore();

  return (
    <section className="grain premium-card hero-surface relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/30 px-4 py-12 sm:px-6 md:px-12 md:py-24 text-center">
      <div className="absolute inset-0 -z-20 bg-[url('https://picsum.photos/seed/aureliahero/1600/900')] bg-cover bg-center opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/20 to-auburn/70" />
      <div className="absolute -left-14 top-16 h-36 w-36 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-burgundy/35 blur-3xl" />
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto mb-6 inline-flex rounded-full border border-gold/40 bg-black/25 px-4 py-2 font-accent text-xs uppercase tracking-[0.24em] text-gold backdrop-blur-sm">
        City Escape. Resort Soul.
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-display text-4xl sm:text-5xl md:text-7xl text-ivory leading-tight">
        {settings.heroTitle}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-ivory/85">
        {settings.heroSubtitle}
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.45 }} className="float-slow">
        <Link to="/rooms" className="mt-6 sm:mt-8 inline-block rounded-lg sm:rounded-xl border border-gold bg-gold px-5 sm:px-7 py-2.5 sm:py-3 font-accent text-xs sm:text-sm uppercase tracking-wider text-auburn transition hover:-translate-y-0.5 hover:brightness-105">
          Explore Rooms
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
        className="mx-auto mt-6 sm:mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3"
      >
        {[
          { value: '24/7', label: 'Concierge' },
          { value: '5★', label: 'Guest Rated' },
          { value: '12m', label: 'To Coastline' },
        ].map((item) => (
          <div key={item.label} className="rounded-lg sm:rounded-xl border border-gold/25 bg-black/25 px-2 sm:px-3 py-2 sm:py-3 backdrop-blur-sm">
            <p className="font-display text-lg sm:text-2xl text-gold">{item.value}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.16em] text-ivory/75">{item.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
