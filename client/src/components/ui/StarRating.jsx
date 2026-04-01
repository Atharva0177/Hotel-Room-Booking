export const StarRating = ({ rating = 0 }) => (
  <div aria-label={`Rating ${rating} out of 5`} className="text-gold">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i}>{i < rating ? '★' : '☆'}</span>
    ))}
  </div>
);
