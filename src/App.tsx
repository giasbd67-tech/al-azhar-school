import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, QrCode, CreditCard, UserCheck, 
  BarChart, MessageSquare, Search, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

// ১. কনফিগারেশন ও ডাটা
const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];

export default function AlAzharSmartOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  // স্টুডেন্ট ফর্ম স্টেট (আপনার দেওয়া জলছাপের লজিক সহ)
  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  // টিচার ফর্ম স্টেট
  const [tData, setTData] = useState({ name: '', designation: '', salary: '0', phone: '' });

  // ২. অটো ক্যালকুলেশন: মোট বকেয়া (অটোমেটিক যোগ হবে)
  const totalDuesCalc = Number(formData.monthly_fee) + Number(formData.exam_fee) + 
                       Number(formData.other_fee) + Number(formData.previous_dues);

  // ৩. মেসেজ ও হোয়াটসঅ্যাপ লজিক
  const copyDueMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${st.total_due} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('বকেয়া মেসেজ কপি হয়েছে!');
  };

  const copyAbsentMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ`;
    navigator.clipboard.writeText(msg);
    alert('অনুপস্থিতি মেসেজ কপি হয়েছে!');
  };

  const sendWhatsAppAttendance = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আপনার সন্তান ${st.name} আজ স্কুলে উপস্থিত হয়েছে। ধন্যবাদ। - আল-আজহার স্মার্ট স্কুল ওএস`;
    window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ৪. পেমেন্ট লজিক (বকেয়া থেকে বিয়োগ)
  const handlePayment = () => {
    if (!selectedStudent || !payAmount) return;
    setStudents(students.map(s => 
      s.id === selectedStudent.id ? { ...s, total_due: s.total_due - Number(payAmount) } : s
    ));
    setShowPayModal(false);
    setPayAmount('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans overflow-x-hidden">
      {/* হেডার: লোগো ও নাম */}
      <header className="bg-[#1E3A8A] text-white p-8 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center gap-5 max-w-5xl mx-auto relative z-10">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-2xl shadow-black/20" />
          <div>
            <h1 className="text-2xl font-black tracking-tight">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mt-1">Smart School OS • Premium Edition</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {/* ড্যাশবোর্ড ট্যাব */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-[-40px]">
            <StatCard title="মোট শিক্ষার্থী" value={students.length} icon={<Users/>} color="bg-blue-600" />
            <StatCard title="মোট বকেয়া" value={`৳${students.reduce((a,b)=>a+b.total_due,0)}`} icon={<CreditCard/>} color="bg-rose-600" />
            <StatCard title="শিক্ষক স্যালারি" value={`৳${teachers.reduce((a,b)=>a+Number(b.salary),0)}`} icon={<UserCheck/>} color="bg-emerald-600" />
            <StatCard title="AI রিপোর্ট" value="Live" icon={<BarChart/>} color="bg-amber-600" />
          </motion.div>
        )}

        {/* শিক্ষার্থী ট্যাব */}
        {activeTab === 'students' && (
          <div className="space-y-5 animate-in fade-in duration-500">
            <button onClick={() => setShowForm(true)} className="w-full bg-[#1E3A8A] text-white p-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all">
              <Plus size={28}/> নতুন শিক্ষার্থী ভর্তি
            </button>

            {students.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-2 rounded-2xl border-2 border-slate-100"><QRCode value={`ID:${st.id}`} size={70} /></div>
                    <div>
                      <h3 className="font-black text-xl text-slate-800">{st.name}</h3>
                      <p className="text-sm font-bold text-slate-400">রোল: {st.roll} | শ্রেণী: {st.class_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors"><Edit size={20}/></button>
                    <button onClick={() => setStudents(students.filter(s => s.id !== st.id))} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"><Trash2 size={20}/></button>
                  </div>
                </div>

                <div className="bg-rose-50 p-5 rounded-[2rem] flex justify-between items-center border-2 border-rose-100/50">
                  <span className="font-bold text-rose-600 uppercase text-xs tracking-widest">মোট বকেয়া</span>
                  <span className="text-3xl font-black text-rose-700 font-mono tracking-tighter">৳{st.total_due}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ActionBtn label="বকেয়া কপি" icon={<Copy size={18}/>} onClick={() => copyDueMsg(st)} color="bg-amber-50 text-amber-700" />
                  <ActionBtn label="বকেয়া পরিশোধ" icon={<CreditCard size={18}/>} onClick={() => {setSelectedStudent(st); setShowPayModal(true)}} color="bg-emerald-50 text-emerald-700" />
                  <ActionBtn label="অনুপস্থিতি কপি" icon={<X size={18}/>} onClick={() => copyAbsentMsg(st)} color="bg-rose-50 text-rose-700" />
                  <ActionBtn label="কল দিন" icon={<Phone size={18}/>} onClick={() => window.open(`tel:${st.phone}`)} color="bg-slate-900 text-white" />
                  <ActionBtn label="হাজিরা (WhatsApp)" icon={<MessageSquare size={18}/>} onClick={() => sendWhatsAppAttendance(st)} color="bg-blue-600 text-white col-span-2 py-5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* শিক্ষক ট্যাব */}
        {activeTab === 'teachers' && (
          <div className="space-y-4">
            <button onClick={() => setShowTeacherForm(true)} className="w-full bg-emerald-600 text-white p-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-2">
              <Plus/> নতুন শিক্ষক যোগ করুন
            </button>
            {teachers.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-2xl">{t.name[0]}</div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">{t.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.designation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">বেতন</p>
                  <h4 className="text-xl font-black text-emerald-600">৳{t.salary}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ভর্তি ফরম মডাল (বড় এবং স্ক্রলেবল) */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="bg-white w-full max-w-xl rounded-t-[4rem] shadow-2xl overflow-hidden h-[92vh] flex flex-col">
              <div className="p-8 bg-[#1E3A8A] text-white flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-black tracking-tight">শিক্ষার্থী ভর্তি ফরম</h2>
                <button onClick={() => setShowForm(false)} className="bg-white/10 p-3 rounded-full"><X/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scroll">
                <Input label="নাম (Name)" name="name" placeholder="এম এস সাদী মিনার / এম এস ফাদি মিহাল" value={formData.name} onChange={setFormData} />
                <Input label="পিতার নাম (Father's Name)" name="father_name" placeholder="গিয়াস উদ্দিন" value={formData.father_name} onChange={setFormData} />
                <Input label="ঠিকানা (Address)" name="address" placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" value={formData.address} onChange={setFormData} isTextarea />
                
                <div className="grid grid-cols-2 gap-4">
                  <Select label="লিঙ্গ (Gender)" options={["ছাত্র", "ছাত্রী"]} onChange={(v) => setFormData({...formData, gender: v})} />
                  <Select label="শ্রেণী (Class)" options={CLASS_LIST} onChange={(v) => setFormData({...formData, class_name: v})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="রোল নং (Roll)" name="roll" placeholder="যেমন: ১" value={formData.roll} onChange={setFormData} />
                  <Input label="মোবাইল নং (Phone)" name="phone" placeholder="017xxxxxxxx" value={formData.phone} onChange={setFormData} />
                </div>

                <div className="bg-blue-50/50 p-6 rounded-[2.5rem] border-2 border-blue-100 space-y-4">
                  <h3 className="font-black text-[#1E3A8A] text-sm uppercase tracking-widest text-center">বেতন ও ফিস (টাকা)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="মাসিক বেতন" name="monthly_fee" value={formData.monthly_fee} onChange={setFormData} type="number" />
                    <Input label="পরীক্ষা ফি" name="exam_fee" value={formData.exam_fee} onChange={setFormData} type="number" />
                    <Input label="অন্যান্য ফি" name="other_fee" value={formData.other_fee} onChange={setFormData} type="number" />
                    <Input label="পূর্বের বকেয়া" name="previous_dues" value={formData.previous_dues} onChange={setFormData} type="number" />
                  </div>
                </div>

                <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] flex justify-between items-center shadow-xl border-b-8 border-blue-600">
                  <span className="font-bold opacity-60">মোট বকেয়া:</span>
                  <span className="text-4xl font-black text-blue-400">৳{totalDuesCalc}</span>
                </div>

                <button onClick={() => { setStudents([...students, { ...formData, id: Date.now(), total_due: totalDuesCalc }]); setShowForm(false); }} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-blue-200 active:scale-95 transition-all mb-8">সেভ করুন</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ফুটার নেভিগেশন ও ব্র্যান্ডিং */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 p-5 flex justify-around items-center rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[100]">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        <NavBtn icon={<UserCheck/>} active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
        
        {/* অ্যাপ ডেভেলপার: গিয়াস উদ্দিন */}
        <div className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full border-2 border-blue-600 p-0.5 shadow-lg group-hover:scale-110 transition-transform">
            <img src="/developer.jpg" alt="Dev" className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="text-[9px] font-black text-blue-900">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </nav>

      <style>{`.custom-scroll::-webkit-scrollbar { width: 0; }`}</style>
    </div>
  );
}

// ৪. রিইউজেবল কম্পোনেন্টস
function Input({label, name, value, onChange, placeholder, type = "text", isTextarea = false}: any) {
  const sharedClass = "w-full p-6 bg-slate-50 rounded-[1.8rem] font-bold border-2 border-transparent focus:border-blue-500 outline-none text-lg transition-all shadow-inner placeholder:text-slate-300";
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      {isTextarea ? 
        <textarea className={sharedClass} rows={2} placeholder={placeholder} onChange={e => onChange((p: any) => ({...p, [name]: e.target.value}))}></textarea> :
        <input type={type} className={sharedClass} placeholder={placeholder} value={value} onChange={e => onChange((p: any) => ({...p, [name]: e.target.value}))} />
      }
    </div>
  );
}

function Select({label, options, onChange}: any) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      <select className="w-full p-6 bg-slate-50 rounded-[1.8rem] font-bold border-2 border-transparent focus:border-blue-500 outline-none appearance-none" onChange={e => onChange(e.target.value)}>
        {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3">
      <div className={`${color} p-4 rounded-2xl text-white shadow-xl shadow-slate-200`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{title}</p>
        <h2 className="text-xl font-black text-slate-800">{value}</h2>
      </div>
    </div>
  );
}

function ActionBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-4 rounded-[1.5rem] font-black text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all border-b-4 border-black/5`}>
      {icon} {label}
    </button>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-5 rounded-2xl transition-all ${active ? 'bg-blue-50 text-blue-700 scale-110' : 'text-slate-300 hover:text-slate-500'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 30, strokeWidth: active ? 3 : 2 })}
    </button>
  );
}
