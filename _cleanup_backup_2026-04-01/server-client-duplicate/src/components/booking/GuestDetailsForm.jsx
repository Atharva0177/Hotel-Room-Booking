export const GuestDetailsForm = ({ register, errors }) => (
  <div className="grid gap-3 md:grid-cols-2">
    <label>
      First Name
      <input {...register('firstName')} className="mt-1 w-full rounded border border-gold/30 bg-transparent p-2" />
      <p className="text-xs text-red-400">{errors.firstName?.message}</p>
    </label>
    <label>
      Last Name
      <input {...register('lastName')} className="mt-1 w-full rounded border border-gold/30 bg-transparent p-2" />
      <p className="text-xs text-red-400">{errors.lastName?.message}</p>
    </label>
    <label>
      Email
      <input {...register('email')} className="mt-1 w-full rounded border border-gold/30 bg-transparent p-2" />
      <p className="text-xs text-red-400">{errors.email?.message}</p>
    </label>
    <label>
      Phone
      <input {...register('phone')} className="mt-1 w-full rounded border border-gold/30 bg-transparent p-2" />
      <p className="text-xs text-red-400">{errors.phone?.message}</p>
    </label>
  </div>
);
