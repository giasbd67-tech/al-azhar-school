import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, QrCode, CreditCard, UserCheck, BarChart, Settings, Search
} from 'lucide-react';
import QRCode from 'react-qr-code';

// ১. শ্রেণী তালিকা (প্লে থেকে দ্বাদশ)
const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];

export default function SmartSchoolOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  // ফরম স্টেট (জলছাপ ও বড় বক্সের জন্য)
  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  // ২. অটো ক্যালকুলেশন লজিক
  const totalDuesCalc = Number(formData.monthly_fee) + Number(formData.exam_fee) + Number(formData.other_fee) + Number(formData.previous_dues);

  // ৩. হোয়াটসঅ্যাপ ম্যাসেজ লজিক (সালাম সহ)
  const sendAttendanceWA = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত হয়েছে। আমাদের উপর আস্থা রাখার জন্য ধন্যবাদ।`;
    window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ৪. বকেয়া কপি ম্যাসেজ
  const copyDuesMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${st.total_due} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('বকেয়া ম্যাসেজ কপি হয়েছে!');
  };

  // ৫. অনুপস্থিতি কপি ম্যাসেজ
  const copyAbsentMsg = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ`;
    navigator.clipboard.writeText(msg);
    alert('অনুপস্থিতি ম্যাসেজ কপি হয়েছে!');
  };

  // ৬. পেমেন্ট জমা লজিক (বকেয়া থেকে বিয়োগ)
  const handlePayment = () => {
    if (!selectedStudent || !payAmount) return;
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent.id) {
        return { ...s, total_due: Number(s.total_due) - Number(payAmount) };
      }
      return s;
    });
    setStudents(updatedStudents);
    setShowPayModal(false);
    setPayAmount('');
    alert('পেমেন্ট সফলভাবে জমা হয়েছে!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* হেডার ও লোগো */}
      <header className="bg-indigo-900 text-white p-6 rounded-b-[3rem] shadow-2xl">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-white/20" />
          <div>
            <h1 className="text-xl font-black">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest">Smart School Operating System</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in">
            <StatCard title="মোট ছাত্র" value={students.length} icon={<Users/>} color="bg-blue-500"/>
            <StatCard title="মোট বকেয়া" value={`৳${students.reduce((a,b) => a + Number(b.total_due), 0)}`} icon={<CreditCard/>} color="bg-rose-500"/>
            <StatCard title="শিক্ষক স্যালারি" value="১২টি ফিচার" icon={<UserCheck/>} color="bg-emerald-500"/>
            <StatCard title="AI এনালাইটিক্স" value="অ্যাক্টিভ" icon={<BarChart/>} color="bg-amber-500"/>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl">
              <Plus size={24}/> নতুন স্টুডেন্ট ভর্তি
            </button>

            {students.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-indigo-50 p-2 rounded-2xl border border-indigo-100">
                      <QRCode value={`st:${st.id}`} size={60} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-800">{st.name}</h3>
                      <p className="text-xs font-bold text-slate-400">রোল: {st.roll} | শ্রেণী: {st.class_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-100 rounded-full text-indigo-600"><Edit size={18}/></button>
                    <button onClick={() => setStudents(students.filter(s => s.id !== st.id))} className="p-2 bg-slate-100 rounded-full text-rose-600"><Trash2 size={18}/></button>
                  </div>
                </div>

                <div className="bg-rose-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-rose-600">মোট বকেয়া:</span>
                  <span className="text-2xl font-black text-rose-700">৳{st.total_due}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn label="বকেয়া কপি" icon={<Copy size={16}/>} onClick={() => copyDuesMsg(st)} color="bg-amber-100 text-amber-700"/>
                  <ActionBtn label="বকেয়া পরিশোধ" icon={<CreditCard size={16}/>} onClick={() => {setSelectedStudent(st); setShowPayModal(true)}} color="bg-emerald-100 text-emerald-700"/>
                  <ActionBtn label="অনুপস্থিতি কপি" icon={<X size={16}/>} onClick={() => copyAbsentMsg(st)} color="bg-rose-100 text-rose-700"/>
                  <ActionBtn label="কল দিন" icon={<Phone size={16}/>} onClick={() => window.open(`tel:${st.phone}`)} color="bg-slate-800 text-white"/>
                  <ActionBtn label="উপস্থিতি (WhatsApp)" icon={<QrCode size={16}/>} onClick={() => sendAttendanceWA(st)} color="bg-indigo-600 text-white col-span-2 py-4"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ভর্তি ফরম মডাল (বড় সাইজ ও স্ক্রল) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h2 className="text-xl font-black">নতুন স্টুডেন্ট ভর্তি ফরম</h2>
              <button onClick={() => setShowForm(false)}><X/></button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto pb-10 custom-scroll">
              <FormInput label="নাম (Name)" name="name" placeholder="এম এস সাদী মিনার / এম এস ফাদি মিহাল" value={formData.name} onChange={setFormData} />
              <FormInput label="পিতার নাম (Father's Name)" name="father_name" placeholder="গিয়াস উদ্দিন" value={formData.father_name} onChange={setFormData} />
              <FormInput label="ঠিকানা (Address)" name="address" placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" value={formData.address} onChange={setFormData} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">লিঙ্গ (Gender)</label>
                  <select className="w-full p-5 bg-slate-100 rounded-2xl font-bold appearance-none" onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>ছাত্র</option><option>ছাত্রী</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">শ্রেণী (Class)</label>
                  <select className="w-full p-5 bg-slate-100 rounded-2xl font-bold appearance-none" onChange={e => setFormData({...formData, class_name: e.target.value})}>
                    {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="রোল নং (Roll)" name="roll" placeholder="যেমন: ১" value={formData.roll} onChange={setFormData} />
                <FormInput label="মোবাইল নং (Phone)" name="phone" placeholder="যেমন: 017..." value={formData.phone} onChange={setFormData} />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100">
                <FormInput label="মাসিক বেতন" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={setFormData} />
                <FormInput label="পরীক্ষা ফি" name="exam_fee" type="number" value={formData.exam_fee} onChange={setFormData} />
                <FormInput label="অন্যান্য ফি" name="other_fee" type="number" value={formData.other_fee} onChange={setFormData} />
                <FormInput label="পূর্বের বকেয়া" name="previous_dues" type="number" value={formData.previous_dues} onChange={setFormData} />
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] flex justify-between items-center shadow-lg border-b-4 border-indigo-500">
                <span className="font-bold">সর্বমোট বকেয়া:</span>
                <span className="text-3xl font-black text-indigo-400">৳{totalDuesCalc}</span>
              </div>

              <button 
                onClick={() => {
                  setStudents([...students, { ...formData, id: Date.now(), total_due: totalDuesCalc }]);
                  setShowForm(false);
                }}
                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl mt-4"
              >
                তথ্য সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* পেমেন্ট পরিশোধ মডাল */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-center">বকেয়া জমা নিন</h3>
            <input 
              type="number" 
              placeholder="টাকার পরিমাণ" 
              className="w-full p-6 bg-slate-100 rounded-3xl text-center text-3xl font-black outline-none border-4 border-transparent focus:border-indigo-500"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowPayModal(false)} className="w-full p-4 font-bold text-slate-400">বাতিল</button>
              <button onClick={handlePayment} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold">জমা দিন</button>
            </div>
          </div>
        </div>
      )}

      {/* ফুটার ব্র্যান্ডিং ও নেভিগেশন */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl z-40">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        
        {/* অ্যাপ ডেভেলপার: গিয়াস উদ্দিন */}
        <div className="flex flex-col items-center">
          <img src="/developer.jpg" alt="Dev" className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover shadow-md" />
          <span className="text-[10px] font-black text-indigo-700 mt-1">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </nav>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 0; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}

// কম্পোনেন্টস
function FormInput({label, name, value, onChange, placeholder, type = "text"}: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        className="w-full p-5 bg-slate-100 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-500 outline-none text-lg shadow-inner transition-all"
        onChange={e => onChange((prev: any) => ({...prev, [name]: e.target.value}))}
      />
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>{icon}</div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase">{title}</p>
        <h2 className="text-xl font-black text-slate-800">{value}</h2>
      </div>
    </div>
  );
}

function ActionBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-4 rounded-2xl font-black text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm`}>
      {icon} {label}
    </button>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 scale-110 shadow-inner' : 'text-slate-400'}`}>
      {React.cloneElement(icon as React.ReactElement, {size: 26})}
    </button>
  );
}
