import { motion } from 'framer-motion';
import { HeroSection } from '../components/home/HeroSection';
import { SearchBar } from '../components/home/SearchBar';
import { FeaturedRooms } from '../components/home/FeaturedRooms';
import { Amenities } from '../components/home/Amenities';
import { LocationSection } from '../components/home/LocationSection';

export const HomePage = () => {

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
    </div>
  );
};
