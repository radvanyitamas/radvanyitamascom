import React, { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) setStatus('success');
    else setStatus('error');
  }

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-4xl mx-auto glass-card p-12 rounded-[3rem] relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-menta/20 blur-3xl rounded-full"></div>
        
        {status === 'success' ? (
          <div className="text-center py-20">
            <h3 className="text-4xl font-bold text-white mb-4">🚀 Üzenet elküldve!</h3>
            <p className="text-slate-400 text-xl">Hamarosan kereslek a megadott e-mail címen.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-4xl font-bold mb-8">Indítsuk el a <span className="text-menta">növekedést</span>.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="name" type="text" placeholder="Neved" required className="bg-black/50 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-brand-blue transition-all" />
              <input name="email" type="email" placeholder="E-mail címed" required className="bg-black/50 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-brand-blue transition-all" />
            </div>
            <textarea name="message" placeholder="Miben segíthetek?" rows={5} required className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-brand-blue transition-all resize-none"></textarea>
            <button type="submit" disabled={status === 'loading'} className="w-full py-5 bg-brand-blue text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
              {status === 'loading' ? 'Küldés...' : 'Ingyenes Stratégiai Hívás Kérése'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}