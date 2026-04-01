export const PaymentForm = ({ amount, onPay, loading }) => (
  <div className="rounded-xl border border-gold/30 bg-black/20 p-4">
    <p className="text-sm text-ivory/80">Use test card: 4242 4242 4242 4242</p>
    <button onClick={onPay} disabled={loading} className="mt-3 rounded border border-gold bg-gold px-4 py-2 font-accent text-auburn">
      {loading ? 'Processing...' : `Pay ₹${Math.round(amount)}`}
    </button>
  </div>
);
