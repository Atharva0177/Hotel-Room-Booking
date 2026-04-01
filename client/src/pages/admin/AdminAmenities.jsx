import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { amenitieService } from '../../services/amenitiesService';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { defaultAmenities } from '../../constants/contentDefaults';

const getAmenityKey = (item) =>
  `${(item.title || '').trim().toLowerCase()}|${(item.hours || '').trim().toLowerCase()}|${(item.description || '').trim().toLowerCase()}`;

const emptyForm = {
  id: '',
  title: '',
  description: '',
  hours: '',
  imageUrl: '',
  order: 0,
  isActive: true,
};

export const AdminAmenities = () => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadAmenities = async () => {
    try {
      const response = await amenitieService.getAllAdmin();
      const rowsData = response.data.data || [];

      if (rowsData.length === 0) {
        await Promise.all(defaultAmenities.map((item) => amenitieService.create(item)));
        const seeded = await amenitieService.getAllAdmin();
        setRows(seeded.data.data || []);
        toast.success('Default amenities imported');
        return;
      }

      const seen = new Set();
      const uniqueRows = [];
      const duplicateRows = [];

      rowsData.forEach((item) => {
        const key = getAmenityKey(item);
        if (seen.has(key)) {
          duplicateRows.push(item);
        } else {
          seen.add(key);
          uniqueRows.push(item);
        }
      });

      if (duplicateRows.length > 0) {
        await Promise.all(duplicateRows.map((item) => amenitieService.delete(item.id)));
      }

      setRows(uniqueRows);
    } catch (_error) {
      toast.error('Failed to load amenities');
    }
  };

  useEffect(() => {
    loadAmenities();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        hours: form.hours.trim(),
        imageUrl: form.imageUrl.trim() || null,
        order: Number(form.order),
        isActive: Boolean(form.isActive),
      };

      if (isEditing) {
        await amenitieService.update(form.id, payload);
        toast.success('Amenity updated');
      } else {
        await amenitieService.create(payload);
        toast.success('Amenity created');
      }
      setForm(emptyForm);
      await loadAmenities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save amenity');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (amenity) => {
    setForm({
      id: amenity.id,
      title: amenity.title,
      description: amenity.description,
      hours: amenity.hours,
      imageUrl: amenity.imageUrl || '',
      order: amenity.order,
      isActive: amenity.isActive,
    });
  };

  const onDelete = async (amenityId) => {
    if (!window.confirm('Delete this amenity?')) return;
    setBusyId(amenityId);
    try {
      await amenitieService.delete(amenityId);
      toast.success('Amenity deleted');
      await loadAmenities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete amenity');
    } finally {
      setBusyId('');
    }
  };

  const onToggleActive = async (amenity) => {
    setBusyId(amenity.id);
    try {
      await amenitieService.update(amenity.id, { isActive: !amenity.isActive });
      toast.success(`Amenity marked ${amenity.isActive ? 'inactive' : 'active'}`);
      await loadAmenities();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update amenity');
    } finally {
      setBusyId('');
    }
  };

  return (
    <section className="grid gap-2 sm:gap-3 md:gap-6 grid-cols-1 md:grid-cols-[auto_1fr] pb-16 px-2 sm:px-3 md:px-4 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="space-y-2 sm:space-y-3 md:space-y-4 min-w-0">
        <h1 className="font-display text-5xl text-gold">Manage Amenities</h1>
        <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-gold/30 bg-black/20 p-4 md:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
            placeholder="Amenity Title (e.g., Pool, Spa)"
            required
            className="rounded border border-gold/30 bg-transparent px-3 py-2"
          />
          <input
            value={form.hours}
            onChange={(e) => setForm((v) => ({ ...v, hours: e.target.value }))}
            placeholder="Hours (e.g., 6:00 AM - 10:00 PM)"
            className="rounded border border-gold/30 bg-transparent px-3 py-2"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
            placeholder="Description"
            required
            rows={3}
            className="rounded border border-gold/30 bg-transparent px-3 py-2 md:col-span-2"
          />
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((v) => ({ ...v, imageUrl: e.target.value }))}
            placeholder="Image URL"
            className="rounded border border-gold/30 bg-transparent px-3 py-2 md:col-span-2"
          />
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((v) => ({ ...v, order: e.target.value }))}
            placeholder="Display Order"
            className="rounded border border-gold/30 bg-transparent px-3 py-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((v) => ({ ...v, isActive: e.target.checked }))}
            />
            Active
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button disabled={saving} className="rounded border border-gold bg-gold px-4 py-2 font-accent text-auburn">
              {saving ? 'Saving...' : isEditing ? 'Update Amenity' : 'Create Amenity'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => setForm(emptyForm)} className="rounded border border-gold/40 px-4 py-2">
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-gold/30 bg-black/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="px-4 py-3 text-left text-gold">Title</th>
                <th className="px-4 py-3 text-left text-gold">Hours</th>
                <th className="px-4 py-3 text-left text-gold">Description</th>
                <th className="px-4 py-3 text-left text-gold">Order</th>
                <th className="px-4 py-3 text-center text-gold">Status</th>
                <th className="px-4 py-3 text-center text-gold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((amenity) => (
                <tr key={amenity.id} className="border-b border-gold/10 hover:bg-gold/5">
                  <td className="px-4 py-3 font-medium">{amenity.title}</td>
                  <td className="px-4 py-3 text-sm text-ivory/70">{amenity.hours || '-'}</td>
                  <td className="px-4 py-3 text-sm text-ivory/70">{amenity.description.substring(0, 50)}...</td>
                  <td className="px-4 py-3 text-center">{amenity.order}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleActive(amenity)}
                      disabled={busyId === amenity.id}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        amenity.isActive
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {amenity.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <button
                        type="button"
                        onClick={() => onEdit(amenity)}
                        disabled={busyId === amenity.id}
                        className="text-gold hover:text-gold/80 transition text-xs rounded px-2 py-1 hover:bg-gold/10 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(amenity.id)}
                        disabled={busyId === amenity.id}
                        className="text-red-400 hover:text-red-300 transition text-xs rounded px-2 py-1 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="px-4 py-8 text-center text-ivory/50">No amenities found</div>
          )}
        </div>
      </div>
    </section>
  );
};
