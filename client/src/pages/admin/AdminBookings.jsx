import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { BookingsTable } from '../../components/admin/BookingsTable';

export const AdminBookings = () => {
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadBookings = async () => {
    try {
      const response = await adminService.listBookings();
      setRows(response.data.data || []);
    } catch (_error) {
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onStatusChange = async (bookingId, status) => {
    setBusyId(bookingId);
    try {
      await adminService.updateBookingStatus(bookingId, status);
      toast.success('Booking updated');
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    } finally {
      setBusyId('');
    }
  };

  const onCancel = async (bookingId) => {
    setBusyId(bookingId);
    try {
      await adminService.cancelBooking(bookingId);
      toast.success('Booking cancelled');
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setBusyId('');
    }
  };

  const onDelete = async (bookingId) => {
    if (!window.confirm('Permanently delete this booking record?')) return;
    setBusyId(bookingId);
    try {
      await adminService.deleteBooking(bookingId);
      toast.success('Booking removed permanently');
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete booking');
    } finally {
      setBusyId('');
    }
  };

  const onDownloadInvoice = async (row) => {
    setBusyId(row.id);
    try {
      const response = await adminService.downloadInvoice(row.id);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `invoice-${row.bookingCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download invoice');
    } finally {
      setBusyId('');
    }
  };

  const filteredRows = statusFilter === 'ALL' ? rows : rows.filter((row) => row.status === statusFilter);

  return (
    <section className="grid gap-2 sm:gap-3 md:gap-6 grid-cols-1 md:grid-cols-[auto_1fr] pb-16 px-2 sm:px-3 md:px-4 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="min-w-0">
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gold">Manage Bookings</h1>
        <div className="mt-2 sm:mt-3 md:mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-ivory/70">Filter Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border border-gold/30 bg-auburn px-2 py-1 text-xs sm:text-sm">
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CHECKED_IN">CHECKED_IN</option>
            <option value="CHECKED_OUT">CHECKED_OUT</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="mt-4">
          <BookingsTable rows={filteredRows} busyId={busyId} onStatusChange={onStatusChange} onCancel={onCancel} onDelete={onDelete} onDownloadInvoice={onDownloadInvoice} />
        </div>
      </div>
    </section>
  );
};
