import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminGuests = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/admin/guests').then((response) => setRows(response.data.data));
  }, []);

  return (
    <section className="grid gap-6 lg:grid-cols-[200px_1fr] pb-16">
      <AdminSidebar />
      <div>
        <h1 className="font-display text-5xl text-gold">Guests</h1>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gold/30">
          <table className="min-w-full text-sm">
            <thead className="bg-gold/10"><tr><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-left">Total Bookings</th></tr></thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-gold/20"><td className="px-3 py-2">{item.firstName} {item.lastName}</td><td className="px-3 py-2">{item.email}</td><td className="px-3 py-2">{item.bookings?.length || 0}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
