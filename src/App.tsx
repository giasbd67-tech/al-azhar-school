import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Copy, UserMinus, Calculator, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ইংরেজি থেকে বাংলা সংখ্যায় রূপান্তর
const toBn = (n: any) => n.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]);

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('সব শ্রেণী');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ডাটা লোড করা
  useEffect(() => {
    fetch('/api').then(res => res.json()).then(setStudents);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-['Hind_Siliguri'] text-slate-800 pb-20">
      {/* হেডার - রয়্যাল ব্লু থিম (#1E40AF) */}
      <header className="bg-[#1E40AF] text-white p-6 text-center shadow-xl border-b-4 border-yellow-400">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">আল- আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
        <p className="text-sm md:text-lg mt-1 opacity-90">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী</p>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* সার্চ ও ফিল্টার */}
        <div className="flex flex-col md:flex-row gap-3 my-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" placeholder="নাম বা রোল দিয়ে খুঁজুন..." 
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E40AF] outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="p-2.5 border rounded-xl bg-white outline-none" onChange={(e) => setFilterClass(e.target.value)}>
            <option>সব শ্রেণী</option>
            {['প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', '১১দশ', '১২দশ'].map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#1E40AF] text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-lg active:scale-95">
            <Plus size={20} /> নতুন ভর্তি
          </button>
        </div>

        {/* শিক্ষার্থী তালিকা */}
        <div className="space-y-4">
          <h2 className="font-bold text-xl flex items-center gap-2 mb-4">
            <div className="w-2 h-7 bg-[#1E40AF] rounded-full"></div>
            শিক্ষার্থী তালিকা ({toBn(students.length)})
          </h2>

          {students.map((st: any) => (
            <motion.div 
              layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              key={st.id} className="bg-white p-5 rounded-2xl shadow-md border-l-[6px] border-[#1E40AF] relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1E40AF]">{st.name}</h3>
                  <p className="text-slate-500 font-medium">শ্রেণী: {st.class_name} | রোল: {toBn(st.roll)}</p>
                </div>
                <div className="bg-red-50 p-2 rounded-xl text-right border border-red-100">
                  <p className="text-[10px] text-red-400 uppercase font-bold">মোট বকেয়া</p>
                  <p className="text-xl font-black text-red-600 leading-none">৳{toBn(st.dues)}</p>
                </div>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button className="flex items-center justify-center gap-1.5 bg-slate-100 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:text-blue-700 transition">
                  <Copy size={16} /> বকেয়া কপি
                </button>
                <button className="flex items-center justify-center gap-1.5 bg-slate-100 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition">
                  <UserMinus size={16} /> অনুপস্থিতি
                </button>
                <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-md shadow-green-100">
                  <Phone size={16} /> কল দিন
                </a>
                <button className="flex items-center justify-center gap-1.5 bg-[#1E40AF] text-white py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-100">
                  <Calculator size={16} /> পেমেন্ট
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ফুটার */}
      <footer className="mt-12 p-10 bg-white border-t border-slate-200 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full border-4 border-[#1E40AF] p-1 shadow-xl">
             <img src="https://i.ibb.co/h74nF6T/dev.jpg" alt="Developer" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <p className="font-black text-xl text-slate-700">গিয়াস উদ্দিন</p>
            <p className="text-[#1E40AF] font-bold text-sm tracking-widest">অ্যাপ ডেভেলপার</p>
          </div>
          <div className="h-px w-20 bg-slate-200 my-2"></div>
          <p className="text-xs text-slate-400">© ২০২৬ আল- আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</p>
        </div>
      </footer>
    </div>
  );
}
