const statusOptions = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

export const BookingsTable = ({ rows = [], busyId, onStatusChange, onCancel, onDelete, onDownloadInvoice }) => (
  <div className="overflow-x-auto rounded-xl border border-gold/30">
    <table className="min-w-full text-sm">
      <thead className="bg-gold/10 text-left">
        <tr>
          <th className="px-3 py-2">Code</th>
          <th className="px-3 py-2">Guest</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Payment</th>
          <th className="px-3 py-2">Amount</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-t border-gold/20">
            <td className="px-3 py-2">{row.bookingCode}</td>
            <td className="px-3 py-2">{row.guestName}</td>
            <td className="px-3 py-2">
              <select
                value={row.status}
                disabled={busyId === row.id}
                onChange={(e) => onStatusChange(row.id, e.target.value)}
                className="rounded border border-gold/30 bg-auburn px-2 py-1"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2">{row.paymentStatus}</td>
            <td className="px-3 py-2">₹{Math.round(row.finalPrice)}</td>
            <td className="px-3 py-2">
              <div className="flex flex-col gap-1">
                <button onClick={() => onCancel(row.id)} disabled={busyId === row.id || row.status === 'CANCELLED'} className="rounded border border-gold/40 px-2 py-1 text-xs whitespace-nowrap hover:bg-gold/10 transition disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={() => onDownloadInvoice(row)} disabled={busyId === row.id} className="rounded border border-gold/40 px-2 py-1 text-xs whitespace-nowrap hover:bg-gold/10 transition disabled:opacity-50">
                  Invoice
                </button>
                <button onClick={() => onDelete(row.id)} disabled={busyId === row.id} className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-300 whitespace-nowrap hover:bg-red-500/10 transition disabled:opacity-50">
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
