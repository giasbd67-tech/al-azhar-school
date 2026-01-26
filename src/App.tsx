import React, { useState, useEffect } from 'react';
import { Search, Phone, UserMinus, Users, School, GraduationCap, Plus, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toBn = (n: any) => n?.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]) || "০";

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('সব শ্রেণী');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', class_name: 'প্লে', roll: '', phone: '', dues: '' });

  useEffect(() => {
    fetchData();
  }, []);

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
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowForm(false);
    fetchData();
    setFormData({ name: '', class_name: 'প্লে', roll: '', phone: '', dues: '' });
  };

  const deleteStudent = async (id: number) => {
    if(confirm('আপনি কি নিশ্চিত যে এই শিক্ষার্থীকে ডিলিট করতে চান?')) {
      await fetch(`/api/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const filteredStudents = students.filter((st: any) => 
    (st.name.toLowerCase().includes(search.toLowerCase()) || st.roll.includes(search)) &&
    (filterClass === 'সব শ্রেণী' || st.class_name === filterClass)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* হেডার */}
      <header className="bg-gradient-to-br from-[#1E40AF] to-[#172554] text-white pt-12 pb-20 px-4 text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <School size={40} className="text-yellow-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-2">আল-আজহার স্কুল এন্ড কলেজ</h1>
        <p className="opacity-80">নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী</p>
      </header>

      <main className="max-w-5xl mx-auto -mt-10 px-4">
        {/* সার্চ ও নতুন ভর্তি বাটন */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-blue-100 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-4 text-slate-400" size={20} />
            <input 
              type="text" placeholder="নাম বা রোল..." 
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
          >
            <Plus size={20} /> নতুন ভর্তি
          </button>
        </div>

        {/* শিক্ষার্থী তালিকা */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredStudents.map((st: any) => (
              <motion.div 
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                key={st.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all relative"
              >
                <button 
                  onClick={() => deleteStudent(st.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{st.name}</h3>
                    <p className="text-sm text-slate-500 font-bold">শ্রেণী: {st.class_name} | রোল: {toBn(st.roll)}</p>
                    <p className="text-sm text-red-500 font-black mt-1 uppercase tracking-tighter">বকেয়া: ৳{toBn(st.dues)}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-700 transition-all">
                    <Phone size={18} /> যোগাযোগ
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ভর্তি ফরম পপআপ */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
              <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              <h2 className="text-2xl font-black mb-6 text-blue-900">শিক্ষার্থী ভর্তি ফরম</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="শিক্ষার্থীর নাম" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-blue-100 focus:ring-2" onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-4 bg-slate-50 rounded-xl outline-none" onChange={e => setFormData({...formData, class_name: e.target.value})}>
                    {['প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input required placeholder="রোল" type="number" className="p-4 bg-slate-50 rounded-xl outline-none" onChange={e => setFormData({...formData, roll: e.target.value})} />
                </div>
                <input required placeholder="ফোন নম্বর" className="w-full p-4 bg-slate-50 rounded-xl outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input required placeholder="বকেয়া টাকা" type="number" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold text-red-600" onChange={e => setFormData({...formData, dues: e.target.value})} />
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200">ভর্তি সম্পন্ন করুন</button>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
