import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const Footer = () => {
  const { settings } = useSiteSettingsStore();

  return (
    <footer className="mt-20 border-t border-gold/30 bg-black/30 px-4 py-10 text-center text-sm text-ivory/70">
      <p className="font-accent tracking-widest text-gold">{settings.footerBrand}</p>
      <p className="mt-2">{settings.footerContact}</p>
      <p className="mt-3 text-xs">© {new Date().getFullYear()} {settings.heroTitle}. All rights reserved.</p>
    </footer>
  );
};
