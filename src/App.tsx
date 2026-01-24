import React, { useState, useEffect } from 'react';
import { Search, UserPlus, PhoneCall, Copy, CheckCircle, MessageSquareOff, X, GraduationCap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
const toBn = (n: any) => n.toString().replace(/\d/g, (d:any) => "০১২৩৪৫৬৭৮৯"[d]);

export default function App() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("সব শ্রেণী");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // পেমেন্ট ক্যালকুলেটর স্টেট
  const [pay, setPay] = useState({ prev: 0, monthly: 0, exam: 0, other: 0, otherLabel: "অন্যান্য ফি" });
  const totalPay = pay.prev + pay.monthly + pay.exam + pay.other;

  const classes = ["প্লে", "নার্সারি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "১১দশ", "১২দশ"];

  // ডাটা লোড করার ফাংশন
  const fetchData = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = students.filter(s => 
    (s.name.includes(searchTerm) || s.roll.includes(searchTerm)) &&
    (selectedClass === "সব শ্রেণী" || s.class_name === selectedClass)
  );

  return (
    <div className="min-h-screen pb-24">
      {/* হেডার ডিজাইন */}
      <header className="bg-[#1E40AF] text-white pt-10 pb-20 px-6 rounded-b-[40px] text-center shadow-xl">
        <h1 className="text-2xl font-bold">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
        <p className="text-blue-100 text-xs mt-1 opacity-80">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-10">
        {/* সার্চ ও ফিল্টার বক্স */}
        <div className="bg-white p-4 rounded-3xl shadow-lg flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="নাম বা রোল দিয়ে খুঁজুন..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="bg-slate-50 px-4 py-3 rounded-2xl font-bold text-gray-600 outline-none"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option>সব শ্রেণী</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setShowAddModal(true)} className="bg-[#1E40AF] text-white p-4 rounded-2xl shadow-lg active:scale-90">
              <UserPlus size={20} />
            </button>
          </div>
        </div>

        {/* স্টুডেন্ট কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <motion.div layout key={s.id} className="bg-white p-5 rounded-[30px] border-b-4 border-blue-600 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-lg">
                    {s.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{s.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">রোল: {toBn(s.roll)} | {s.class_name}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black ${s.dues > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  বকেয়া: ৳{toBn(s.dues)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => {navigator.clipboard.writeText(`আসসালামু আলাইকুম, ${s.name}-এর বকেয়া ${s.dues} টাকা।`); alert("কপি হয়েছে!")}} className="text-[11px] font-bold py-2 bg-slate-50 rounded-xl text-gray-600 flex items-center justify-center gap-1"><Copy size={12}/> বকেয়া কপি</button>
                <button onClick={() => setSelectedStudent(s)} className="text-[11px] font-bold py-2 bg-blue-600 rounded-xl text-white flex items-center justify-center gap-1 shadow-md"><CheckCircle size={12}/> পেমেন্ট</button>
                <button onClick={() => {navigator.clipboard.writeText(`আসসালামু আলাইকুম, আজ ${s.name} স্কুলে অনুপস্থিত।`); alert("কপি হয়েছে!")}} className="text-[11px] font-bold py-2 bg-slate-50 rounded-xl text-gray-600 flex items-center justify-center gap-1"><MessageSquareOff size={12}/> অনুপস্থিতি</button>
                <button onClick={() => window.location.href=`tel:${s.phone}`} className="text-[11px] font-bold py-2 bg-green-500 rounded-xl text-white flex items-center justify-center gap-1 shadow-md"><PhoneCall size={12}/> কল করুন</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* পেমেন্ট ক্যালকুলেটর মোডাল */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{y: 50, opacity:0}} animate={{y:0, opacity:1}} className="bg-white w-full max-w-sm rounded-[35px] overflow-hidden shadow-2xl">
              <div className="bg-[#1E40AF] p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">{selectedStudent.name}</h2>
                  <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">মাসিক বেতন ও ফি আদায়</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 bg-white/10 rounded-full"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-500">
                  <div>পিল্ বকেয়া <input type="number" onChange={e => setPay({...pay, prev: +e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl mt-1 text-blue-700 outline-none focus:ring-1 focus:ring-blue-600"/></div>
                  <div>মাসিক বেতন <input type="number" onChange={e => setPay({...pay, monthly: +e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl mt-1 text-blue-700 outline-none focus:ring-1 focus:ring-blue-600"/></div>
                  <div>পরীক্ষা ফি <input type="number" onChange={e => setPay({...pay, exam: +e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl mt-1 text-blue-700 outline-none focus:ring-1 focus:ring-blue-600"/></div>
                  <div onClick={() => {const l = prompt("ফি-এর নাম লিখুন:"); if(l) setPay({...pay, otherLabel: l})}} className="cursor-pointer">{pay.otherLabel} <input type="number" onChange={e => setPay({...pay, other: +e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl mt-1 text-blue-700 outline-none focus:ring-1 focus:ring-blue-600"/></div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl flex justify-between items-center font-bold">
                  <span className="text-gray-600 text-sm">মোট জমা:</span>
                  <span className="text-xl text-blue-700 underline decoration-double">৳{toBn(totalPay)}</span>
                </div>
                <button className="w-full bg-[#1E40AF] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">পেমেন্ট কনফার্ম করুন</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md py-3 text-center border-t">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">অ্যাপ ডেভেলপারঃ <span className="text-[#1E40AF]">গিয়াস উদ্দিন</span></p>
      </footer>
    </div>
  );
}
