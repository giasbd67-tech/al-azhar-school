import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Copy, UserMinus, Calculator, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const toBn = (n: any) => n.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭八৯"[d] || "০১২৩৪৫৬৭৮৯"[d]);

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('সব শ্রেণী');

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const filteredStudents = students.filter((st: any) => 
    (st.name.includes(search) || st.roll.includes(search)) &&
    (filterClass === 'সব শ্রেণী' || st.class_name === filterClass)
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-['Hind_Siliguri'] text-slate-900 pb-10">
      {/* হেডার */}
      <header className="bg-[#1E40AF] text-white pt-10 pb-12 px-4 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
        <motion.h1 initial={{y:-20}} animate={{y:0}} className="text-3xl md:text-5xl font-black mb-2">
          আল- আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ
        </motion.h1>
        <p className="text-blue-100 text-sm md:text-xl font-medium">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী</p>
      </header>

      <main className="max-w-4xl mx-auto -mt-8 px-4">
        {/* সার্চ ও ফিল্টার বক্স */}
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-blue-50 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" placeholder="নাম বা রোল দিয়ে খুঁজুন..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="py-3 px-4 bg-slate-50 border-0 rounded-2xl outline-none text-[#1E40AF] font-bold"
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option>সব শ্রেণী</option>
            {['প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম'].map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="bg-[#1E40AF] hover:bg-blue-800 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus size={20} /> নতুন ভর্তি
          </button>
        </div>

        {/* লিস্ট হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 text-[#1E40AF] rounded-xl"><Users size={24} /></div>
          <h2 className="text-2xl font-bold">শিক্ষার্থী তালিকা ({toBn(filteredStudents.length)})</h2>
        </div>

        {/* কার্ড লিস্ট */}
        <div className="space-y-4">
          {filteredStudents.map((st: any) => (
            <motion.div 
              initial={{opacity: 0}} animate={{opacity: 1}}
              key={st.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-[#1E40AF] transition-colors">{st.name}</h3>
                  <div className="flex gap-3 mt-1 text-slate-500 font-semibold">
                    <span className="bg-blue-50 text-[#1E40AF] px-3 py-0.5 rounded-full text-sm">শ্রেণী: {st.class_name}</span>
                    <span>রোল: {toBn(st.roll)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">বকেয়া টাকা</span>
                  <p className="text-3xl font-black text-red-600 leading-none mt-1">৳{toBn(st.dues)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <button className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl font-bold text-slate-600 hover:bg-blue-50 hover:text-[#1E40AF] transition-all">
                  <Copy size={18} /> বকেয়া কপি
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  <UserMinus size={18} /> অনুপস্থিতি
                </button>
                <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-2 bg-[#1E40AF] text-white py-3 rounded-2xl font-bold shadow-md shadow-blue-100 hover:scale-105 transition-transform">
                  <Phone size={18} /> কল দিন
                </a>
                <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-2xl font-bold shadow-md shadow-emerald-100 hover:scale-105 transition-transform">
                  <Calculator size={18} /> পেমেন্ট
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ফুটার */}
      <footer className="mt-20 py-12 bg-white border-t border-slate-100 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-[#1E40AF] p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-[#1E40AF] font-black text-2xl">GU</div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">গিয়াস উদ্দিন</p>
            <p className="text-[#1E40AF] font-bold tracking-[0.2em] uppercase text-xs mt-1">অফিসিয়াল অ্যাপ ডেভেলপার</p>
          </div>
          <div className="w-16 h-1 bg-blue-100 rounded-full"></div>
          <p className="text-slate-400 text-sm italic">© ২০২৬ আল- আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</p>
        </div>
      </footer>
    </div>
  );
}
