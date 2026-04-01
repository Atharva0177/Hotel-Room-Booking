import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminGuests = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/admin/guests').then((response) => setRows(response.data.data));
  }, []);

  return (
    <section className="grid gap-2 sm:gap-3 md:gap-6 grid-cols-1 md:grid-cols-[auto_1fr] pb-16 px-2 sm:px-3 md:px-4 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="min-w-0">
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gold">Guests</h1>
        <div className="mt-2 sm:mt-3 md:mt-4 overflow-x-auto rounded-lg border border-gold/30">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gold/10"><tr><th className="px-2 sm:px-3 py-2 text-left">Name</th><th className="px-2 sm:px-3 py-2 text-left">Email</th><th className="px-2 sm:px-3 py-2 text-left">Bookings</th></tr></thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-gold/20"><td className="px-2 sm:px-3 py-2">{item.firstName} {item.lastName}</td><td className="px-2 sm:px-3 py-2 truncate">{item.email}</td><td className="px-2 sm:px-3 py-2">{item.bookings?.length || 0}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
