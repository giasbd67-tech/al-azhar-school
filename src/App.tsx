import React, { useState, useEffect } from 'react';
import { Search, Phone, Users, School, GraduationCap, Plus, X, Trash2, Edit3, UserCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toBn = (n: any) => n?.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]) || "০";

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', class_name: '১ম', roll: '', phone: '', dues: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch('/api')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/${editingId}` : '/api';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setShowForm(false);
    setEditingId(null);
    fetchData();
    setFormData({ name: '', class_name: '১ম', roll: '', phone: '', dues: '' });
  };

  const handleEdit = (st: any) => {
    setEditingId(st.id);
    setFormData({ name: st.name, class_name: st.class_name, roll: st.roll, phone: st.phone, dues: st.dues });
    setShowForm(true);
  };

  const deleteStudent = async (id: number) => {
    if(window.confirm('আপনি কি নিশ্চিত যে এই শিক্ষার্থীকে ডিলিট করতে চান?')) {
      await fetch(`/api/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* হেডার */}
      <header className="bg-gradient-to-br from-[#1E40AF] to-[#1e3a8a] text-white pt-16 pb-24 px-4 text-center shadow-xl">
        <motion.div initial={{scale:0}} animate={{scale:1}} className="flex justify-center mb-4">
          <div className="bg-white/10 p-5 rounded-[2rem] backdrop-blur-md border border-white/20">
            <School size={48} className="text-yellow-400" />
          </div>
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black mb-3">আল-আজহার স্কুল এন্ড কলেজ</h1>
        <p className="text-blue-100 opacity-80 font-medium">নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী</p>
      </header>

      <main className="max-w-5xl mx-auto -mt-12 px-4">
        {/* সার্চ এবং ভর্তি বাটন */}
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl border border-blue-100 flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text" placeholder="নাম বা রোল দিয়ে শিক্ষার্থী খুঁজুন..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={22} /> নতুন ভর্তি
          </button>
        </div>

        {/* শিক্ষার্থী তালিকা */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {students.filter((s:any) => s.name.includes(search) || s.roll.includes(search)).map((st: any) => (
                <motion.div 
                  layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={st.id} className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all relative group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <UserCircle size={40} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(st)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"><Edit3 size={20} /></button>
                      <button onClick={() => deleteStudent(st.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 mb-1">{st.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold border border-blue-100">শ্রেণী: {st.class_name}</span>
                    <span className="bg-slate-50 text-slate-600 px-4 py-1 rounded-full text-xs font-bold border border-slate-100">রোল: {toBn(st.roll)}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl mb-6">
                    <span className="text-red-600 font-bold">বকেয়া ফি:</span>
                    <span className="text-2xl font-black text-red-600 leading-none">৳{toBn(st.dues)}</span>
                  </div>

                  <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    <Phone size={18} /> কল দিন
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ভর্তি ও সংশোধন ফরম পপআপ */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-md rounded-[2.8rem] p-8 relative shadow-2xl">
                <button onClick={() => {setShowForm(false); setEditingId(null);}} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><X size={24} /></button>
                <h2 className="text-2xl font-black mb-8 text-blue-900 flex items-center gap-3">
                  {editingId ? <Edit3 className="text-blue-600" /> : <Plus className="text-blue-600" />}
                  {editingId ? 'তথ্য সংশোধন' : 'শিক্ষার্থী ভর্তি ফরম'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-2 uppercase">শিক্ষার্থীর নাম</label>
                    <input required value={formData.name} placeholder="পুরো নাম লিখুন" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20" onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 ml-2 uppercase">শ্রেণী</label>
                      <select value={formData.class_name} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setFormData({...formData, class_name: e.target.value})}>
                        {['প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 ml-2 uppercase">রোল</label>
                      <input required value={formData.roll} type="number" placeholder="রোল" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setFormData({...formData, roll: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-2 uppercase">ফোন নম্বর</label>
                    <input required value={formData.phone} placeholder="০১৮XXXXXXXX" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-2 uppercase text-red-400">বকেয়া টাকা (টাকায়)</label>
                    <input required value={formData.dues} type="number" placeholder="৳ ০.০০" className="w-full p-4 bg-red-50 rounded-2xl outline-none font-black text-red-600" onChange={e => setFormData({...formData, dues: e.target.value})} />
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                    <Save size={20} /> {editingId ? 'আপডেট করুন' : 'ভর্তি সম্পন্ন করুন'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
