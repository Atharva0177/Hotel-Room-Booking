import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { galleryService } from '../../services/galleryService';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { defaultGalleryImages } from '../../constants/contentDefaults';

const getGalleryKey = (item) =>
  `${(item.category || '').trim().toLowerCase()}|${(item.imageUrl || '').trim().toLowerCase()}|${(item.title || '').trim().toLowerCase()}`;

const emptyForm = {
  id: '',
  category: 'Rooms',
  imageUrl: '',
  title: '',
  order: 0,
  isActive: true,
};

const defaultCategories = ['Rooms', 'Pool', 'Restaurant', 'Events', 'Exterior'];

export const AdminGallery = () => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState('');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadGallery = async () => {
    try {
      const response = await galleryService.getAllAdmin();
      const grouped = response.data.data || {};
      const flat = Object.values(grouped).flat();

      if (flat.length === 0) {
        await Promise.all(defaultGalleryImages.map((item) => galleryService.create(item)));
        const seeded = await galleryService.getAllAdmin();
        const seededGrouped = seeded.data.data || {};
        setRows(Object.values(seededGrouped).flat());
        toast.success('Default gallery imported');
      } else {
        const seen = new Set();
        const uniqueRows = [];
        const duplicateRows = [];

        flat.forEach((item) => {
          const key = getGalleryKey(item);
          if (seen.has(key)) {
            duplicateRows.push(item);
          } else {
            seen.add(key);
            uniqueRows.push(item);
          }
        });

        if (duplicateRows.length > 0) {
          await Promise.all(duplicateRows.map((item) => galleryService.delete(item.id)));
        }

        setRows(uniqueRows);
      }

      // Load available categories
      const cats = await galleryService.getCategories();
      setCategories([...new Set([...defaultCategories, ...(cats.data.data || [])])]);
    } catch (_error) {
      toast.error('Failed to load gallery');
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        category: form.category.trim(),
        imageUrl: form.imageUrl.trim(),
        title: form.title.trim() || null,
        order: Number(form.order),
        isActive: Boolean(form.isActive),
      };

      if (!payload.imageUrl) {
        toast.error('Image URL is required');
        setSaving(false);
        return;
      }

      if (isEditing) {
        await galleryService.update(form.id, payload);
        toast.success('Gallery image updated');
      } else {
        await galleryService.create(payload);
        toast.success('Gallery image created');
      }
      setForm(emptyForm);
      await loadGallery();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save gallery image');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (image) => {
    setForm({
      id: image.id,
      category: image.category,
      imageUrl: image.imageUrl,
      title: image.title || '',
      order: image.order,
      isActive: image.isActive,
    });
  };

  const onDelete = async (imageId) => {
    if (!window.confirm('Delete this gallery image?')) return;
    setBusyId(imageId);
    try {
      await galleryService.delete(imageId);
      toast.success('Gallery image deleted');
      await loadGallery();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete gallery image');
    } finally {
      setBusyId('');
    }
  };

  const onToggleActive = async (image) => {
    setBusyId(image.id);
    try {
      await galleryService.update(image.id, { isActive: !image.isActive });
      toast.success(`Image marked ${image.isActive ? 'inactive' : 'active'}`);
      await loadGallery();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update image');
    } finally {
      setBusyId('');
    }
  };

  return (
    <section className="grid gap-2 sm:gap-3 md:gap-6 grid-cols-1 md:grid-cols-[auto_1fr] pb-16 px-2 sm:px-3 md:px-4 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="space-y-2 sm:space-y-3 md:space-y-4 min-w-0">
        <h1 className="font-display text-5xl text-gold">Manage Gallery</h1>
        <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-gold/30 bg-black/20 p-4 md:grid-cols-2">
          <select
            value={form.category}
            onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}
            className="rounded border border-gold/30 bg-auburn px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            value={form.title}
            onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
            placeholder="Image Title (optional)"
            className="rounded border border-gold/30 bg-transparent px-3 py-2"
          />
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((v) => ({ ...v, imageUrl: e.target.value }))}
            placeholder="Image URL"
            required
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
              {saving ? 'Saving...' : isEditing ? 'Update Image' : 'Add Image'}
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
                <th className="px-4 py-3 text-left text-gold">Preview</th>
                <th className="px-4 py-3 text-left text-gold">Category</th>
                <th className="px-4 py-3 text-left text-gold">Title</th>
                <th className="px-4 py-3 text-left text-gold">URL</th>
                <th className="px-4 py-3 text-left text-gold">Order</th>
                <th className="px-4 py-3 text-center text-gold">Status</th>
                <th className="px-4 py-3 text-center text-gold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((image) => (
                <tr key={image.id} className="border-b border-gold/10 hover:bg-gold/5">
                  <td className="px-4 py-3">
                    <img src={image.imageUrl} alt={image.title || 'gallery'} className="h-10 w-10 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium">{image.category}</td>
                  <td className="px-4 py-3 text-sm text-ivory/70">{image.title || '-'}</td>
                  <td className="px-4 py-3 text-sm text-ivory/70 truncate max-w-xs">{image.imageUrl.substring(0, 40)}...</td>
                  <td className="px-4 py-3 text-center">{image.order}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleActive(image)}
                      disabled={busyId === image.id}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        image.isActive
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {image.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <button
                        type="button"
                        onClick={() => onEdit(image)}
                        disabled={busyId === image.id}
                        className="text-gold hover:text-gold/80 transition text-xs rounded px-2 py-1 hover:bg-gold/10 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(image.id)}
                        disabled={busyId === image.id}
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
            <div className="px-4 py-8 text-center text-ivory/50">No gallery images found</div>
          )}
        </div>
      </div>
    </section>
  );
};
