import { useMemo, useState } from 'react';
import { toINR } from '../../utils/priceUtils';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toDateOnly = (value) => {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const buildDays = (from, to) => {
  const start = toDateOnly(from);
  const end = toDateOnly(to);
  const days = [];
  for (let cursor = start.getTime(); cursor <= end.getTime(); cursor += MS_PER_DAY) {
    days.push(new Date(cursor));
  }
  return days;
};

const isOccupiedOnDay = (booking, day) => {
  const dayStart = toDateOnly(day).getTime();
  const dayEnd = dayStart + MS_PER_DAY;
  const checkIn = new Date(booking.checkIn).getTime();
  const checkOut = new Date(booking.checkOut).getTime();
  return checkIn < dayEnd && checkOut > dayStart;
};

const getUnitsForDay = (room, day) => {
  const active = (room.bookings || []).filter((booking) => isOccupiedOnDay(booking, day));
  const usedUnits = active.reduce((sum, booking) => sum + (booking.roomsBooked || 1), 0);
  const totalUnits = Math.max(1, room.inventoryCount || 1);
  const emptyUnits = Math.max(0, totalUnits - usedUnits);
  return { usedUnits, emptyUnits, totalUnits, active };
};

export const BookingCalendarGrid = ({ calendar }) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const days = useMemo(() => {
    if (!calendar?.from || !calendar?.to) return [];
    return buildDays(calendar.from, calendar.to);
  }, [calendar]);

  if (!calendar) {
    return <div className="rounded-xl border border-gold/30 bg-black/20 p-4 text-sm text-ivory/70">Loading calendar...</div>;
  }

  return (
    <div className="space-y-3 rounded-xl border border-gold/30 bg-black/20 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gold">Booking Calendar Occupancy</h3>
        <p className="text-xs text-ivory/70">Date-grid view ({days.length} days)</p>
      </div>
      <p className="text-xs text-ivory/70">Each cell shows room units in use vs empty for that date.</p>

      {calendar.conflicts?.length > 0 && (
        <div className="rounded border border-red-400/40 bg-red-900/20 p-3 text-sm text-red-200">
          <p className="font-medium">Conflicts detected:</p>
          {calendar.conflicts.map((item) => (
            <p key={`${item.roomId}-${item.bookingA}-${item.bookingB}`}>
              {item.roomName}: {item.bookingA} overlaps {item.bookingB}
            </p>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-[980px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border border-gold/20 bg-auburn px-2 py-2 text-left">Room</th>
              {days.map((day) => (
                <th key={day.toISOString()} className="border border-gold/20 px-2 py-2 text-center">
                  {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.rooms?.map((room) => (
              <tr key={room.id}>
                <td className="sticky left-0 z-10 border border-gold/20 bg-auburn/95 px-2 py-2 font-medium">{room.name}</td>
                {days.map((day) => {
                  const { usedUnits, emptyUnits, totalUnits, active } = getUnitsForDay(room, day);
                  const hasConflict = usedUnits > totalUnits;
                  const isFullyBooked = usedUnits >= totalUnits;
                  const isPartiallyUsed = usedUnits > 0 && usedUnits < totalUnits;
                  const title =
                    active.length > 0
                      ? `${active.map((booking) => `${booking.bookingCode} (${booking.guestName}) - ${booking.roomsBooked || 1} unit(s)`).join('\n')}\nUsed ${usedUnits}/${totalUnits}, Empty ${emptyUnits}`
                      : `Used 0/${totalUnits}, Empty ${totalUnits}`;

                  const canOpenDetails = active.length > 0;

                  return (
                    <td
                      key={`${room.id}-${day.toISOString()}`}
                      title={title}
                      onClick={() => {
                        if (!canOpenDetails) return;
                        setSelectedCell({
                          roomName: room.name,
                          day,
                          usedUnits,
                          emptyUnits,
                          totalUnits,
                          bookings: active,
                        });
                      }}
                      className={`border border-gold/20 px-2 py-2 text-center ${
                        hasConflict
                          ? 'bg-red-900/50 text-red-100'
                          : isFullyBooked
                            ? 'bg-gold/30 text-ivory'
                            : isPartiallyUsed
                              ? 'bg-amber-900/35 text-amber-100'
                              : 'bg-emerald-900/20 text-emerald-200'
                      } ${canOpenDetails ? 'cursor-pointer transition hover:brightness-110' : ''}`}
                    >
                      {hasConflict ? (
                        '!'
                      ) : (
                        <div className="leading-tight">
                          <div>{isFullyBooked ? 'Booked' : isPartiallyUsed ? 'Used' : 'Open'}</div>
                          <div className="text-[10px] opacity-90">U:{usedUnits} E:{emptyUnits}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedCell(null)}>
          <div className="w-full max-w-4xl rounded-xl border border-gold/40 bg-auburn p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-display text-3xl text-gold">Booking Details</h4>
                <p className="mt-1 text-sm text-ivory/80">
                  {selectedCell.roomName} • {selectedCell.day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-ivory/70">
                  Used {selectedCell.usedUnits} of {selectedCell.totalUnits} units • Empty {selectedCell.emptyUnits}
                </p>
              </div>
              <button className="rounded border border-gold/40 px-2 py-1 text-xs text-gold" onClick={() => setSelectedCell(null)}>
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {selectedCell.bookings.map((booking) => (
                <article key={booking.id} className="rounded-lg border border-gold/25 bg-black/25 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ivory">{booking.bookingCode}</p>
                    <p className="text-xs uppercase tracking-wide text-gold">{booking.status}</p>
                  </div>
                  <p className="mt-1 text-ivory/85">{booking.guestName}</p>
                  <p className="text-xs text-ivory/70">{booking.guestEmail} • {booking.guestPhone}</p>
                  <div className="mt-2 grid gap-2 text-xs text-ivory/75 sm:grid-cols-3">
                    <p>Guests: {booking.adults}A + {booking.children}C</p>
                    <p>Units: {booking.roomsBooked || 1}</p>
                    <p>Amount: {toINR(booking.finalPrice || 0)}</p>
                  </div>
                  <p className="mt-2 text-xs text-ivory/70">
                    {new Date(booking.checkIn).toDateString()} → {new Date(booking.checkOut).toDateString()}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
