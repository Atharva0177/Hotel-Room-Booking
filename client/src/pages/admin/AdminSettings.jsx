import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const AdminSettings = () => {
  const { settings, setSettings, fetchSettings } = useSiteSettingsStore();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings().then((fetched) => setForm(fetched));
  }, [fetchSettings]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await adminService.updateSiteSettings(form);
      setSettings(response.data.data || form);
      toast.success('Site settings updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[200px_1fr] pb-16">
      <AdminSidebar />
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-gold/30 bg-black/20 p-6">
        <h1 className="font-display text-5xl text-gold">Settings</h1>
        <label className="block text-sm text-ivory/80">
          Navbar Brand
          <input
            value={form.navbarBrand || ''}
            onChange={(e) => setForm((v) => ({ ...v, navbarBrand: e.target.value }))}
            className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
          />
        </label>

        <label className="block text-sm text-ivory/80">
          Hero Title (Title Screen Name)
          <input
            value={form.heroTitle || ''}
            onChange={(e) => setForm((v) => ({ ...v, heroTitle: e.target.value }))}
            className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
          />
        </label>

        <label className="block text-sm text-ivory/80">
          Hero Subtitle
          <textarea
            rows={3}
            value={form.heroSubtitle || ''}
            onChange={(e) => setForm((v) => ({ ...v, heroSubtitle: e.target.value }))}
            className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
          />
        </label>

        <label className="block text-sm text-ivory/80">
          Footer Brand
          <input
            value={form.footerBrand || ''}
            onChange={(e) => setForm((v) => ({ ...v, footerBrand: e.target.value }))}
            className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
          />
        </label>

        <label className="block text-sm text-ivory/80">
          Footer Contact Line
          <input
            value={form.footerContact || ''}
            onChange={(e) => setForm((v) => ({ ...v, footerContact: e.target.value }))}
            className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
          />
        </label>

        <div className="rounded-lg border border-gold/20 bg-black/20 p-4">
          <h2 className="font-display text-2xl text-gold">Invoice Settings</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block text-sm text-ivory/80">
              Invoice Hotel Name
              <input
                value={form.invoiceHotelName || ''}
                onChange={(e) => setForm((v) => ({ ...v, invoiceHotelName: e.target.value }))}
                className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              />
            </label>
            <label className="block text-sm text-ivory/80">
              Invoice Title
              <input
                value={form.invoiceTitle || ''}
                onChange={(e) => setForm((v) => ({ ...v, invoiceTitle: e.target.value }))}
                className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              />
            </label>
            <label className="block text-sm text-ivory/80 md:col-span-2">
              Invoice Footer Note
              <textarea
                rows={2}
                value={form.invoiceFooterNote || ''}
                onChange={(e) => setForm((v) => ({ ...v, invoiceFooterNote: e.target.value }))}
                className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              />
            </label>
            <label className="block text-sm text-ivory/80 md:col-span-2">
              Invoice Issuer Signature Line
              <input
                value={form.invoiceIssuer || ''}
                onChange={(e) => setForm((v) => ({ ...v, invoiceIssuer: e.target.value }))}
                className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              />
            </label>
          </div>
        </div>

        <label className="block text-sm text-ivory/80">
          Admin Dashboard Map Embed URL
          <input
            value={form.adminMapEmbedUrl || ''}
            onChange={(e) => setForm((v) => ({ ...v, adminMapEmbedUrl: e.target.value }))}
            className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm text-ivory/80">
            Map Pin Latitude
            <input
              value={form.adminMapPinLat || ''}
              onChange={(e) => setForm((v) => ({ ...v, adminMapPinLat: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              placeholder="15.54"
            />
          </label>
          <label className="block text-sm text-ivory/80">
            Map Pin Longitude
            <input
              value={form.adminMapPinLng || ''}
              onChange={(e) => setForm((v) => ({ ...v, adminMapPinLng: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              placeholder="73.82"
            />
          </label>
          <label className="block text-sm text-ivory/80">
            Map Zoom
            <input
              value={form.adminMapZoom || ''}
              onChange={(e) => setForm((v) => ({ ...v, adminMapZoom: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-3 py-2"
              placeholder="12"
            />
          </label>
        </div>

        <button disabled={saving} className="rounded border border-gold bg-gold px-4 py-2 font-accent text-auburn">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </section>
  );
};
