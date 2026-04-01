import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const PageLayout = ({ children }) => {
  const { fetchSettings, settings } = useSiteSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    document.title = settings.heroTitle || 'Aurelia Grand Hotel';
  }, [settings.heroTitle]);

  return (
    <div className="min-h-screen bg-transparent text-ivory">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-3 sm:px-4 pt-20 sm:pt-24 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
