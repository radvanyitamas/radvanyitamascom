import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form állapotok
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web App');
  const [techStack, setTechStack] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  }

  const resetForm = () => {
    setTitle(''); setDescription(''); setCategory('Web App');
    setTechStack(''); setLiveLink(''); setImageFile(null);
    setEditingId(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setTechStack(p.tech_stack.join(', '));
    setLiveLink(p.live_link || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm('Biztosan törölni akarod ezt a projektet?')) return;

    // 1. Kép törlése a Storage-ból
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('project-images').remove([fileName]);
      }
    }

    // 2. Sor törlése az adatbázisból
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = projects.find(p => p.id === editingId)?.image_url || '';

    // Kép feltöltése, ha van új fájl
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData } = await supabase.storage.from('project-images').upload(fileName, imageFile);
      
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }
    }

    const projectData = {
      title,
      description,
      category,
      live_link: liveLink,
      tech_stack: techStack.split(',').map(t => t.trim()).filter(t => t !== ""),
      image_url: finalImageUrl
    };

    if (editingId) {
      await supabase.from('projects').update(projectData).eq('id', editingId);
    } else {
      await supabase.from('projects').insert([projectData]);
    }

    setLoading(false);
    resetForm();
    fetchProjects();
  };

  return (
    <div className="space-y-12">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-4xl border border-gray-800 space-y-6">
        <h2 className="text-2xl font-bold text-white">{editingId ? 'Projekt szerkesztése' : 'Új projekt hozzáadása'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Projekt címe" value={title} onChange={e => setTitle(e.target.value)} required className="bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-[#00FFCC] outline-none" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-[#00FFCC] outline-none">
            <option value="Web App">Web App</option>
            <option value="Mobil App">Mobil App</option>
            <option value="Egyedi Rendszer">Egyedi Rendszer</option>
          </select>
        </div>

        <textarea placeholder="Leírás" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-[#00FFCC] outline-none h-32" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Tech Stack (pl: React, Astro)" value={techStack} onChange={e => setTechStack(e.target.value)} className="bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-[#00FFCC] outline-none" />
          <input type="url" placeholder="Élő link" value={liveLink} onChange={e => setLiveLink(e.target.value)} className="bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-[#00FFCC] outline-none" />
        </div>

        <div className="bg-black border border-dashed border-gray-700 rounded-xl p-6 text-center">
          <label className="cursor-pointer">
            <span className="text-gray-400 block mb-2">{imageFile ? `Kijelölve: ${imageFile.name}` : 'Kép feltöltése (Kattints ide)'}</span>
            <input id="file-upload" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#00FFCC] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all">
            {loading ? 'Folyamatban...' : editingId ? 'Módosítások mentése' : 'Projekt közzététele'}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="px-6 py-4 border border-gray-700 text-white rounded-xl">Mégse</button>}
        </div>
      </form>

      {/* LISTA */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white px-2">Kezelés ({projects.length})</h2>
        <div className="grid grid-cols-1 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-card border border-gray-800 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={p.image_url} className="w-16 h-16 object-cover rounded-lg bg-gray-900" alt="" />
                <div>
                  <h3 className="font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">Szerkesztés</button>
                <button onClick={() => handleDelete(p.id, p.image_url)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">Törlés</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}