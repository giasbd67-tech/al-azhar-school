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
  const [stats, setStats] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  // ফর্ম ডাটা স্টেটস (জলছাপ সহ)
  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [st, ds] = await Promise.all([
      fetch('/api/students').then(res => res.json()),
      fetch('/api/dashboard').then(res => res.json())
    ]);
    setStudents(st);
    setStats(ds);
  };

  // ১. ফি যোগ করার লজিক
  const totalDuesCalc = Number(formData.monthly_fee) + Number(formData.exam_fee) + Number(formData.other_fee) + Number(formData.previous_dues);

  // ২. হোয়াটসঅ্যাপ ম্যাসেজ লজিক (কিউআর স্ক্যান বাটন)
  const sendAttendanceWhatsApp = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত হয়েছে। আমাদের উপর আস্থা রাখার জন্য ধন্যবাদ।`;
    const url = `https://wa.me/88${st.phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // ৩. কপি লজিক
  const copyDuesMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${st.total_dues} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('বকেয়া ম্যাসেজ কপি হয়েছে!');
  };

  const copyAbsentMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ`;
    navigator.clipboard.writeText(msg);
    alert('অনুপস্থিতি ম্যাসেজ কপি হয়েছে!');
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

  const handlePayment = async () => {
    await fetch('/api/students/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedStudent.id, amount: payAmount })
    });
    setShowPayModal(false);
    loadData();
  };

  const deleteStudent = async (id: number) => {
    if(confirm('আপনি কি নিশ্চিত?')) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* হেডার (লোগো সহ) */}
      <header className="bg-indigo-900 text-white p-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" />
          <div>
            <h1 className="text-2xl font-black">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-xs text-indigo-200">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-4">
        {/* ড্যাশবোর্ড স্ট্যাটাস */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
            <StatCard title="মোট ছাত্র" value={stats.total_students} icon={<Users/>} color="bg-blue-500"/>
            <StatCard title="মোট বকেয়া" value={`৳${stats.total_dues}`} icon={<CreditCard/>} color="bg-rose-500"/>
            <StatCard title="শিক্ষক বেতন" value={`৳${stats.teacher_dues}`} icon={<UserCheck/>} color="bg-emerald-500"/>
            <StatCard title="এনালাইটিক্স" value="লাইভ" icon={<BarChart/>} color="bg-amber-500"/>
          </div>
        )}

        {/* স্টুডেন্ট কার্ড লিস্ট */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
              <Plus size={20}/> নতুন স্টুডেন্ট ভর্তি
            </button>

            {students.map((st) => (
              <div key={st.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl flex items-center justify-center border-2 border-indigo-100">
                      <QRCode value={`attendance:${st.id}`} size={60} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-800">{st.name}</h3>
                      <p className="text-xs font-bold text-slate-400">রোল: {st.roll} | শ্রেণী: {st.class_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-100 rounded-full text-indigo-600"><Edit size={18}/></button>
                    <button onClick={() => deleteStudent(st.id)} className="p-2 bg-slate-100 rounded-full text-rose-600"><Trash2 size={18}/></button>
                  </div>
                </div>

                <div className="bg-rose-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-rose-600">মোট বকেয়া:</span>
                  <span className="text-2xl font-black text-rose-700">৳{st.total_dues}</span>
                </div>

                {/* কার্ডের কপি ও কল বাটন */}
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn label="বকেয়া কপি" icon={<Copy size={16}/>} onClick={() => copyDuesMsg(st)} color="bg-amber-100 text-amber-700"/>
                  <ActionBtn label="বকেয়া পরিশোধ" icon={<CreditCard size={16}/>} onClick={() => {setSelectedStudent(st); setShowPayModal(true)}} color="bg-emerald-100 text-emerald-700"/>
                  <ActionBtn label="অনুপস্থিতি কপি" icon={<X size={16}/>} onClick={() => copyAbsentMsg(st)} color="bg-rose-100 text-rose-700"/>
                  <ActionBtn label="কল দিন" icon={<Phone size={16}/>} onClick={() => window.open(`tel:${st.phone}`)} color="bg-slate-800 text-white"/>
                  <ActionBtn label="উপস্থিতি (WA)" icon={<QrCode size={16}/>} onClick={() => sendAttendanceWhatsApp(st)} color="bg-indigo-600 text-white col-span-2"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ভর্তি ফর্ম মডাল (বড় সাইজ ও স্ক্রলিং) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">নতুন স্টুডেন্ট ভর্তি ফরম</h2>
              <button onClick={() => setShowForm(false)}><X/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scroll">
              <div className="space-y-4">
                <FormInput label="নাম (Name)" name="name" placeholder="এম এস সাদী মিনার / এম এস ফাদি মিহাল" value={formData.name} onChange={setFormData} />
                <FormInput label="পিতার নাম (Father's Name)" name="father_name" placeholder="গিয়াস উদ্দিন" value={formData.father_name} onChange={setFormData} />
                <FormInput label="ঠিকানা (Address)" name="address" placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" value={formData.address} onChange={setFormData} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">লিঙ্গ (Gender)</label>
                    <select className="w-full p-4 bg-slate-100 rounded-2xl font-bold" onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option>ছাত্র</option><option>ছাত্রী</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">শ্রেণী (Class)</label>
                    <select className="w-full p-4 bg-slate-100 rounded-2xl font-bold" onChange={e => setFormData({...formData, class_name: e.target.value})}>
                      {CLASS_LIST.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="রোল নং (Roll)" name="roll" placeholder="যেমন: ১" value={formData.roll} onChange={setFormData} />
                  <FormInput label="মোবাইল নং (Phone)" name="phone" placeholder="যেমন: 017..." value={formData.phone} onChange={setFormData} />
                </div>

                <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-[2rem] border border-indigo-100">
                  <FormInput label="মাসিক বেতন" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={setFormData} />
                  <FormInput label="পরীক্ষা ফি" name="exam_fee" type="number" value={formData.exam_fee} onChange={setFormData} />
                  <FormInput label="অন্যান্য ফি" name="other_fee" type="number" value={formData.other_fee} onChange={setFormData} />
                  <FormInput label="পূর্বের বকেয়া" name="previous_dues" type="number" value={formData.previous_dues} onChange={setFormData} />
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex justify-between items-center">
                  <span className="font-bold">সর্বমোট বকেয়া:</span>
                  <span className="text-3xl font-black text-indigo-400">৳{totalDuesCalc}</span>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-all">তথ্য সেভ করুন</button>
            </form>
          </div>
        </div>
      )}

      {/* পেমেন্ট পরিশোধ মডাল */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-xl font-bold text-center">বকেয়া জমা দিন</h3>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400">ছাত্রের নাম</p>
              <h4 className="text-lg font-black">{selectedStudent?.name}</h4>
            </div>
            <input 
              type="number" 
              placeholder="টাকার পরিমাণ লিখুন" 
              className="w-full p-6 bg-slate-100 rounded-3xl text-center text-2xl font-black outline-none border-4 border-transparent focus:border-indigo-500"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowPayModal(false)} className="w-full p-4 font-bold text-slate-400">বাতিল</button>
              <button onClick={handlePayment} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-100">জমা দিন</button>
            </div>
          </div>
        </div>
      )}

      {/* বটম নেভিগেশন */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl z-40">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        <NavBtn icon={<QrCode/>} active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} />
        
        {/* ফুটার ডেভেলপার ইনফো */}
        <div className="flex flex-col items-center">
          <img src="/developer.jpg" alt="Developer" className="w-8 h-8 rounded-full border-2 border-indigo-600 object-cover" />
          <span className="text-[8px] font-bold text-indigo-700 mt-1">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </nav>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 0; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}

// ছোট কম্পোনেন্টস
function FormInput({label, name, value, onChange, placeholder, type = "text"}: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        className="w-full p-5 bg-slate-100 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-lg"
        onChange={e => onChange((prev: any) => ({...prev, [name]: e.target.value}))}
      />
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-3">
      <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}>{icon}</div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-xl font-black text-slate-800">{value}</h2>
      </div>
    </div>
  );
}

function ActionBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-3 rounded-2xl font-bold text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm`}>
      {icon} {label}
    </button>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 scale-110 shadow-inner' : 'text-slate-400'}`}>
      {React.cloneElement(icon, {size: 24, strokeWidth: active ? 3 : 2})}
    </button>
  );
}
