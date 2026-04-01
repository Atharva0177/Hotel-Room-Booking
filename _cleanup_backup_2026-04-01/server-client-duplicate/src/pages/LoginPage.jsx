import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (payload) => {
    await login(payload);
    navigate(location.state?.from || '/');
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-gold/30 bg-black/20 p-6">
      <h1 className="font-display text-4xl text-gold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <label className="block">Email<input {...register('email')} className="mt-1 w-full rounded border border-gold/30 bg-transparent p-2" /></label>
        <p className="text-xs text-red-400">{errors.email?.message}</p>
        <label className="block">Password<input type="password" {...register('password')} className="mt-1 w-full rounded border border-gold/30 bg-transparent p-2" /></label>
        <p className="text-xs text-red-400">{errors.password?.message}</p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="w-full rounded border border-gold bg-gold px-4 py-2 font-accent text-auburn">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link to="/register" className="text-gold">Register</Link></p>
    </section>
  );
};
