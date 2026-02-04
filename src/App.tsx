import React, { useState, useEffect } from 'react';
import { Search, Phone, Plus, X, Trash2, Edit3, UserCircle, Save, Copy, Banknote, MessageSquareWarning, CheckCircle, MessageCircle, MapPin, LogOut, Lock, User, Mail, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toBn = (n: any) => n?.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]) || "০";
const CLASSES = ['সব শ্রেণী', 'প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'forgot' | 'reset'>('signin');
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  useEffect(() => {
    document.title = "Al-Azhar School Management";
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

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

  // --- নতুন পাসওয়ার্ড রিসেট লজিক ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (loginCreds.username === 'Al-Azhar' && loginCreds.password === data.password) {
        setIsLoggedIn(true);
      } else {
        alert('ভুল ইউজার আইডি বা পাসওয়ার্ড!');
      }
    } catch (err) { alert('সার্ভার সমস্যা!'); }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '2026') { 
      setAuthView('reset'); // ওটিপি সঠিক হলে পাসওয়ার্ড পরিবর্তনের পেজে যাবে
      setOtp('');
    } else {
      alert('ভুল মাস্টার ওটিপি!');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword, masterOtp: '2026' })
    });
    if (res.ok) {
      alert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
      setAuthView('signin');
      setNewPassword('');
      setLoginCreds({ username: '', password: '' });
    }
  };

  // --- আগের সব ডাটা হ্যান্ডলার এবং মেসেজ টেমপ্লেট (অপরিবর্তিত) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    await fetch(editingId ? `/api/${editingId}` : '/api', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    closeForm(); fetchData();
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/payment/${selectedStudent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(paymentAmount) })
    });
    setShowPaymentModal(false); setPaymentAmount(''); fetchData();
    alert('টাকা জমা হয়েছে!');
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData(initialForm); };
  
  const getDueMsg = (st: any) => `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মোট বকেয়া ${toBn(st.dues)} টাকা। দ্রুত পরিশোধের অনুরোধ করা হলো। ধন্যবাদ।`;
  const getAbsentMsg = (st: any) => `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} স্কুলে উপস্থিত নেই। কারণ জানানোর অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ।`;

  const copyDueMsg = (st: any) => { navigator.clipboard.writeText(getDueMsg(st)); alert('বকেয়া মেসেজ কপি হয়েছে!'); };
  const copyAbsentMsg = (st: any) => { navigator.clipboard.writeText(getAbsentMsg(st)); alert('অনুপস্থিতি মেসেজ কপি হয়েছে!'); };
  const sendDueWhatsApp = (st: any) => { window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(getDueMsg(st))}`, '_blank'); };
  const sendAbsentWhatsApp = (st: any) => { window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(getAbsentMsg(st))}`, '_blank'); };

  const filtered = students.filter((st: any) => 
    (st.name.toLowerCase().includes(search.toLowerCase()) || st.roll.includes(search)) && 
    (filterClass === 'সব শ্রেণী' || st.class_name === filterClass)
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md border border-white">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl">
              <ShieldCheck className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              {authView === 'signin' ? 'লগইন' : authView === 'forgot' ? 'মাস্টার ভেরিফিকেশন' : 'নতুন পাসওয়ার্ড'}
            </h2>
          </div>

          <form onSubmit={authView === 'signin' ? handleSignIn : authView === 'forgot' ? handleVerifyOtp : handlePasswordReset} className="space-y-4">
            {authView === 'signin' && (
              <>
                <div className="relative">
                  <User className="absolute left-5 top-4.5 text-slate-400" size={18} />
                  <input required placeholder="ইউজার আইডি" className="w-full pl-14 p-4.5 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold" value={loginCreds.username} onChange={e => setLoginCreds({...loginCreds, username: e.target.value})} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-4.5 text-slate-400" size={18} />
                  <input required type={showPassword ? "text" : "password"} placeholder="পাসওয়ার্ড" className="w-full pl-14 pr-14 p-4.5 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold" value={loginCreds.password} onChange={e => setLoginCreds({...loginCreds, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4.5 text-slate-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </>
            )}

            {authView === 'forgot' && (
              <div className="relative">
                <KeyRound className="absolute left-5 top-4.5 text-blue-500" size={18} />
                <input required placeholder="মাস্টার ওটিপি (2026) দিন" className="w-full pl-14 p-4.5 bg-blue-50 rounded-2xl border-2 border-blue-200 text-xl font-black outline-none" value={otp} onChange={e => setOtp(e.target.value)} />
              </div>
            )}

            {authView === 'reset' && (
              <div className="relative">
                <Lock className="absolute left-5 top-4.5 text-emerald-500" size={18} />
                <input required placeholder="নতুন পাসওয়ার্ড টাইপ করুন" className="w-full pl-14 p-4.5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 font-bold outline-none" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-lg active:scale-95">
              {authView === 'signin' ? 'প্রবেশ করুন' : authView === 'forgot' ? 'ভেরিফাই ওটিপি' : 'পাসওয়ার্ড পরিবর্তন করুন'}
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] font-black uppercase text-slate-400">
            {authView === 'signin' ? (
              <button onClick={() => setAuthView('forgot')} className="text-blue-600">পাসওয়ার্ড পরিবর্তন করতে চান?</button>
            ) : (
              <button onClick={() => setAuthView('signin')} className="text-blue-600">লগইন পেজে ফিরে যান</button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- ড্যাশবোর্ড অংশ (অপরিবর্তিত, সব ফিচার ঠিক আছে) ---
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="bg-gradient-to-b from-blue-800 to-blue-700 text-white pt-10 pb-24 px-4 text-center relative overflow-hidden">
        <button onClick={() => setIsLoggedIn(false)} className="absolute top-6 right-6 bg-white/10 p-3 rounded-2xl hover:bg-red-500 transition-all backdrop-blur-md">
          <LogOut size={20} />
        </button>
        <h1 className="text-2xl font-black tracking-tight">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 bg-blue-900/40 rounded-full border border-white/10">
          <MapPin size={12} className="text-blue-300" />
          <p className="text-[11px] font-semibold">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto -mt-12 px-4 relative z-10">
        <div className="bg-white p-5 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-3 mb-8 border border-white/50">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input placeholder="নাম বা রোল দিয়ে খুঁজুন..." className="w-full pl-11 p-3.5 bg-slate-100 rounded-2xl outline-none" onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="p-3.5 bg-slate-100 rounded-2xl outline-none font-bold" onChange={e => setFilterClass(e.target.value)}>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
            <Plus size={20}/> নতুন ভর্তি
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((st: any) => (
            <motion.div layout key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between mb-4">
                <div className={`p-3 rounded-2xl ${st.gender === 'ছাত্রী' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                   <UserCircle size={28} />
                </div>
                <div className="flex gap-2">
                  <Edit3 size={18} className="text-slate-300 cursor-pointer" onClick={() => { setEditingId(st.id); setFormData(st); setShowForm(true); }} />
                  <Trash2 size={18} className="text-slate-300 cursor-pointer" onClick={async () => { if(confirm('ডিলিট করবেন?')) { await fetch(`/api/${st.id}`, {method:'DELETE'}); fetchData(); } }} />
                </div>
              </div>
              <h3 className="font-black text-xl text-slate-800">{st.name}</h3>
              <p className="text-[12px] text-slate-400 font-bold mb-5 mt-1 uppercase">পিতা: {st.father_name} • রোল: {toBn(st.roll)}</p>
              
              <div className="p-4 bg-red-50/70 rounded-[1.5rem] flex justify-between items-center border border-red-100/50 mb-5 shadow-inner">
                <span className="text-red-600/70 font-black text-[11px]">মোট বকেয়া</span>
                <span className="text-red-600 font-black text-2xl">৳{toBn(st.dues)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setSelectedStudent(st); setShowPaymentModal(true); }} className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-[10px] font-black border border-emerald-100/50 flex items-center justify-center gap-1.5">
                  <Banknote size={14}/>বকেয়া পরিশোধ
                </button>
                <button onClick={() => copyDueMsg(st)} className="bg-amber-50 text-amber-700 p-3 rounded-xl text-[10px] font-black border border-amber-100 flex items-center justify-center gap-1.5">
                  <Copy size={14}/>বকেয়া কপি
                </button>
                <button onClick={() => copyAbsentMsg(st)} className="bg-rose-50 text-rose-700 p-3 rounded-xl text-[10px] font-black border border-rose-100 flex items-center justify-center gap-1.5">
                  <MessageSquareWarning size={14}/>অনুপস্থিতি কপি
                </button>
                <a href={`tel:${st.phone}`} className="bg-slate-900 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5">
                  <Phone size={14}/>কল দিন
                </a>
                <button onClick={() => sendDueWhatsApp(st)} className="bg-green-600 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5">
                  <MessageCircle size={14}/> বকেয়া (WhatsApp)
                </button>
                <button onClick={() => sendAbsentWhatsApp(st)} className="bg-green-600 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5">
                  <MessageCircle size={14}/> অনুপস্থিতি (WhatsApp)
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 py-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-700 font-black text-sm">
               <span className="text-blue-600">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
            </p>
          </div>
        </footer>
      </main>

      {/* ভর্তি ফরম এবং পেমেন্ট মোডাল (অপরিবর্তিত) */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{y:50, opacity: 0}} animate={{y:0, opacity: 1}} className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 max-h-[90vh] overflow-y-auto relative">
               <div className="flex justify-between items-center mb-6">
                <h2 className="font-black text-xl text-blue-900">{editingId ? 'তথ্য সংশোধন' : 'ভর্তি ফরম'}</h2>
                <X className="cursor-pointer text-slate-400" onClick={closeForm}/>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="শিক্ষার্থীর নাম" value={formData.name} className="w-full p-3.5 border rounded-2xl bg-slate-50/50" onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="পিতার নাম" value={formData.father_name} className="w-full p-3.5 border rounded-2xl bg-slate-50/50" onChange={e => setFormData({...formData, father_name: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <select className="w-full p-3.5 border rounded-2xl font-bold bg-slate-50/50" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>ছাত্র</option><option>ছাত্রী</option>
                  </select>
                  <input required type="number" placeholder="রোল নং" className="w-full p-3.5 border rounded-2xl bg-slate-50/50" value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select className="w-full p-3.5 border rounded-2xl font-bold bg-slate-50/50" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})}>
                    {CLASSES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input required placeholder="মোবাইল নম্বর" className="w-full p-3.5 border rounded-2xl bg-slate-50/50" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="bg-blue-50/50 p-5 rounded-[2rem] space-y-4">
                   <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="বেতন" className="p-3 border rounded-xl" value={formData.monthly_fee || ''} onChange={e => setFormData({...formData, monthly_fee: Number(e.target.value)})} />
                    <input type="number" placeholder="পরীক্ষা ফি" className="p-3 border rounded-xl" value={formData.exam_fee || ''} onChange={e => setFormData({...formData, exam_fee: Number(e.target.value)})} />
                    <input type="number" placeholder="অন্যান্য" className="p-3 border rounded-xl" value={formData.other_fee || ''} onChange={e => setFormData({...formData, other_fee: Number(e.target.value)})} />
                    <input type="number" placeholder="পূর্বের বকেয়া" className="p-3 border rounded-xl" value={formData.previous_dues || ''} onChange={e => setFormData({...formData, previous_dues: Number(e.target.value)})} />
                  </div>
                  <div className="p-4 bg-white rounded-2xl flex justify-between items-center shadow-sm">
                    <span className="font-bold">মোট বকেয়া:</span>
                    <span className="text-2xl font-black text-blue-600">৳{toBn(formData.dues)}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg">সংরক্ষণ করুন</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && selectedStudent && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9, opacity: 0}} animate={{scale:1, opacity: 1}} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center relative">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-slate-300"><X size={24}/></button>
              <h3 className="font-black text-xl">{selectedStudent.name}</h3>
              <p className="text-slate-400 mb-6">বকেয়া: <span className="text-red-500 font-bold">৳{toBn(selectedStudent.dues)}</span></p>
              <form onSubmit={handlePaymentSubmit}>
                <input autoFocus required type="number" placeholder="টাকার পরিমাণ" className="w-full p-5 bg-slate-50 border-2 border-emerald-100 rounded-2xl text-center text-3xl font-black text-emerald-700 outline-none mb-4" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">জমা নিশ্চিত করুন</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
