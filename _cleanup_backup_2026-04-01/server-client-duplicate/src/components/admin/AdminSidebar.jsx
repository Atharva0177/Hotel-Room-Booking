import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/rooms', label: 'Rooms' },
  { to: '/admin/guests', label: 'Guests' },
  { to: '/admin/amenities', label: 'Amenities' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/about', label: 'About' },
  { to: '/admin/settings', label: 'Settings' },
];

export const AdminSidebar = () => (
  <aside className="self-start rounded-xl border border-gold/30 bg-black/20 p-3 md:p-4">
    <div className="flex gap-2 overflow-x-auto md:block md:overflow-visible">
    {links.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end
        className={({ isActive }) =>
          `mb-0 mr-1 block shrink-0 rounded px-3 py-2 text-sm uppercase tracking-wider transition md:mb-1 md:mr-0 ${
            isActive
              ? 'bg-gold/20 text-gold'
              : 'text-ivory/80 hover:bg-gold/10 hover:text-gold'
          }`
        }
      >
        {item.label}
      </NavLink>
    ))}
    </div>
  </aside>
);
