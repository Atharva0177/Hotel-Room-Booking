import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/home/HeroSection';
import { SearchBar } from '../components/home/SearchBar';
import { FeaturedRooms } from '../components/home/FeaturedRooms';
import { Amenities } from '../components/home/Amenities';
import { LocationSection } from '../components/home/LocationSection';
import { api } from '../services/api';

export const HomePage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    await api.post('/newsletter', { email });
    setMessage('Subscribed successfully');
    setEmail('');
  };

  return (
    <div className="space-y-10 pb-16">
      <HeroSection />
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45 }}>
        <SearchBar />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
        <FeaturedRooms />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.05 }}>
        <Amenities />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.08 }}>
        <LocationSection />
      </motion.div>
      <section className="premium-panel rounded-2xl border border-gold/25 p-7">
        <h3 className="font-display text-3xl text-gold">Newsletter</h3>
        <form onSubmit={subscribe} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter email" className="flex-1 rounded-lg border border-gold/30 bg-white/5 px-4 py-3 outline-none transition focus:border-gold/70 focus:bg-white/10" />
          <button className="rounded-lg border border-gold bg-gold px-5 py-3 font-accent text-auburn transition hover:brightness-105">Subscribe</button>
        </form>
        {message && <p className="mt-2 text-sm text-green-300">{message}</p>}
      </section>
    </div>
  );
};
