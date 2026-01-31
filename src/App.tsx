import React, { useState, useEffect } from 'react';
import { Search, Phone, School, Plus, X, Trash2, Edit3, UserCircle, Save, Filter, Copy, Banknote, MessageSquareWarning, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toBn = (n: any) => n?.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]) || "০";
const CLASSES = ['সব শ্রেণী', 'প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ'];

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('সব শ্রেণী');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialForm = { 
    name: '', father_name: '', class_name: '১ম', roll: '', phone: '', gender: 'ছাত্র', address: '',
    monthly_fee: 0, exam_fee: 0, other_fee: 0, previous_dues: 0, dues: 0 
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const total = Number(formData.monthly_fee) + Number(formData.exam_fee) + Number(formData.other_fee) + Number(formData.previous_dues);
    setFormData(prev => ({ ...prev, dues: total }));
  }, [formData.monthly_fee, formData.exam_fee, formData.other_fee, formData.previous_dues]);

  const fetchData = () => {
    fetch('/api').then(res => res.json()).then(data => {
      setStudents(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    await fetch(editingId ? `/api/${editingId}` : '/api', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    closeForm();
    fetchData();
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/payment/${selectedStudent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(paymentAmount) })
    });
    setShowPaymentModal(false);
    setPaymentAmount('');
    fetchData();
    alert('টাকা জমা হয়েছে!');
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData(initialForm); };

  const copyDueMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${toBn(st.dues)} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('বকেয়া মেসেজ কপি হয়েছে!');
  };

  const copyAbsentMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ।`;
    navigator.clipboard.writeText(msg);
    alert('অনুপস্থিতি মেসেজ কপি হয়েছে!');
  };

  const filtered = students.filter((st: any) => 
    (st.name.toLowerCase().includes(search.toLowerCase()) || st.roll.includes(search)) && 
    (filterClass === 'সব শ্রেণী' || st.class_name === filterClass)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Premium Header with Logo */}
      <header className="bg-gradient-to-b from-blue-800 to-blue-700 text-white pt-10 pb-24 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative inline-block"
        >
          {/* লোগোর পেছনের গ্লো ইফেক্ট */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          
          <div className="relative bg-white p-1.5 rounded-full shadow-2xl mb-4 border-2 border-blue-400/30">
            <img 
              src="/logo.png" 
              alt="School Logo" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-black tracking-tight drop-shadow-md">
          আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ
        </h1>
        <div className="inline-block px-4 py-1 mt-2 bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-400/20">
          <p className="text-[11px] font-medium opacity-90 tracking-wide text-blue-50">
             ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto -mt-12 px-4 relative z-10">
        {/* Search & Filter Section */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-3 mb-8 border border-white/50">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input placeholder="নাম বা রোল দিয়ে খুঁজুন..." className="w-full pl-11 p-3.5 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition-all" onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="p-3.5 bg-slate-100 rounded-2xl outline-none font-bold text-slate-600 cursor-pointer" onChange={e => setFilterClass(e.target.value)}>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={20}/> নতুন ভর্তি
          </button>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((st: any) => (
            <motion.div layout key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex justify-between mb-4">
                <div className={`p-3 rounded-2xl ${st.gender === 'ছাত্রী' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                   <UserCircle size={28} />
                </div>
                <div className="flex gap-2">
                  <Edit3 size={18} className="text-slate-300 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => { setEditingId(st.id); setFormData(st); setShowForm(true); }} />
                  <Trash2 size={18} className="text-slate-300 cursor-pointer hover:text-red-500 transition-colors" onClick={async () => { if(confirm('ডিলিট করবেন?')) { await fetch(`/api/${st.id}`, {method:'DELETE'}); fetchData(); } }} />
                </div>
              </div>
              <h3 className="font-black text-xl text-slate-800 leading-tight">{st.name}</h3>
              <p className="text-[12px] text-slate-400 font-bold mb-5 mt-1 uppercase">পিতা: {st.father_name} • রোল: {toBn(st.roll)}</p>
              
              <div className="p-4 bg-red-50/70 rounded-[1.5rem] flex justify-between items-center border border-red-100/50 mb-5 shadow-inner">
                <span className="text-red-600/70 font-black text-[11px] uppercase tracking-wider">মোট বকেয়া</span>
                <span className="text-red-600 font-black text-2xl">৳{toBn(st.dues)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setSelectedStudent(st); setShowPaymentModal(true); }} className="bg-emerald-600 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-100"><Banknote size={14}/>বকেয়া পরিশোধ</button>
                <button onClick={() => copyDueMsg(st)} className="bg-amber-50 text-amber-700 p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 border border-amber-100"><Copy size={14}/>বকেয়া কপি</button>
                <button onClick={() => copyAbsentMsg(st)} className="bg-rose-50 text-rose-700 p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 border border-rose-100"><MessageSquareWarning size={14}/>অনুপস্থিতি কপি</button>
                <a href={`tel:${st.phone}`} className="bg-slate-900 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 shadow-md"><Phone size={14}/>কল দিন</a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer with Branding */}
        <footer className="mt-20 py-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="p-1 bg-blue-50 rounded-full">
              <img 
                src="/gias.jpg" 
                alt="গিয়াস উদ্দিন" 
                className="w-16 h-16 rounded-full border-2 border-white shadow-md grayscale-[30%]"
              />
            </div>
            <div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Created By</p>
              <p className="text-slate-700 font-black text-sm">
                অ্যাপ ডেভেলপারঃ <span className="text-blue-600">গিয়াস উদ্দিন</span>
              </p>
            </div>
          </div>
        </footer>

        {/* Admission Form Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{y:50, opacity: 0}} animate={{y:0, opacity: 1}} className="bg-white w-full max-w-lg rounded-[2.5rem] p-7 max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-black text-2xl text-blue-900 tracking-tight">{editingId ? 'তথ্য সংশোধন' : 'ভর্তি ফরম'}</h2>
                  <div className="bg-slate-100 p-2 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-500 transition-all" onClick={closeForm}>
                    <X size={20}/>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">শিক্ষার্থীর ব্যক্তিগত তথ্য</p>
                    
                    <div className="space-y-2">
                      <label className="text-[13px] font-black text-slate-700 ml-1">শিক্ষার্থীর পূর্ণ নাম</label>
                      <input required placeholder="যেমনঃ এম এস সাদী মিনার" value={formData.name} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-black text-slate-700 ml-1">পিতার নাম</label>
                      <input required placeholder="যেমনঃ গিয়াস উদ্দিন" value={formData.father_name} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" onChange={e => setFormData({...formData, father_name: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[13px] font-black text-slate-700 ml-1">লিঙ্গ</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold cursor-pointer" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                          <option>ছাত্র</option><option>ছাত্রী</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-black text-slate-700 ml-1">রোল নং</label>
                        <input required type="number" placeholder="০০" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[13px] font-black text-slate-700 ml-1">ভর্তিকৃত শ্রেণী</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold cursor-pointer" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})}>
                          {CLASSES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-black text-slate-700 ml-1">মোবাইল নম্বর</label>
                        <input required placeholder="০১৭xxxxxxxx" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-black text-slate-700 ml-1">বর্তমান ঠিকানা</label>
                      <textarea placeholder="গ্রাম, পোস্ট, বাজার ইত্যাদি" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none h-24 resize-none font-bold" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 space-y-4">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] border-b border-blue-200/50 pb-2 text-center">ফি ক্যালকুলেশন</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-2 rounded-xl border border-blue-100">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">মাসিক বেতন</label>
                        <input type="number" className="w-full p-1 font-black text-blue-700 outline-none" value={formData.monthly_fee || ''} onChange={e => setFormData({...formData, monthly_fee: Number(e.target.value)})} />
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-blue-100">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">পরীক্ষা ফি</label>
                        <input type="number" className="w-full p-1 font-black text-blue-700 outline-none" value={formData.exam_fee || ''} onChange={e => setFormData({...formData, exam_fee: Number(e.target.value)})} />
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-blue-100">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">অন্যান্য ফি</label>
                        <input type="number" className="w-full p-1 font-black text-blue-700 outline-none" value={formData.other_fee || ''} onChange={e => setFormData({...formData, other_fee: Number(e.target.value)})} />
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-blue-100">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">পূর্বের বকেয়া</label>
                        <input type="number" className="w-full p-1 font-black text-blue-700 outline-none" value={formData.previous_dues || ''} onChange={e => setFormData({...formData, previous_dues: Number(e.target.value)})} />
                      </div>
                    </div>
                    <div className="p-5 bg-blue-600 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-200">
                      <span className="font-black text-white text-sm uppercase tracking-wider">মোট প্রদেয় বকেয়াঃ</span>
                      <span className="text-2xl font-black text-white">৳{toBn(formData.dues)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95">
                    <Save size={20}/> তথ্য সংরক্ষণ করুন
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedStudent && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div initial={{scale:0.9, opacity: 0}} animate={{scale:1, opacity: 1}} className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl relative border border-white">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X size={24}/></button>
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 font-black text-4xl shadow-inner border border-emerald-100/50">৳</div>
                <h3 className="font-black text-2xl text-slate-800 tracking-tight">{selectedStudent.name}</h3>
                <p className="text-slate-400 font-bold text-xs mt-1 mb-8">বর্তমান বকেয়া: <span className="text-red-500 font-black">৳{toBn(selectedStudent.dues)}</span></p>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="relative mb-6">
                    <input autoFocus required type="number" placeholder="০০" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-center text-4xl font-black text-emerald-700 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                      value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                    <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">টাকা পরিমাণ</p>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <CheckCircle size={22}/> পরিশোধ নিশ্চিত করুন
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
