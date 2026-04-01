import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import aboutService from '../../services/aboutService';

export const AdminAbout = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAward, setNewAward] = useState('');
  const [newAwardIcon, setNewAwardIcon] = useState('✓');

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const res = await aboutService.getAbout();
      setAbout(res.data);
    } catch (err) {
      toast.error('Failed to load about content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAbout(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAward = () => {
    if (!newAward.trim()) {
      toast.error('Please enter an award title');
      return;
    }

    const updatedAwards = [...(about.awards || []), { title: newAward, icon: newAwardIcon }];
    handleInputChange('awards', updatedAwards);
    setNewAward('');
    setNewAwardIcon('✓');
    toast.success('Award added');
  };

  const handleRemoveAward = (idx) => {
    const updatedAwards = about.awards.filter((_, i) => i !== idx);
    handleInputChange('awards', updatedAwards);
    toast.success('Award removed');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await aboutService.updateAbout(about);
      toast.success('About content updated successfully');
    } catch (err) {
      toast.error('Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  if (!about) {
    return <div className="py-16 text-center">No content found</div>;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display text-gold">Edit About Page</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gold text-auburn rounded-lg font-accent font-bold hover:brightness-110 disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Heritage Section */}
        <div className="bg-white/5 border border-gold/30 rounded-lg p-6">
          <h3 className="text-lg font-display text-gold mb-4">Heritage Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gold/80 font-accent mb-2">Tagline</label>
              <input
                type="text"
                value={about.heritageTagline}
                onChange={(e) => handleInputChange('heritageTagline', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gold/80 font-accent mb-2">Title</label>
              <input
                type="text"
                value={about.heritageTitle}
                onChange={(e) => handleInputChange('heritageTitle', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gold/80 font-accent mb-2">Description</label>
              <textarea
                value={about.heritageDescription}
                onChange={(e) => handleInputChange('heritageDescription', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white/5 border border-gold/30 rounded-lg p-6">
          <h3 className="text-lg font-display text-gold mb-4">Our Story Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gold/80 font-accent mb-2">Title</label>
              <input
                type="text"
                value={about.storyTitle}
                onChange={(e) => handleInputChange('storyTitle', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gold/80 font-accent mb-2">Content</label>
              <textarea
                value={about.storyContent}
                onChange={(e) => handleInputChange('storyContent', e.target.value)}
                rows="5"
                className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="bg-white/5 border border-gold/30 rounded-lg p-6">
          <h3 className="text-lg font-display text-gold mb-4">Awards & Certifications</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gold/80 font-accent mb-2">Section Title</label>
              <input
                type="text"
                value={about.awardsTitle}
                onChange={(e) => handleInputChange('awardsTitle', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
              />
            </div>

            <div>
              <h4 className="text-sm text-gold/80 font-accent mb-3">Awards List</h4>
              <div className="space-y-2 mb-4">
                {about.awards?.map((award, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-gold/20"
                  >
                    <span className="text-sm text-ivory/80">
                      <span className="mr-2">{award.icon}</span>
                      {award.title}
                    </span>
                    <button
                      onClick={() => handleRemoveAward(idx)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newAward}
                    onChange={(e) => setNewAward(e.target.value)}
                    placeholder="New award title"
                    className="w-full px-4 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory placeholder-ivory/40 focus:border-gold/70 outline-none transition"
                  />
                </div>
                <select
                  value={newAwardIcon}
                  onChange={(e) => setNewAwardIcon(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-gold/30 rounded-lg text-ivory focus:border-gold/70 outline-none transition"
                >
                  <option value="✓">✓</option>
                  <option value="⭐">⭐</option>
                  <option value="🌟">🌟</option>
                  <option value="🏆">🏆</option>
                  <option value="🎖️">🎖️</option>
                  <option value="👑">👑</option>
                </select>
                <button
                  onClick={handleAddAward}
                  className="px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/50 rounded-lg text-gold font-accent transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
