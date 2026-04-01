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
  <aside className="w-full rounded-full border border-gold/30 bg-black/20 p-2 sm:p-2.5">
    <div className="flex gap-1 sm:gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch]">
    {links.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end
        className={({ isActive }) =>
          `flex-shrink-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm uppercase tracking-wider transition whitespace-nowrap ${
            isActive
              ? 'bg-gold/20 text-gold font-semibold'
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
