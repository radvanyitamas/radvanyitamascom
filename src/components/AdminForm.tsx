import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const projectData = {
      title: formData.get('title'),
      description: formData.get('description'),
      tech_stack: (formData.get('tech') as string).split(','),
      image_url: formData.get('image_url'),
      live_link: formData.get('live_link'),
      category: formData.get('category'),
    };

    const { error } = await supabase.from('projects').insert([projectData]);

    if (error) alert('Hiba történt: ' + error.message);
    else {
        alert('Projekt sikeresen hozzáadva!');
        (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto bg-gray-900 p-8 rounded-2xl border border-gray-800">
      <input name="title" placeholder="Projekt neve" className="p-2 bg-black border border-gray-700 rounded" required />
      <textarea name="description" placeholder="Leírás" className="p-2 bg-black border border-gray-700 rounded" />
      <input name="tech" placeholder="Technológiák (vesszővel elválasztva: React, Astro, Node)" className="p-2 bg-black border border-gray-700 rounded" />
      <input name="image_url" placeholder="Kép URL (vagy Supabase Storage link)" className="p-2 bg-black border border-gray-700 rounded" />
      <input name="live_link" placeholder="Élő weboldal link" className="p-2 bg-black border border-gray-700 rounded" />
      <select name="category" className="p-2 bg-black border border-gray-700 rounded text-white">
        <option value="web">Weboldal</option>
        <option value="mobile">Mobil App</option>
      </select>
      <button type="submit" disabled={loading} className="bg-[#00FFCC] text-black font-bold p-3 rounded-full hover:opacity-80 transition-all">
        {loading ? 'Mentés...' : 'Projekt közzététele'}
      </button>
    </form>
  );
}