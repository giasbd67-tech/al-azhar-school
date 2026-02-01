import React, { useState, useEffect } from 'react';
import { Search, Phone, Plus, X, Trash2, Edit3, UserCircle, Save, Copy, Banknote, MessageSquareWarning, CheckCircle, MessageCircle, MapPin, LogOut, Lock, User, Mail, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toBn = (n: any) => n?.toString().replace(/\d/g, (d: any) => "০১২৩৪৫৬৭৮৯"[d]) || "০";
const CLASSES = ['সব শ্রেণী', 'প্লে', 'নার্সারি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ'];

export default function App() {
  // --- Authentication States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // --- App States ---
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

  // --- 🔐 AUTH HANDLERS (Database Integrated) ---
  
  // ১. লগইন চেক (ডাটাবেস থেকে)
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
    } catch (err) {
      alert('সার্ভার এরর! ইন্টারনেট কানেকশন বা ডাটাবেস চেক করুন।');
    }
  };

  // ২. মাস্টার ওটিপি চেক
  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpField) {
      alert('মাস্টার ওটিপি ব্যবহারের জন্য প্রস্তুত।');
      setShowOtpField(true);
    } else {
      if (otp === '2026') { 
        setAuthView('reset'); // ওটিপি মিললে নতুন পাসওয়ার্ড পেজে নিয়ে যাবে
        setShowOtpField(false);
        setOtp('');
      } else {
        alert('ভুল ওটিপি! সঠিক মাস্টার কোড দিন।');
      }
    }
  };

  // ৩. পাসওয়ার্ড রিসেট (স্থায়ীভাবে ডাটাবেসে সেভ হবে)
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, masterOtp: '2026' })
      });

      if (res.ok) {
        alert('পাসওয়ার্ড ডাটাবেসে স্থায়ীভাবে আপডেট হয়েছে!');
        setAuthView('signin');
        setNewPassword('');
      } else {
        alert('রিসেট সফল হয়নি।');
      }
    } catch (err) {
      alert('সমস্যা হয়েছে!');
    }
  };

  // --- API Handlers ---
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

  // --- Message Handlers ---
  const copyDueMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর বকেয়া ${toBn(st.dues)} টাকা। দ্রুত পরিশোধ করুন। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('মেসেজ কপি হয়েছে!');
  };

  const sendDueWhatsApp = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর বকেয়া ${toBn(st.dues)} টাকা। ধন্যবাদ।`;
    window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filtered = students.filter((st: any) => 
    (st.name.toLowerCase().includes(search.toLowerCase()) || st.roll.includes(search)) && 
    (filterClass === 'সব শ্রেণী' || st.class_name === filterClass)
  );

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md border border-white">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
              <ShieldCheck className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {authView === 'signin' ? 'লগইন করুন' : authView === 'reset' ? 'নতুন পাসওয়ার্ড সেট' : 'রিকভারি'}
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Al-Azhar School System</p>
          </div>

          <form onSubmit={authView === 'signin' ? handleSignIn : authView === 'reset' ? handlePasswordReset : handleRecovery} className="space-y-4">
            
            {authView === 'signin' && (
              <>
                <div className="relative">
                  <User className="absolute left-5 top-4.5 text-slate-400" size={18} />
                  <input required placeholder="ইউজার আইডি" className="w-full pl-14 p-4.5 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold" value={loginCreds.username} onChange={e => setLoginCreds({...loginCreds, username: e.target.value})} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-4.5 text-slate-400" size={18} />
                  <input required type={showPassword ? "text" : "password"} placeholder="পাসওয়ার্ড" className="w-full pl-14 pr-14 p-4.5 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold" value={loginCreds.password} onChange={e => setLoginCreds({...loginCreds, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4.5 text-slate-400 transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </>
            )}

            {authView === 'forgot' && (
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-5 top-4.5 text-slate-400" size={18} />
                  <input readOnly value="giasbd67@gmail.com" className="w-full pl-14 p-4.5 bg-slate-100 rounded-2xl text-slate-500 font-bold" />
                </div>
                {showOtpField && (
                  <div className="relative">
                    <KeyRound className="absolute left-5 top-4.5 text-blue-500" size={18} />
                    <input required placeholder="মাস্টার ওটিপি দিন" className="w-full pl-14 p-4.5 bg-blue-50 rounded-2xl border-2 border-blue-200 text-xl font-black tracking-widest outline-none" value={otp} onChange={e => setOtp(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {authView === 'reset' && (
              <div className="relative">
                <Lock className="absolute left-5 top-4.5 text-blue-500" size={18} />
                <input required placeholder="নতুন পাসওয়ার্ড দিন" className="w-full pl-14 p-4.5 bg-blue-50 rounded-2xl border-2 border-blue-200 font-bold outline-none" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              {authView === 'signin' ? 'প্রবেশ করুন' : authView === 'reset' ? 'পাসওয়ার্ড আপডেট করুন' : showOtpField ? 'ভেরিফাই করুন' : 'ওটিপি পাঠান'}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-2 text-center text-[11px] font-black uppercase text-slate-400">
            {authView === 'signin' ? (
              <button onClick={() => setAuthView('forgot')} className="text-blue-600">পাসওয়ার্ড ভুলে গেছেন?</button>
            ) : (
              <button onClick={() => {setAuthView('signin'); setShowOtpField(false);}} className="text-blue-600">লগইন পেজে ফিরে যান</button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD UI (Feature Restored) ---
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="bg-gradient-to-b from-blue-800 to-blue-700 text-white pt-10 pb-24 px-4 text-center shadow-lg relative overflow-hidden">
        <button onClick={() => setIsLoggedIn(false)} className="absolute top-6 right-6 bg-white/10 p-3 rounded-2xl hover:bg-red-500 transition-all shadow-xl backdrop-blur-md border border-white/10">
          <LogOut size={20} />
        </button>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative inline-block">
          <div className="relative bg-white p-1 rounded-full shadow-2xl mb-4 border-2 border-white/50">
            <img src="/logo.png" alt="School Logo" className="w-24 h-24 rounded-full object-cover" />
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-black tracking-tight drop-shadow-lg">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 bg-blue-900/40 backdrop-blur-md rounded-full border border-white/10">
          <MapPin size={12} className="text-blue-300" />
          <p className="text-[11px] font-semibold text-blue-50">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto -mt-12 px-4 relative z-10">
        <div className="bg-white p-5 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-3 mb-8 border border-white/50">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input placeholder="নাম বা রোল দিয়ে খুঁজুন..." className="w-full pl-11 p-3.5 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-blue-100 transition-all" onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="p-3.5 bg-slate-100 rounded-2xl outline-none font-bold text-slate-600" onChange={e => setFilterClass(e.target.value)}>
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
                  <Edit3 size={18} className="text-slate-300 cursor-pointer hover:text-blue-600" onClick={() => { setEditingId(st.id); setFormData(st); setShowForm(true); }} />
                  <Trash2 size={18} className="text-slate-300 cursor-pointer hover:text-red-500" onClick={async () => { if(confirm('ডিলিট করবেন?')) { await fetch(`/api/${st.id}`, {method:'DELETE'}); fetchData(); } }} />
                </div>
              </div>
              <h3 className="font-black text-xl text-slate-800">{st.name}</h3>
              <p className="text-[12px] text-slate-400 font-bold mb-5 mt-1 uppercase">পিতা: {st.father_name} • রোল: {toBn(st.roll)}</p>
              
              <div className="p-4 bg-red-50 rounded-[1.5rem] flex justify-between items-center mb-5">
                <span className="text-red-600/70 font-black text-[11px] uppercase">বকেয়া</span>
                <span className="text-red-600 font-black text-2xl">৳{toBn(st.dues)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setSelectedStudent(st); setShowPaymentModal(true); }} className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-[10px] font-black border border-emerald-100"><Banknote size={14}/>বকেয়া পরিশোধ</button>
                <button onClick={() => copyDueMsg(st)} className="bg-amber-50 text-amber-700 p-3 rounded-xl text-[10px] font-black border border-amber-100"><Copy size={14}/>মেসেজ কপি</button>
                <a href={`tel:${st.phone}`} className="bg-slate-900 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5"><Phone size={14}/>কল দিন</a>
                <button onClick={() => sendDueWhatsApp(st)} className="bg-green-600 text-white p-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 shadow-md">
                  <MessageCircle size={14}/> বকেয়া (WhatsApp)
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 py-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="p-1 bg-blue-50 rounded-full ring-2 ring-white">
              <img src="/gias.jpg" alt="গিয়াস উদ্দিন" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
            </div>
            <p className="text-slate-700 font-black text-sm">
              <span className="text-blue-600">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
            </p>
          </div>
        </footer>

        {/* --- Modals (Form & Payment) --- */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{y:50, opacity: 0}} animate={{y:0, opacity: 1}} className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-black text-xl text-blue-900">{editingId ? 'তথ্য সংশোধন' : 'ভর্তি ফরম'}</h2>
                  <X className="cursor-pointer text-slate-400" onClick={closeForm}/>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <input required placeholder="শিক্ষার্থীর নাম" value={formData.name} className="w-full p-3.5 border rounded-2xl outline-none focus:border-blue-500 bg-slate-50" onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input required placeholder="পিতার নাম" value={formData.father_name} className="w-full p-3.5 border rounded-2xl outline-none bg-slate-50" onChange={e => setFormData({...formData, father_name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                       <select className="w-full p-3.5 border rounded-2xl font-bold bg-slate-50" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option>ছাত্র</option><option>ছাত্রী</option></select>
                       <input required type="number" placeholder="রোল নং" className="w-full p-3.5 border rounded-2xl outline-none bg-slate-50" value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <select className="w-full p-3.5 border rounded-2xl font-bold bg-slate-50" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})}>
                          {CLASSES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                       <input required placeholder="মোবাইল নম্বর" className="w-full p-3.5 border rounded-2xl outline-none bg-slate-50" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="bg-blue-50 p-5 rounded-[2rem] space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="বেতন" className="p-3 border rounded-xl" value={formData.monthly_fee || ''} onChange={e => setFormData({...formData, monthly_fee: Number(e.target.value)})} />
                        <input type="number" placeholder="পরীক্ষা ফি" className="p-3 border rounded-xl" value={formData.exam_fee || ''} onChange={e => setFormData({...formData, exam_fee: Number(e.target.value)})} />
                        <input type="number" placeholder="অন্যান্য ফি" className="p-3 border rounded-xl" value={formData.other_fee || ''} onChange={e => setFormData({...formData, other_fee: Number(e.target.value)})} />
                        <input type="number" placeholder="পূর্বের বকেয়া" className="p-3 border rounded-xl" value={formData.previous_dues || ''} onChange={e => setFormData({...formData, previous_dues: Number(e.target.value)})} />
                      </div>
                      <div className="p-4 bg-white rounded-2xl flex justify-between items-center border border-blue-100">
                        <span className="font-bold text-slate-600">মোট বকেয়া:</span>
                        <span className="text-2xl font-black text-blue-600">৳{toBn(formData.dues)}</span>
                      </div>
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
              <motion.div initial={{scale:0.9, opacity: 0}} animate={{scale:1, opacity: 1}} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl relative">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><X size={24}/></button>
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-3xl italic">৳</div>
                <h3 className="font-black text-xl text-slate-800">{selectedStudent.name}</h3>
                <p className="text-slate-400 text-sm mb-6">বর্তমান বকেয়া: <span className="text-red-500 font-bold">৳{toBn(selectedStudent.dues)}</span></p>
                <form onSubmit={handlePaymentSubmit}>
                  <input autoFocus required type="number" placeholder="জমা টাকার পরিমাণ" className="w-full p-5 bg-slate-50 border-2 border-emerald-100 rounded-2xl text-center text-3xl font-black text-emerald-700 outline-none mb-4" 
                    value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                  <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg">জমা নিশ্চিত করুন</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
