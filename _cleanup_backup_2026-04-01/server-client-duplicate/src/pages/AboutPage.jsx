import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import aboutService from '../services/aboutService';

export const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await aboutService.getAbout();
        setAbout(res.data);
      } catch (err) {
        console.error('Failed to load about content:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-ivory/60">Loading...</div>;
  }

  if (!about) {
    return <div className="py-16 text-center text-ivory/60">No content available</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.section
      className="space-y-8 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="premium-panel rounded-3xl border border-gold/25 p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-auburn/10 to-transparent opacity-50" />
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-accent text-xs uppercase tracking-[0.3em] text-gold/80 mb-3"
          >
            {about.heritageTagline}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-6xl md:text-7xl text-gold mb-4"
          >
            {about.heritageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-ivory/85 max-w-3xl leading-relaxed"
          >
            {about.heritageDescription}
          </motion.p>
        </div>
      </motion.div>

      {/* Story Section */}
      <motion.article
        variants={itemVariants}
        className="premium-panel rounded-2xl border border-gold/30 p-8 md:p-10 hover:border-gold/50 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-gold to-gold/30 rounded" />
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-display text-4xl text-gold mb-4"
            >
              {about.storyTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-ivory/80 leading-relaxed"
            >
              {about.storyContent}
            </motion.p>
          </div>
        </div>
      </motion.article>

      {/* Awards Section */}
      <motion.article
        variants={itemVariants}
        className="premium-panel rounded-2xl border border-gold/30 p-8 md:p-10"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-display text-4xl text-gold mb-8"
        >
          {about.awardsTitle}
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {about.awards?.map((award, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-gold/15 hover:bg-white/10 hover:border-gold/30 transition-all"
            >
              <span className="text-2xl">{award.icon || '✓'}</span>
              <p className="text-ivory/80 pt-1">{award.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.article>

      {/* Mission Statement */}
      <motion.div
        variants={itemVariants}
        className="premium-panel rounded-2xl border border-gold/30 p-8 md:p-10 bg-gradient-to-br from-white/5 to-transparent"
      >
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="font-accent text-xs uppercase tracking-[0.2em] text-gold/70 mb-3"
          >
            Our Philosophy
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-xl text-ivory/80 italic"
          >
            Excellence in hospitality is not a destination—it's a journey of continuous refinement, where every detail reflects our commitment to exceeding expectations and creating lasting impressions on our cherished guests.
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
};
