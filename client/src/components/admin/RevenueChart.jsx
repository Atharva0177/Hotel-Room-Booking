import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ rows = [] }) => {
  const grouped = rows.reduce((acc, item) => {
    const key = new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (!acc[key]) {
      acc[key] = { date: key, amount: 0, paid: 0, expected: 0 };
    }
    const value = Math.round(item.finalPrice || 0);
    acc[key].amount += value;
    if (item.paymentStatus === 'PAID') {
      acc[key].paid += value;
    } else {
      acc[key].expected += value;
    }
    return acc;
  }, {});

  const data = Object.values(grouped).slice(-30);

  if (!data.length) {
    return (
      <div className="h-80 rounded-xl border border-gold/30 bg-black/20 p-4">
        <div className="flex h-full items-center justify-center text-sm text-ivory/70">
          No revenue data yet. Create bookings to see trend lines.
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 rounded-xl border border-gold/30 bg-black/20 p-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#c9a96e" />
          <YAxis stroke="#c9a96e" />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#c9a96e" strokeWidth={2} dot={false} name="Total" />
          <Line type="monotone" dataKey="paid" stroke="#2dd4bf" strokeWidth={2} dot={false} name="Paid" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
