import React, { useState, useEffect } from 'react';
import { Search, Phone, Copy, UserMinus, Calculator, Users, School, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toBn = (n: any) => n?.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]) || "০";

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('সব শ্রেণী');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((st: any) => 
    (st.name.toLowerCase().includes(search.toLowerCase()) || st.roll.includes(search)) &&
    (filterClass === 'সব শ্রেণী' || st.class_name === filterClass)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* হেডার সেকশন */}
      <header className="bg-gradient-to-br from-[#1E40AF] via-[#1e3a8a] to-[#172554] text-white pt-16 pb-24 px-4 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center mb-6">
          <div className="bg-white/10 p-5 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-inner">
            <School size={50} className="text-yellow-400" />
          </div>
        </motion.div>
        
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
          আল-আজহার ইন্টারন্যাশনাল <br className="md:hidden" /> স্কুল এন্ড কলেজ
        </motion.h1>
        <p className="text-blue-100 text-lg md:text-xl font-medium opacity-80 flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-blue-400"></span>
          নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী
          <span className="w-8 h-[1px] bg-blue-400"></span>
        </p>
      </header>

      <main className="max-w-5xl mx-auto -mt-12 px-4">
        {/* ফিল্টার এবং সার্চ কার্ড */}
        <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-2xl border border-blue-100/50 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={22} />
              <input 
                type="text" placeholder="শিক্ষার্থীর নাম বা রোল দিয়ে খুঁজুন..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-lg font-medium"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="flex-1 md:w-48 py-4 px-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-[#1E40AF] font-bold text-lg cursor-pointer"
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option>সব শ্রেণী</option>
                {['প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* স্ট্যাটিস্টিকস ও টাইটেল */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200">
              <Users size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">শিক্ষার্থী তালিকা</h2>
          </div>
          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-slate-600">মোট শিক্ষার্থী:</span>
            <span className="text-blue-700 font-black text-xl">{toBn(filteredStudents.length)}</span>
          </div>
        </div>

        {/* স্টুডেন্ট কার্ড গ্রিড */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredStudents.length > 0 ? filteredStudents.map((st: any) => (
                <motion.div 
                  layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={st.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-4">
                       <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <GraduationCap size={30} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-slate-800 mb-1">{st.name}</h3>
                          <div className="flex gap-2">
                            <span className="bg-blue-50 text-blue-700 px-3 py-0.5 rounded-lg text-xs font-bold border border-blue-100">শ্রেণী: {st.class_name}</span>
                            <span className="bg-slate-50 text-slate-600 px-3 py-0.5 rounded-lg text-xs font-bold border border-slate-100">রোল: {toBn(st.roll)}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">বকেয়া ফি</p>
                      <p className="text-2xl font-black text-red-600 leading-none">৳{toBn(st.dues)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
                    <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                      <Phone size={18} /> কল দিন
                    </a>
                    <button className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 active:scale-95">
                      <Calculator size={18} /> পেমেন্ট
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold text-lg">দুঃখিত, কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ফুটার */}
      <footer className="mt-20 py-10 text-center px-4">
        <div className="max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>
        <p className="text-slate-500 font-bold flex items-center justify-center gap-2">
          ডিজাইন ও ডেভেলপমেন্ট: <span className="text-blue-600">গিয়াস উদ্দিন</span>
        </p>
        <p className="text-slate-400 text-xs mt-2 font-medium">© ২০২৬ আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ | সোনাইমুড়ী, নোয়াখালী</p>
      </footer>
    </div>
  );
}
