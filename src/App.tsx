import React, { useState, useEffect } from 'react';
import { Search, Phone, School, Plus, X, Trash2, Edit3, UserCircle, Save, Filter, Copy, Banknote, MessageSquareWarning, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// বাংলা সংখ্যা কনভার্টার
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

  // ফি যোগ করে 'মোট বকেয়া' অটোমেটিক আপডেট করার লজিক
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
    const url = editingId ? `/api/${editingId}` : '/api';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    closeForm();
    fetchData();
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    await fetch(`/api/payment/${selectedStudent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(paymentAmount) })
    });
    setShowPaymentModal(false);
    setPaymentAmount('');
    setSelectedStudent(null);
    fetchData();
    alert('টাকা জমা হয়েছে এবং বকেয়া থেকে বিয়োগ করা হয়েছে!');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  // বকেয়া মেসেজ কপি লজিক
  const copyDueMessage = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${toBn(st.dues)} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('বকেয়া মেসেজ কপি হয়েছে!');
  };

  // অনুপস্থিতি মেসেজ কপি লজিক
  const copyAbsentMessage = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ।`;
    navigator.clipboard.writeText(msg);
    alert('অনুপস্থিতি মেসেজ কপি হয়েছে!');
  };

  const filteredStudents = students.filter((st: any) => {
    const matchesSearch = st.name.toLowerCase().includes(search.toLowerCase()) || st.roll.includes(search);
    const matchesClass = filterClass === 'সব শ্রেণী' || st.class_name === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <header className="bg-gradient-to-br from-[#1E40AF] to-[#1e3a8a] text-white pt-16 pb-24 px-4 text-center shadow-xl">
        <motion.div initial={{scale:0}} animate={{scale:1}} className="flex justify-center mb-4">
          <div className="bg-white/10 p-4 rounded-[2rem] backdrop-blur-md border border-white/20">
            <School size={48} className="text-yellow-400" />
          </div>
        </motion.div>
        <h1 className="text-2xl md:text-4xl font-black mb-3">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
        <p className="text-blue-100 opacity-90 font-medium text-sm">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।</p>
      </header>

      <main className="max-w-6xl mx-auto -mt-12 px-4">
        {/* সার্চ এবং ফিল্টার বার */}
        <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-2xl border border-blue-100 flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-[2]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="নাম বা রোল দিয়ে খুঁজুন..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-medium" onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 appearance-none" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Plus size={22} /> নতুন ভর্তি
          </button>
        </div>

        {/* শিক্ষার্থী কার্ড গ্রিড */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredStudents.map((st: any) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} key={st.id} className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${st.gender === 'ছাত্রী' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                      <UserCircle size={32} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingId(st.id); setFormData(st); setShowForm(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl"><Edit3 size={18} /></button>
                      <button onClick={async () => { if(confirm('ডিলিট করবেন?')) { await fetch(`/api/${st.id}`, {method:'DELETE'}); fetchData(); } }} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl"><Trash2 size={18} /></button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-800">{st.name}</h3>
                  <p className="text-xs text-slate-500 font-bold mb-3">পিতা: {st.father_name}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-bold">শ্রেণী: {st.class_name}</span>
                    <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold">রোল: {toBn(st.roll)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl mb-5 border border-red-100">
                    <span className="text-red-600 text-xs font-bold uppercase">মোট বকেয়া:</span>
                    <span className="text-xl font-black text-red-600">৳{toBn(st.dues)}</span>
                  </div>

                  {/* ৪টি অ্যাকশন বাটন */}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setSelectedStudent(st); setShowPaymentModal(true); }} className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 py-3 rounded-xl text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-all">
                      <Banknote size={16} /> বকেয়া পরিশোধ
                    </button>
                    <button onClick={() => copyDueMessage(st)} className="flex items-center justify-center gap-1 bg-amber-50 text-amber-700 py-3 rounded-xl text-[10px] font-bold hover:bg-amber-600 hover:text-white transition-all">
                      <Copy size={16} /> বকেয়া কপি
                    </button>
                    <button onClick={() => copyAbsentMessage(st)} className="flex items-center justify-center gap-1 bg-rose-50 text-rose-700 py-3 rounded-xl text-[10px] font-bold hover:bg-rose-600 hover:text-white transition-all">
                      <MessageSquareWarning size={16} /> অনুপস্থিতি কপি
                    </button>
                    <a href={`tel:${st.phone}`} className="flex items-center justify-center gap-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-bold hover:bg-blue-700 transition-all">
                      <Phone size={16} /> কল দিন
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ফুটার */}
        <footer className="mt-20 py-10 text-center border-t border-slate-100">
          <p className="text-slate-500 font-bold text-sm">অ্যাপ ডেভেলপারঃ <span className="text-blue-600">গিয়াস উদ্দিন</span></p>
        </footer>

        {/* ভর্তি ফরম মডাল (রেসপন্সিভ এবং জলছাপ যুক্ত) */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 flex items-center justify-center p-4">
              <motion.div initial={{ y: 50, opacity:0 }} animate={{ y: 0, opacity:1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 max-h-[85vh] overflow-y-auto relative shadow-2xl">
                <button onClick={closeForm} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><X size={24} /></button>
                <h2 className="text-2xl font-black mb-6 text-blue-900 flex items-center gap-2">
                  <Plus className="text-blue-600"/> {editingId ? 'তথ্য সংশোধন' : 'ভর্তি ফরম'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ব্যক্তিগত তথ্য</p>
                    <input required placeholder="এম এস সাদী মিনার/এম এস ফাদি মিহাল" value={formData.name} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input required placeholder="গিয়াস উদ্দিন" value={formData.father_name} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, father_name: e.target.value})} />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <select value={formData.gender} className="p-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option>ছাত্র</option><option>ছাত্রী</option>
                      </select>
                      <input required type="number" placeholder="রোল নং" value={formData.roll} className="p-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, roll: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <select value={formData.class_name} className="p-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, class_name: e.target.value})}>
                        {CLASSES.filter(c => c !== 'সব শ্রেণী').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input required placeholder="মোবাইল নং" value={formData.phone} className="p-3.5 bg-white border border-slate-200 rounded-2xl outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <textarea placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" value={formData.address} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl outline-none h-20 resize-none" onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl space-y-3 border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">ফি এবং বকেয়া (অটো যোগ হবে)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="মাসিক বেতন" value={formData.monthly_fee || ''} className="p-3 border border-white rounded-xl outline-none text-sm" onChange={e => setFormData({...formData, monthly_fee: Number(e.target.value)})} />
                      <input type="number" placeholder="পরীক্ষা ফি" value={formData.exam_fee || ''} className="p-3 border border-white rounded-xl outline-none text-sm" onChange={e => setFormData({...formData, exam_fee: Number(e.target.value)})} />
                      <input type="number" placeholder="অন্যান্য ফি" value={formData.other_fee || ''} className="p-3 border border-white rounded-xl outline-none text-sm" onChange={e => setFormData({...formData, other_fee: Number(e.target.value)})} />
                      <input type="number" placeholder="পূর্বের বকেয়া" value={formData.previous_dues || ''} className="p-3 border border-white rounded-xl outline-none text-sm" onChange={e => setFormData({...formData, previous_dues: Number(e.target.value)})} />
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm">
                      <span className="font-bold text-slate-600">মোট বকেয়া:</span>
                      <span className="text-2xl font-black text-blue-600">৳{toBn(formData.dues)}</span>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                    <Save size={20} /> সংরক্ষণ করুন
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* বকেয়া পরিশোধ মডাল */}
        <AnimatePresence>
          {showPaymentModal && selectedStudent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-2xl text-center">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X size={24} /></button>
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 italic text-3xl font-black">৳</div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{selectedStudent.name}</h3>
                <p className="text-slate-500 text-sm mb-6">বর্তমান বকেয়া: <span className="text-red-600 font-bold">৳{toBn(selectedStudent.dues)}</span></p>
                
                <form onSubmit={handlePaymentSubmit}>
                  <input autoFocus required type="number" placeholder="জমা টাকার পরিমাণ" className="w-full p-4 bg-emerald-50 text-emerald-900 font-black text-center text-3xl rounded-2xl outline-none border-2 border-emerald-100 focus:border-emerald-500 mb-4" 
                    value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                  <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> জমা নিন
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
