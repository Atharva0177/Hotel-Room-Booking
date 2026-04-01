import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Home } from 'lucide-react';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    type: 'ALL',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(values);
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="-mt-6 sm:-mt-8 rounded-lg sm:rounded-2xl bg-gradient-to-br from-auburn via-auburn/95 to-auburn/90 p-3 sm:p-4 shadow-2xl border border-gold/20 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-6">
        {/* Check-in Date */}
        <div className="lg:col-span-1">
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> Check In
          </label>
          <input
            type="date"
            value={values.checkIn}
            onChange={(e) => setValues((v) => ({ ...v, checkIn: e.target.value }))}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          />
        </div>

        {/* Check-out Date */}
        <div className="lg:col-span-1">
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> Check Out
          </label>
          <input
            type="date"
            value={values.checkOut}
            onChange={(e) => setValues((v) => ({ ...v, checkOut: e.target.value }))}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          />
        </div>

        {/* Guests */}
        <div className="lg:col-span-1">
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Users size={12} className="sm:w-3.5 sm:h-3.5" /> Adults
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={values.adults}
            onChange={(e) => setValues((v) => ({ ...v, adults: e.target.value }))}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-center"
          />
        </div>

        {/* Children */}
        <div className="lg:col-span-1">
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Users size={12} className="sm:w-3.5 sm:h-3.5" /> Children
          </label>
          <input
            type="number"
            min="0"
            max="5"
            value={values.children}
            onChange={(e) => setValues((v) => ({ ...v, children: e.target.value }))}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-center"
          />
        </div>

        {/* Room Type */}
        <div className="lg:col-span-1">
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Home size={12} className="sm:w-3.5 sm:h-3.5" /> Room Type
          </label>
          <select
            value={values.type}
            onChange={(e) => setValues((v) => ({ ...v, type: e.target.value }))}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm bg-white/10 border border-gold/40 text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(212,175,55,0.8)' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.2em 1.2em',
              paddingRight: '2rem',
            }}
          >
            <option value="ALL">All Room Types</option>
            <option value="STANDARD">Standard</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
            <option value="PRESIDENTIAL">Presidential</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1 flex items-end">
          <button
            type="submit"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs bg-gradient-to-r from-gold to-gold/90 hover:from-gold/95 hover:to-gold text-auburn font-accent font-bold uppercase rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-gold/50"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};
