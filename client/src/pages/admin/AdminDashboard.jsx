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
    <section className="grid gap-2 sm:gap-3 md:gap-6 grid-cols-1 md:grid-cols-[auto_1fr] pb-16 px-2 sm:px-3 md:px-4 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="space-y-2 sm:space-y-3 md:space-y-6 min-w-0">
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gold">Admin Dashboard</h1>
        <div className="grid gap-1.5 sm:gap-2 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Total Bookings" value={stats?.totalBookings || 0} />
          <StatsCard label="Revenue" value={`₹${Math.round(stats?.totalRevenue || 0)}`} />
          <StatsCard label="Guests" value={stats?.totalGuests || 0} />
          <StatsCard label="Occupancy" value={`${Math.round(stats?.occupancyRate || 0)}%`} />
        </div>
        <RevenueChart rows={revenue} />
        <div className="overflow-hidden rounded-xl border border-gold/30 bg-black/20">
          <div className="border-b border-gold/20 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg font-medium text-gold">Property Map</div>
          <iframe
            src={mapEmbedUrl}
            title="Property Map"
            className="h-48 sm:h-60 md:h-72 w-full"
            loading="lazy"
          />
        </div>
        <div className="grid gap-2 sm:gap-3 rounded-xl border border-gold/30 bg-black/20 p-2 sm:p-3 md:p-4 grid-cols-2 md:grid-cols-3">
          <label className="text-xs sm:text-sm text-ivory/80">
            From
            <input
              type="date"
              value={calendarRange.from}
              onChange={(e) => setCalendarRange((v) => ({ ...v, from: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-2 py-1 sm:py-2 text-xs sm:text-sm"
            />
          </label>
          <label className="text-xs sm:text-sm text-ivory/80">
            To
            <input
              type="date"
              value={calendarRange.to}
              onChange={(e) => setCalendarRange((v) => ({ ...v, to: e.target.value }))}
              className="mt-1 block w-full rounded border border-gold/30 bg-transparent px-2 py-1 sm:py-2 text-xs sm:text-sm"
            />
          </label>
          <div className="col-span-2 md:col-span-1 flex items-end">
            <button onClick={loadCalendar} className="w-full rounded border border-gold bg-gold px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-auburn font-semibold">
              Refresh
            </button>
          </div>
        </div>
        <BookingCalendarGrid calendar={calendar} />
        <div className="overflow-x-auto rounded-xl border border-gold/30 bg-black/20">
          <div className="border-b border-gold/20 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-lg font-medium text-gold">Recent Bookings</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-ivory/70 bg-black/30">
                  <th className="px-2 sm:px-4 py-2">Code</th>
                  <th className="px-2 sm:px-4 py-2">Guest</th>
                  <th className="px-2 sm:px-4 py-2">Status</th>
                  <th className="px-2 sm:px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gold/20 hover:bg-gold/5">
                    <td className="px-2 sm:px-4 py-2">{booking.bookingCode}</td>
                    <td className="px-2 sm:px-4 py-2">{booking.guestName}</td>
                    <td className="px-2 sm:px-4 py-2">{booking.status}</td>
                    <td className="px-2 sm:px-4 py-2">₹{Math.round(booking.finalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
