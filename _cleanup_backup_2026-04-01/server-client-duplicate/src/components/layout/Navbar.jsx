import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings } = useSiteSettingsStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-auburn/85 shadow-lg backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-ivory md:px-8">
        <Link to="/" className="font-display text-2xl tracking-wide text-gold">
          {settings.navbarBrand}
        </Link>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>

        <div className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col border-b border-gold/20 bg-auburn/95 p-4 backdrop-blur-xl md:static md:flex md:w-auto md:flex-row md:border-b-0 md:bg-transparent md:p-0 md:backdrop-blur-0`}>
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium uppercase tracking-widest transition ${
                  isActive ? 'text-gold' : 'text-ivory/80 hover:text-gold'
                }`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/profile" className="px-3 py-2 text-sm uppercase tracking-widest text-ivory/80 hover:text-gold">
                Profile
              </NavLink>
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" className="px-3 py-2 text-sm uppercase tracking-widest text-ivory/80 hover:text-gold">
                  Admin
                </NavLink>
              )}
              <button onClick={logout} className="px-3 py-2 text-left text-sm uppercase tracking-widest text-ivory/80 hover:text-gold">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="px-3 py-2 text-sm uppercase tracking-widest text-gold">
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};
