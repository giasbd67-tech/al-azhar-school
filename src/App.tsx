import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, QrCode, CreditCard, UserCheck, BarChart 
} from 'lucide-react';
import QRCode from 'react-qr-code';

const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];

export default function SmartSchoolApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total_students: 0, total_dues: 0, teacher_dues: 0 });
  const [showForm, setShowForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [stRes, dsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/dashboard')
      ]);
      if (stRes.ok) setStudents(await stRes.json());
      if (dsRes.ok) setStats(await dsRes.json());
    } catch (err) { console.error("Data load failed", err); }
  };

  const totalDuesCalc = Number(formData.monthly_fee) + Number(formData.exam_fee) + Number(formData.other_fee) + Number(formData.previous_dues);

  const sendAttendanceWhatsApp = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত হয়েছে। আমাদের উপর আস্থা রাখার জন্য ধন্যবাদ।`;
    window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const copyDuesMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${st.total_dues} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('বকেয়া ম্যাসেজ কপি হয়েছে!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowForm(false);
      loadData();
      setFormData({ name: '', father_name: '', address: '', gender: 'ছাত্র', class_name: 'প্লে', roll: '', phone: '', monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      <header className="bg-indigo-900 text-white p-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" />
          <div>
            <h1 className="text-xl font-black">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest">Smart School OS</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="মোট ছাত্র" value={stats.total_students} icon={<Users/>} color="bg-blue-500"/>
            <StatCard title="মোট বকেয়া" value={`৳${stats.total_dues}`} icon={<CreditCard/>} color="bg-rose-500"/>
            <StatCard title="শিক্ষক বকেয়া" value={`৳${stats.teacher_dues}`} icon={<UserCheck/>} color="bg-emerald-500"/>
            <StatCard title="আজকের আদায়" value="৳০" icon={<BarChart/>} color="bg-amber-500"/>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
              <Plus size={24}/> নতুন ভর্তি
            </button>
            {students.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      <QRCode value={`st:${st.id}`} size={50} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{st.name}</h3>
                      <p className="text-xs text-slate-400 font-bold">রোল: {st.roll} | শ্রেণী: {st.class_name}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-rose-600">বকেয়া:</span>
                  <span className="text-2xl font-black text-rose-700">৳{st.total_dues}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn label="বকেয়া কপি" icon={<Copy size={14}/>} onClick={() => copyDuesMsg(st)} color="bg-amber-100 text-amber-700"/>
                  <ActionBtn label="পরিশোধ" icon={<CreditCard size={14}/>} onClick={() => {setSelectedStudent(st); setShowPayModal(true)}} color="bg-emerald-100 text-emerald-700"/>
                  <ActionBtn label="উপস্থিতি (WA)" icon={<QrCode size={14}/>} onClick={() => sendAttendanceWhatsApp(st)} color="bg-indigo-600 text-white col-span-2 py-4"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">স্টুডেন্ট ভর্তি ফরম</h2>
              <button onClick={() => setShowForm(false)} className="p-2 bg-slate-100 rounded-full"><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput label="ছাত্রের নাম" name="name" placeholder="নাম লিখুন" value={formData.name} onChange={setFormData} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">শ্রেণী</label>
                  <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100" onChange={e => setFormData({...formData, class_name: e.target.value})}>
                    {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <FormInput label="রোল নং" name="roll" placeholder="১" value={formData.roll} onChange={setFormData} />
              </div>
              <FormInput label="মোবাইল নম্বর" name="phone" placeholder="017..." value={formData.phone} onChange={setFormData} />
              <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-3xl">
                <FormInput label="মাসিক বেতন" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={setFormData} />
                <FormInput label="অন্যান্য ফি" name="other_fee" type="number" value={formData.other_fee} onChange={setFormData} />
              </div>
              <div className="p-6 bg-indigo-900 text-white rounded-3xl flex justify-between items-center">
                <span className="font-bold">মোট বকেয়া:</span>
                <span className="text-2xl font-black">৳{totalDuesCalc}</span>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg">সেভ করুন</button>
            </form>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl z-40">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        <div className="flex flex-col items-center">
          <img src="/developer.jpg" alt="Dev" className="w-8 h-8 rounded-full border-2 border-indigo-600 object-cover" />
          <span className="text-[8px] font-bold text-indigo-700 mt-1">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </nav>
    </div>
  );
}

function FormInput({label, name, value, onChange, placeholder, type = "text"}: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-400">{label}</label>
      <input type={type} placeholder={placeholder} value={value} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-500 outline-none" onChange={e => onChange((prev: any) => ({...prev, [name]: e.target.value}))} />
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2">
      <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}>{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{title}</p>
      <h2 className="text-lg font-black">{value}</h2>
    </div>
  );
}

function ActionBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-3 rounded-2xl font-bold text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all`}>
      {icon} {label}
    </button>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 scale-110' : 'text-slate-400'}`}>
      {React.cloneElement(icon as React.ReactElement, {size: 24})}
    </button>
  );
}
