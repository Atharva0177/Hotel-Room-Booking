export const RoomsTable = ({ rows = [], busyId, onEdit, onDelete, onQuickToggleAvailability }) => (
  <div className="overflow-x-auto rounded-xl border border-gold/30">
    <table className="min-w-full text-sm">
      <thead className="bg-gold/10 text-left">
        <tr>
          <th className="px-3 py-2">Name</th>
          <th className="px-3 py-2">Type</th>
          <th className="px-3 py-2">Price</th>
          <th className="px-3 py-2">Units</th>
          <th className="px-3 py-2">Availability</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-t border-gold/20">
            <td className="px-3 py-2">{row.name}</td>
            <td className="px-3 py-2">{row.type}</td>
            <td className="px-3 py-2">₹{Math.round(row.pricePerNight)}</td>
            <td className="px-3 py-2">{row.inventoryCount || 1}</td>
            <td className="px-3 py-2">{row.isAvailable ? 'Available' : 'Unavailable'}</td>
            <td className="px-3 py-2">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onEdit(row)} className="rounded border border-gold/40 px-2 py-1 text-xs">Edit</button>
                <button onClick={() => onQuickToggleAvailability(row)} disabled={busyId === row.id} className="rounded border border-gold/40 px-2 py-1 text-xs">
                  {busyId === row.id ? 'Saving...' : row.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button onClick={() => onDelete(row.id)} disabled={busyId === row.id} className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-300">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
