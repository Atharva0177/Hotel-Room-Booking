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
    <form onSubmit={onSubmit} className="-mt-6 sm:-mt-8 rounded-lg sm:rounded-2xl bg-gradient-to-br from-auburn via-auburn/95 to-auburn/90 p-2.5 sm:p-4 shadow-2xl border border-gold/20 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Row 1: Check-in & Check-out */}
        <div>
          <label className="flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Calendar size={11} className="sm:w-3 sm:h-3" /> Check In
          </label>
          <input
            type="date"
            value={values.checkIn}
            onChange={(e) => setValues((v) => ({ ...v, checkIn: e.target.value }))}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 rounded text-[11px] sm:text-xs bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Calendar size={11} className="sm:w-3 sm:h-3" /> Check Out
          </label>
          <input
            type="date"
            value={values.checkOut}
            onChange={(e) => setValues((v) => ({ ...v, checkOut: e.target.value }))}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 rounded text-[11px] sm:text-xs bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          />
        </div>

        {/* Row 2: Adults & Children */}
        <div>
          <label className="flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Users size={11} className="sm:w-3 sm:h-3" /> Adults
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={values.adults}
            onChange={(e) => setValues((v) => ({ ...v, adults: e.target.value }))}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 rounded text-[11px] sm:text-xs bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-center"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Users size={11} className="sm:w-3 sm:h-3" /> Children
          </label>
          <input
            type="number"
            min="0"
            max="5"
            value={values.children}
            onChange={(e) => setValues((v) => ({ ...v, children: e.target.value }))}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 rounded text-[11px] sm:text-xs bg-white/10 border border-gold/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-center"
          />
        </div>

        {/* Row 3: Room Type & Search Button */}
        <div>
          <label className="flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-gold/80 mb-1">
            <Home size={11} className="sm:w-3 sm:h-3" /> Room Type
          </label>
          <select
            value={values.type}
            onChange={(e) => setValues((v) => ({ ...v, type: e.target.value }))}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 rounded text-[11px] sm:text-xs bg-white/10 border border-gold/40 text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(212,175,55,0.8)' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.4rem center',
              backgroundSize: '1em 1em',
              paddingRight: '1.5rem',
            }}
          >
            <option value="ALL">All Rooms</option>
            <option value="STANDARD">Standard</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
            <option value="PRESIDENTIAL">Presidential</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-gold to-gold/90 hover:from-gold/95 hover:to-gold text-auburn font-accent font-bold uppercase rounded transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-gold/50"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};
