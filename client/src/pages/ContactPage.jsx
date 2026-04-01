import { useState } from 'react';
import { api } from '../services/api';

export const ContactPage = () => {
  const [status, setStatus] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    await api.post('/contact', payload);
    event.currentTarget.reset();
    setStatus('Message sent successfully');
  };

  return (
    <section className="space-y-6 pb-16">
      <div className="premium-panel rounded-3xl border border-gold/25 p-6 md:p-8">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Let Us Assist</p>
        <h1 className="font-display text-5xl text-gold">Contact</h1>
        <p className="mt-3 max-w-3xl text-ivory/80">Reach our concierge team for reservations, special requests, and tailored experiences.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="premium-panel rounded-2xl border border-gold/30 p-5">
          <p className="text-ivory/85">Aurora Bay Road, Goa, India</p>
          <p className="mt-1 text-ivory/85">+91 98765 43210</p>
          <p className="mt-1 text-ivory/85">stay@aureliagrand.com</p>
          <iframe className="mt-4 h-72 w-full rounded-xl border border-gold/30" loading="lazy" src="https://maps.google.com/maps?q=goa&t=&z=11&ie=UTF8&iwloc=&output=embed" title="Hotel map" />
        </article>
        <form onSubmit={onSubmit} className="premium-panel rounded-2xl border border-gold/30 p-5">
          <input name="name" required placeholder="Name" className="mb-3 w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10" />
          <input name="email" required type="email" placeholder="Email" className="mb-3 w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10" />
          <input name="subject" required placeholder="Subject" className="mb-3 w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10" />
          <textarea name="message" required placeholder="Message" rows="6" className="mb-3 w-full rounded-lg border border-gold/30 bg-white/5 p-2.5 outline-none transition focus:border-gold/70 focus:bg-white/10" />
          <button className="rounded-lg border border-gold bg-gold px-5 py-2.5 font-accent text-auburn transition hover:brightness-105">Send Message</button>
          {status && <p className="mt-2 text-sm text-green-300">{status}</p>}
        </form>
      </div>
    </section>
  );
};
