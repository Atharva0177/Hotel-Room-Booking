import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { acceptTerms: false } });

  const onSubmit = async ({ confirmPassword: _confirmPassword, acceptTerms: _acceptTerms, ...payload }) => {
    await registerUser(payload);
    navigate('/');
  };

  return (
    <section className="mx-auto max-w-lg rounded-xl border border-gold/30 bg-black/20 p-6">
      <h1 className="font-display text-4xl text-gold">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 md:grid-cols-2">
        <input placeholder="First Name" {...register('firstName')} className="rounded border border-gold/30 bg-transparent p-2" />
        <input placeholder="Last Name" {...register('lastName')} className="rounded border border-gold/30 bg-transparent p-2" />
        <input placeholder="Email" {...register('email')} className="rounded border border-gold/30 bg-transparent p-2 md:col-span-2" />
        <input placeholder="Phone" {...register('phone')} className="rounded border border-gold/30 bg-transparent p-2 md:col-span-2" />
        <input type="password" placeholder="Password" {...register('password')} className="rounded border border-gold/30 bg-transparent p-2" />
        <input type="password" placeholder="Confirm Password" {...register('confirmPassword')} className="rounded border border-gold/30 bg-transparent p-2" />
        <label className="md:col-span-2 text-sm"><input type="checkbox" {...register('acceptTerms')} className="mr-2" />I accept Terms & Conditions</label>
        {Object.values(errors).length > 0 && <p className="md:col-span-2 text-xs text-red-400">Please fix form errors.</p>}
        {error && <p className="md:col-span-2 text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="md:col-span-2 rounded border border-gold bg-gold px-4 py-2 font-accent text-auburn">Create Account</button>
      </form>
      <p className="mt-4 text-sm">Already registered? <Link to="/login" className="text-gold">Login</Link></p>
    </section>
  );
};
