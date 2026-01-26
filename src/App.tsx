import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Copy, UserMinus, Calculator, Users, School } from 'lucide-react';
import { motion } from 'framer-motion';

const toBn = (n: any) => n.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]);

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
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-10">
      {/* হেডার */}
      <header className="bg-gradient-to-b from-[#1E40AF] to-[#1e3a8a] text-white pt-12 pb-16 px-4 text-center shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400"></div>
        <motion.div initial={{scale:0.8}} animate={{scale:1}} className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                <School size={48} className="text-yellow-400" />
            </div>
        </motion.div>
        <motion.h1 initial={{y:-20}} animate={{y:0}} className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
          আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ
        </motion.h1>
        <p className="text-blue-100 text-sm md:text-xl font-medium opacity-90">নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী</p>
      </header>

      <main className="max-w-4xl mx-auto -mt-10 px-4">
        {/* সার্চ বক্স */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-blue-100/50 flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-4 text-slate-400" size={22} />
            <input 
              type="text" placeholder="শিক্ষার্থীর নাম বা রোল..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-lg"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="py-4 px-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-[#1E40AF] font-bold text-lg"
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option>সব শ্রেণী</option>
            {['প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* লিস্ট হেডার */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200"><Users size={26} /></div>
            <h2 className="text-2xl font-black text-slate-800">শিক্ষার্থী তালিকা</h2>
          </div>
          <div className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-bold">
            মোট: {toBn(filteredStudents.length)} জন
          </div>
        </div>

        {/* কার্ড লিস্ট */}
        <div className="space-y-6">
          {filteredStudents.length > 0 ? filteredStudents.map((st: any) => (
            <motion.div 
              initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
              key={st.id} className="bg-white p-7 rounded-[2.5rem] shadow-md border border-slate-100 hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-blue-700 transition-colors">{st.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 font-bold">
                    <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm">শ্রেণী: {st.class_name}</span>
                    <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-sm">রোল: {toBn(st.roll)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">বকেয়া ফি</span>
                  <p className="text-3xl font-black text-red-600 leading-none mt-1">৳{toBn(st.dues)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                <button className="flex items-center justify-center gap-2 bg-slate-50 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all active:scale-95">
                  <Copy size={18} /> রিসিট
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-50 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95">
                  <UserMinus size={18} /> রিপোর্ট
                </button>
                <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                  <Phone size={18} /> কল দিন
                </a>
                <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
                  <Calculator size={18} /> পেমেন্ট
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold">কোন শিক্ষার্থী পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 py-10 text-center">
        <p className="text-slate-400 font-bold">ডেভেলপার: গিয়াস উদ্দিন</p>
        <p className="text-slate-300 text-xs mt-1">© ২০২৬ আল- আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</p>
      </footer>
    </div>
  );
}
