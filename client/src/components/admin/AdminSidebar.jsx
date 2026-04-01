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
  <aside className="w-full md:w-auto rounded-full border border-gold/30 bg-black/20 p-1.5 sm:p-2">
    <div className="flex gap-0.5 sm:gap-1 overflow-x-auto [-webkit-overflow-scrolling:touch]">
    {links.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end
        className={({ isActive }) =>
          `flex-shrink-0 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs uppercase tracking-wider transition whitespace-nowrap ${
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
