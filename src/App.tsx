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

  // টাকা অটোমেটিক যোগ করার লজিক
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

  // মেসেজ কপি লজিক
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

  const filtered = students.filter((st: any) => (st.name.includes(search) || st.roll.includes(search)) && (filterClass === 'সব শ্রেণী' || st.class_name === filterClass));

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="bg-blue-700 text-white pt-10 pb-20 px-4 text-center">
        <School size={40} className="mx-auto mb-2 text-yellow-400" />
        <h1 className="text-xl font-bold">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
      </header>

      <main className="max-w-4xl mx-auto -mt-10 px-4">
        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-2 mb-6">
          <input placeholder="খুঁজুন..." className="flex-grow p-3 bg-slate-100 rounded-xl outline-none" onChange={e => setSearch(e.target.value)} />
          <select className="p-3 bg-slate-100 rounded-xl outline-none font-bold" onChange={e => setFilterClass(e.target.value)}>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white p-3 rounded-xl font-bold">+ নতুন ভর্তি</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((st: any) => (
            <div key={st.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between mb-2">
                <UserCircle size={30} className="text-blue-500" />
                <div className="flex gap-2">
                  <Edit3 size={18} className="text-slate-400 cursor-pointer" onClick={() => { setEditingId(st.id); setFormData(st); setShowForm(true); }} />
                  <Trash2 size={18} className="text-red-400 cursor-pointer" onClick={async () => { if(confirm('ডিলিট?')) { await fetch(`/api/${st.id}`, {method:'DELETE'}); fetchData(); } }} />
                </div>
              </div>
              <h3 className="font-black text-lg">{st.name}</h3>
              <p className="text-xs text-slate-500">পিতা: {st.father_name} | শ্রেণী: {st.class_name}</p>
              <div className="my-3 p-3 bg-red-50 rounded-xl flex justify-between">
                <span className="text-red-600 font-bold text-sm">মোট বকেয়া:</span>
                <span className="text-red-600 font-black">৳{toBn(st.dues)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button onClick={() => { setSelectedStudent(st); setShowPaymentModal(true); }} className="bg-emerald-50 text-emerald-700 p-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"><Banknote size={14}/>বকেয়া পরিশোধ</button>
                <button onClick={() => copyDueMsg(st)} className="bg-amber-50 text-amber-700 p-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"><Copy size={14}/>বকেয়া কপি</button>
                <button onClick={() => copyAbsentMsg(st)} className="bg-rose-50 text-rose-700 p-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"><MessageSquareWarning size={14}/>অনুপস্থিতি কপি</button>
                <a href={`tel:${st.phone}`} className="bg-slate-800 text-white p-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"><Phone size={14}/>কল দিন</a>
              </div>
            </div>
          ))}
        </div>

        {/* ভর্তি ফরম */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{y:50}} animate={{y:0}} className="bg-white w-full max-w-md rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between mb-4"><h2 className="font-black text-xl">ভর্তি ফরম</h2><X className="cursor-pointer" onClick={closeForm}/></div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input required placeholder="নাম" value={formData.name} className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required placeholder="পিতার নাম" value={formData.father_name} className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, father_name: e.target.value})} />
                  <div className="flex gap-2">
                    <select className="flex-1 p-3 border rounded-xl" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option>ছাত্র</option><option>ছাত্রী</option></select>
                    <input required placeholder="রোল" className="flex-1 p-3 border rounded-xl" value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} />
                  </div>
                  <div className="flex gap-2">
                    <select className="flex-1 p-3 border rounded-xl" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})}>{CLASSES.slice(1).map(c => <option key={c}>{c}</option>)}</select>
                    <input required placeholder="মোবাইল" className="flex-1 p-3 border rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <textarea placeholder="ঠিকানা" className="w-full p-3 border rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                    <input type="number" placeholder="বেতন" className="p-2 border rounded-lg" onChange={e => setFormData({...formData, monthly_fee: Number(e.target.value)})} />
                    <input type="number" placeholder="পরীক্ষা ফি" className="p-2 border rounded-lg" onChange={e => setFormData({...formData, exam_fee: Number(e.target.value)})} />
                    <input type="number" placeholder="অন্যান্য ফি" className="p-2 border rounded-lg" onChange={e => setFormData({...formData, other_fee: Number(e.target.value)})} />
                    <input type="number" placeholder="বকেয়া" className="p-2 border rounded-lg" onChange={e => setFormData({...formData, previous_dues: Number(e.target.value)})} />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl font-bold flex justify-between"><span>মোট বকেয়া:</span><span>৳{toBn(formData.dues)}</span></div>
                  <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg">সংরক্ষণ করুন</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* পেমেন্ট মডাল */}
        <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white w-full max-w-xs rounded-3xl p-6 text-center">
                <h3 className="font-bold mb-4">টাকা জমা নিন</h3>
                <input autoFocus type="number" placeholder="পরিমাণ" className="w-full p-4 border rounded-2xl text-center text-2xl font-black mb-4" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                <button onClick={handlePaymentSubmit} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">নিশ্চিত করুন</button>
                <button onClick={() => setShowPaymentModal(false)} className="mt-2 text-slate-400 text-sm">বাতিল</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
