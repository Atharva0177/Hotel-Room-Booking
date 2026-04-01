import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { RoomsTable } from '../../components/admin/RoomsTable';

const emptyForm = {
  id: '',
  name: '',
  type: 'STANDARD',
  description: '',
  longDesc: '',
  pricePerNight: 5000,
  maxGuests: 2,
  inventoryCount: 1,
  bedType: 'King Bed',
  size: 300,
  floor: 1,
  viewType: 'City',
  images: '',
  amenities: '',
  signatureExperiences: '',
  checkInTime: 'From 3:00 PM',
  checkOutTime: 'Until 11:00 AM',
  cancellationPolicy: 'Free up to 48 hours before arrival',
  paymentPolicy: 'Pay securely at the property front desk',
  guestAssurancePoints: '',
  isFeatured: false,
  isAvailable: true,
};

export const AdminRooms = () => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [busyId, setBusyId] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadRooms = async () => {
    try {
      const response = await adminService.listRooms();
      setRows(response.data.data.rooms || []);
    } catch (_error) {
      toast.error('Failed to load rooms');
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const toPayload = () => ({
    name: form.name.trim(),
    type: form.type,
    description: form.description.trim(),
    longDesc: form.longDesc.trim(),
    pricePerNight: Number(form.pricePerNight),
    maxGuests: Number(form.maxGuests),
    inventoryCount: Number(form.inventoryCount),
    bedType: form.bedType.trim(),
    size: Number(form.size),
    floor: Number(form.floor),
    viewType: form.viewType.trim(),
    images: form.images
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    amenities: form.amenities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    signatureExperiences: form.signatureExperiences
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, description] = line.split('|').map((part) => part?.trim());
        return [title, description].filter(Boolean).join('|');
      })
      .filter((line) => line.includes('|')),
    checkInTime: form.checkInTime.trim(),
    checkOutTime: form.checkOutTime.trim(),
    cancellationPolicy: form.cancellationPolicy.trim(),
    paymentPolicy: form.paymentPolicy.trim(),
    guestAssurancePoints: form.guestAssurancePoints
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    isFeatured: Boolean(form.isFeatured),
    isAvailable: Boolean(form.isAvailable),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload();
      if (isEditing) {
        await adminService.updateRoom(form.id, payload);
        toast.success('Room updated');
      } else {
        await adminService.createRoom(payload);
        toast.success('Room created');
      }
      setForm(emptyForm);
      await loadRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (room) => {
    setForm({
      id: room.id,
      name: room.name,
      type: room.type,
      description: room.description,
      longDesc: room.longDesc,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      inventoryCount: room.inventoryCount || 1,
      bedType: room.bedType,
      size: room.size,
      floor: room.floor,
      viewType: room.viewType,
      images: (room.images || []).join(', '),
      amenities: (room.amenities || []).join(', '),
      signatureExperiences: (room.signatureExperiences || []).join('\n'),
      checkInTime: room.checkInTime || 'From 3:00 PM',
      checkOutTime: room.checkOutTime || 'Until 11:00 AM',
      cancellationPolicy: room.cancellationPolicy || 'Free up to 48 hours before arrival',
      paymentPolicy: room.paymentPolicy || 'Pay securely at the property front desk',
      guestAssurancePoints: (room.guestAssurancePoints || []).join('\n'),
      isFeatured: room.isFeatured,
      isAvailable: room.isAvailable,
    });
  };

  const onDelete = async (roomId) => {
    if (!window.confirm('Delete this room? Existing bookings linked to this room may fail.')) return;
    setBusyId(roomId);
    try {
      await adminService.deleteRoom(roomId);
      toast.success('Room deleted');
      await loadRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    } finally {
      setBusyId('');
    }
  };

  const onQuickToggleAvailability = async (room) => {
    setBusyId(room.id);
    try {
      await adminService.updateRoom(room.id, { isAvailable: !room.isAvailable });
      toast.success(`Room marked ${room.isAvailable ? 'unavailable' : 'available'}`);
      await loadRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update room');
    } finally {
      setBusyId('');
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[200px_1fr] pb-16">
      <AdminSidebar />
      <div className="space-y-5">
        <h1 className="font-display text-5xl text-gold">Manage Rooms</h1>
        <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-gold/30 bg-black/20 p-4 md:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Room Name" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <select value={form.type} onChange={(e) => setForm((v) => ({ ...v, type: e.target.value }))} className="rounded border border-gold/30 bg-auburn px-3 py-2">
            <option value="STANDARD">STANDARD</option>
            <option value="DELUXE">DELUXE</option>
            <option value="SUITE">SUITE</option>
            <option value="PRESIDENTIAL">PRESIDENTIAL</option>
          </select>
          <input value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Short Description" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.longDesc} onChange={(e) => setForm((v) => ({ ...v, longDesc: e.target.value }))} placeholder="Long Description" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input type="number" min="1" value={form.pricePerNight} onChange={(e) => setForm((v) => ({ ...v, pricePerNight: e.target.value }))} placeholder="Price Per Night" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input type="number" min="1" value={form.maxGuests} onChange={(e) => setForm((v) => ({ ...v, maxGuests: e.target.value }))} placeholder="Max Guests" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input type="number" min="1" value={form.inventoryCount} onChange={(e) => setForm((v) => ({ ...v, inventoryCount: e.target.value }))} placeholder="Units Available" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.bedType} onChange={(e) => setForm((v) => ({ ...v, bedType: e.target.value }))} placeholder="Bed Type" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input type="number" min="1" value={form.size} onChange={(e) => setForm((v) => ({ ...v, size: e.target.value }))} placeholder="Size (sq ft)" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input type="number" value={form.floor} onChange={(e) => setForm((v) => ({ ...v, floor: e.target.value }))} placeholder="Floor" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.viewType} onChange={(e) => setForm((v) => ({ ...v, viewType: e.target.value }))} placeholder="View Type" required className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.images} onChange={(e) => setForm((v) => ({ ...v, images: e.target.value }))} placeholder="Images (comma separated URLs)" className="rounded border border-gold/30 bg-transparent px-3 py-2 md:col-span-2" />
          <input value={form.amenities} onChange={(e) => setForm((v) => ({ ...v, amenities: e.target.value }))} placeholder="Amenities (comma separated)" className="rounded border border-gold/30 bg-transparent px-3 py-2 md:col-span-2" />
          <textarea value={form.signatureExperiences} onChange={(e) => setForm((v) => ({ ...v, signatureExperiences: e.target.value }))} placeholder="Signature Experiences (one per line, format: Title | Description)" rows={4} className="rounded border border-gold/30 bg-transparent px-3 py-2 md:col-span-2" />
          <input value={form.checkInTime} onChange={(e) => setForm((v) => ({ ...v, checkInTime: e.target.value }))} placeholder="Check-in Time" className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.checkOutTime} onChange={(e) => setForm((v) => ({ ...v, checkOutTime: e.target.value }))} placeholder="Check-out Time" className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.cancellationPolicy} onChange={(e) => setForm((v) => ({ ...v, cancellationPolicy: e.target.value }))} placeholder="Cancellation Policy" className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <input value={form.paymentPolicy} onChange={(e) => setForm((v) => ({ ...v, paymentPolicy: e.target.value }))} placeholder="Payment Policy" className="rounded border border-gold/30 bg-transparent px-3 py-2" />
          <textarea value={form.guestAssurancePoints} onChange={(e) => setForm((v) => ({ ...v, guestAssurancePoints: e.target.value }))} placeholder="Guest Assurance Points (one per line)" rows={3} className="rounded border border-gold/30 bg-transparent px-3 py-2 md:col-span-2" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((v) => ({ ...v, isFeatured: e.target.checked }))} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((v) => ({ ...v, isAvailable: e.target.checked }))} /> Available</label>
          <div className="flex gap-2 md:col-span-2">
            <button disabled={saving} className="rounded border border-gold bg-gold px-4 py-2 font-accent text-auburn">{saving ? 'Saving...' : isEditing ? 'Update Room' : 'Create Room'}</button>
            {isEditing && <button type="button" onClick={() => setForm(emptyForm)} className="rounded border border-gold/40 px-4 py-2">Cancel Edit</button>}
          </div>
        </form>
        <div className="mt-4">
          <RoomsTable rows={rows} busyId={busyId} onEdit={onEdit} onDelete={onDelete} onQuickToggleAvailability={onQuickToggleAvailability} />
        </div>
      </div>
    </section>
  );
};
