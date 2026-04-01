import { create } from 'zustand';
import { api } from '../services/api';

const defaults = {
  navbarBrand: 'Aurelia Grand',
  heroTitle: 'Aurelia Grand Hotel',
  heroSubtitle: 'A five-star editorial luxury escape where gold-lit interiors meet ocean winds.',
  footerBrand: 'AURELIA GRAND HOTEL',
  footerContact: 'Aurora Bay Road, Goa, India | +91 98765 43210 | stay@aureliagrand.com',
  invoiceHotelName: 'Aurelia Grand Hotel',
  invoiceTitle: 'LUXURY HOSPITALITY INVOICE',
  invoiceFooterNote: 'Thank you for choosing Aurelia Grand Hotel. We look forward to hosting you again.',
  invoiceIssuer: 'Accounts Department, Aurelia Grand Hotel',
  adminMapPinLat: '15.54',
  adminMapPinLng: '73.82',
  adminMapZoom: '12',
  adminMapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=73.75%2C15.45%2C73.95%2C15.65&layer=mapnik&marker=15.54%2C73.82',
};

export const useSiteSettingsStore = create((set, get) => ({
  settings: defaults,
  loaded: false,
  loading: false,
  fetchSettings: async (force = false) => {
    if (!force && get().loaded) return get().settings;
    set({ loading: true });
    try {
      const { data } = await api.get('/site-settings');
      const next = { ...defaults, ...(data.data || {}) };
      set({ settings: next, loaded: true, loading: false });
      return next;
    } catch (_error) {
      set({ loading: false, loaded: true });
      return get().settings;
    }
  },
  setSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),
}));
