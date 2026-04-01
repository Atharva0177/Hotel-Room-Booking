import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { StatsCard } from '../../components/admin/StatsCard';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { BookingCalendarGrid } from '../../components/admin/BookingCalendarGrid';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const AdminDashboard = () => {
  const { settings, fetchSettings } = useSiteSettingsStore();
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [calendar, setCalendar] = useState(null);
  const [calendarRange, setCalendarRange] = useState(() => {
    const start = new Date();
    const end = new Date(start.getTime() + 13 * 24 * 60 * 60 * 1000);
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
    };
  });

  const loadCalendar = () => {
    adminService.getBookingCalendar(calendarRange).then((response) => setCalendar(response.data.data));
  };

  useEffect(() => {
    fetchSettings();
    adminService.getStats().then((response) => setStats(response.data.data));
    adminService.getRevenue().then((response) => setRevenue(response.data.data));
    adminService.listBookings().then((response) => {
      setRecentBookings((response.data.data || []).slice(0, 6));
    });
    loadCalendar();
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [calendarRange.from, calendarRange.to]);

  const mapEmbedUrl = (() => {
    const lat = Number(settings.adminMapPinLat);
    const lng = Number(settings.adminMapPinLng);
    const zoom = Number(settings.adminMapZoom || 12);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return settings.adminMapEmbedUrl;
    }

    const span = Math.max(0.01, 1.2 / Math.max(1, zoom));
    const left = (lng - span).toFixed(6);
    const bottom = (lat - span).toFixed(6);
    const right = (lng + span).toFixed(6);
    const top = (lat + span).toFixed(6);
    const markerLat = lat.toFixed(6);
    const markerLng = lng.toFixed(6);

    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${markerLat}%2C${markerLng}`;
  })();

  return (
    <section className="grid gap-6 lg:grid-cols-[200px_1fr] pb-16">
      <AdminSidebar />
      <div className="space-y-4">
        <h1 className="font-display text-5xl text-gold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Total Bookings" value={stats?.totalBookings || 0} />
          <StatsCard label="Revenue" value={`₹${Math.round(stats?.totalRevenue || 0)}`} />
          <StatsCard label="Guests" value={stats?.totalGuests || 0} />
          <StatsCard label="Occupancy" value={`${Math.round(stats?.occupancyRate || 0)}%`} />
        </div>
        <RevenueChart rows={revenue} />
        <div className="overflow-hidden rounded-xl border border-gold/30 bg-black/20">
          <div className="border-b border-gold/20 px-4 py-3 text-lg font-medium text-gold">Property Map</div>
          <iframe
            src={mapEmbedUrl}
            title="Property Map"
            className="h-72 w-full"
            loading="lazy"
          />
        </div>
        <div className="grid gap-3 rounded-xl border border-gold/30 bg-black/20 p-4 md:grid-cols-3">
          <label className="text-sm text-ivory/80">
            From
            <input
              type="date"
              value={calendarRange.from}
              onChange={(e) => setCalendarRange((v) => ({ ...v, from: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-2 py-2"
            />
          </label>
          <label className="text-sm text-ivory/80">
            To
            <input
              type="date"
              value={calendarRange.to}
              onChange={(e) => setCalendarRange((v) => ({ ...v, to: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-2 py-2"
            />
          </label>
          <div className="flex items-end">
            <button onClick={loadCalendar} className="rounded border border-gold bg-gold px-4 py-2 text-auburn">
              Refresh Calendar
            </button>
          </div>
        </div>
        <BookingCalendarGrid calendar={calendar} />
        <div className="overflow-x-auto rounded-xl border border-gold/30 bg-black/20">
          <div className="border-b border-gold/20 px-4 py-3 text-lg font-medium text-gold">Recent Bookings</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-ivory/70">
                <th className="px-4 py-2">Booking Code</th>
                <th className="px-4 py-2">Guest</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-gold/20">
                  <td className="px-4 py-2">{booking.bookingCode}</td>
                  <td className="px-4 py-2">{booking.guestName}</td>
                  <td className="px-4 py-2">{booking.status}</td>
                  <td className="px-4 py-2">₹{Math.round(booking.finalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
