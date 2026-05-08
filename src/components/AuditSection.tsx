import React, { useState } from 'react';

export default function AuditSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const startAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 2500);
  };

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-[3rem] text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ingyenes Sebesség Audit</h2>
        <p className="mb-10 text-slate-400">Tudd meg, hány vásárlót veszítesz a lassú weboldalad miatt.</p>
        
        {!result ? (
          <form onSubmit={startAudit} className="flex flex-col md:flex-row gap-4">
            <input 
              type="url" 
              placeholder="https://teoldalad.hu" 
              required
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-blue"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-4 bg-brand-blue text-white font-bold rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Elemzés folyamatban...' : 'Audit indítása'}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <div className="text-sm uppercase mb-2">Jelenlegi állapot</div>
              <div className="text-5xl font-bold text-red-500 mb-2">34/100</div>
              <p className="text-xs">Lassú betöltés, magas lemorzsolódás.</p>
            </div>
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
              <div className="text-sm uppercase mb-2">Astro 6 Optimalizált</div>
              <div className="text-5xl font-bold text-green-500 mb-2">99/100</div>
              <p className="text-xs">Azonnali válasz, maximális konverzió.</p>
            </div>
            <button onClick={() => setResult(false)} className="md:col-span-2 text-brand-light underline">Új elemzés</button>
          </div>
        )}
      </div>
    </section>
  );
}