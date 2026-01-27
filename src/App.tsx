import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, QrCode, Plus, Landmark, 
  TrendingUp, TrendingDown, School, MapPin, PhoneCall, Copy, 
  FileX, Wallet, Trash2, Edit, CheckCircle, X, Search, BarChart3
} from 'lucide-react';

// বাংলা টাকার ফরম্যাট
const toBn = (n: any) => n?.toLocaleString('bn-BD') || "০";

// সম্পূর্ণ ক্লাস লিস্ট
const CLASS_LIST = [
  'প্লে', 'নার্সারি', 'কেজি', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', 
  '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ'
];

export default function SchoolApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState<any>({});
  
  // মডাল স্টেটস
  const [showForm, setShowForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');
  
  // সার্চ ফিল্টার
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('সব শ্রেণী');

  // ফরম ডাটা
  const [formData, setFormData] = useState({
    name: '', father_name: '', gender: 'ছাত্র', address: '', 
    class_name: 'প্লে', roll: '', phone: '', 
    monthly_fee: '', exam_fee: '', other_fee: '', previous_dues: ''
  });

  // ডাটা লোড
  useEffect(() => { loadAllData(); }, [activeTab]);

  const loadAllData = async () => {
    try {
      const [st, stat, tc] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/teachers').then(r => r.json())
      ]);
      setStudents(st); setStats(stat); setTeachers(tc);
    } catch (e) { console.error("Data Load Error"); }
  };

  // ইনপুট হ্যান্ডেল ও অটো ক্যালকুলেশন
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // মোট বকেয়া লাইভ ক্যালকুলেশন
  const totalDuesCalc = Number(formData.monthly_fee || 0) + Number(formData.exam_fee || 0) + Number(formData.other_fee || 0) + Number(formData.previous_dues || 0);

  // সাবমিট ফাংশন
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/students', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });
    setShowForm(false); 
    setFormData({ name: '', father_name: '', gender: 'ছাত্র', address: '', class_name: 'প্লে', roll: '', phone: '', monthly_fee: '', exam_fee: '', other_fee: '', previous_dues: '' });
    loadAllData();
  };

  // পেমেন্ট জমা (বকেয়া বিয়োগ)
  const handlePaymentSubmit = async () => {
    if (!selectedStudent || !payAmount) return;
    await fetch('/api/students/pay', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id: selectedStudent.id, amount: payAmount })
    });
    setShowPayModal(false); setPayAmount(''); loadAllData();
  };

  // ডিলিট ফাংশন
  const handleDelete = async (id: number) => {
    if(confirm('সতর্কতা: আপনি কি নিশ্চিত এই ছাত্রের সকল তথ্য মুছে ফেলতে চান?')) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      loadAllData();
    }
  };

  // --- স্পেশাল ম্যাসেজ কপি ফিচার ---

  const copyDuesMessage = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${toBn(st.dues)} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert('✅ বকেয়া ম্যাসেজ কপি হয়েছে!');
  };

  const copyAbsentMessage = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ`;
    navigator.clipboard.writeText(msg);
    alert('✅ অনুপস্থিতি ম্যাসেজ কপি হয়েছে!');
  };

  // ফিল্টারিং
  const filteredStudents = students.filter((s:any) => 
    (selectedClass === 'সব শ্রেণী' || s.class_name === selectedClass) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-36 font-sans text-slate-900">
      
      {/* ১. হেডার সেকশন */}
      <header className="bg-[#1E3A8A] text-white p-6 pt-10 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="bg-yellow-400 w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-blue-900 border-4 border-white/20 shadow-lg">
            <School size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
          <div className="flex items-center justify-center gap-2 mt-2 opacity-90">
            <MapPin size={14} className="text-yellow-400" />
            <p className="text-xs font-bold">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 -mt-6 relative z-10">
        
        {/* ২. ড্যাশবোর্ড (AI Analytics UI) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {/* স্ট্যাটাস কার্ড */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard title="ছাত্র বকেয়া" value={stats.total_dues} icon={<Landmark/>} color="text-orange-600" bg="bg-orange-50"/>
              <StatCard title="আজকের আদায়" value={stats.today_collection} icon={<TrendingUp/>} color="text-emerald-600" bg="bg-emerald-50"/>
              <StatCard title="শিক্ষক বকেয়া" value={stats.total_teacher_dues} icon={<Users/>} color="text-rose-600" bg="bg-rose-50"/>
              <StatCard title="মোট খরচ" value={stats.total_expense} icon={<TrendingDown/>} color="text-blue-600" bg="bg-blue-50"/>
            </div>

            {/* অটোমেশন বাটন */}
            <div className="bg-white p-5 rounded-[2rem] shadow-sm space-y-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-blue-600"/>
                <h3 className="font-black text-slate-700">অটো-বিলিং সিস্টেম</h3>
              </div>
              <button onClick={() => { if(confirm('সবার মাসিক ফি যোগ হবে?')) fetch('/api/billing/auto', {method:'POST'}).then(loadAllData) }} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">
                রান অটো-বিলিং (ছাত্র)
              </button>
              <button onClick={() => { if(confirm('শিক্ষক বেতন জেনারেট হবে?')) fetch('/api/teachers/salary', {method:'POST'}).then(loadAllData) }} 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">
                রান অটো-স্যালারি (শিক্ষক)
              </button>
            </div>
          </div>
        )}

        {/* ৩. স্টুডেন্ট লিস্ট ও কার্ড */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* সার্চ বার */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm space-y-3 sticky top-4 z-30 border border-slate-100">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                <input 
                  type="text" placeholder="নাম বা রোল দিয়ে খুঁজুন..." 
                  className="w-full pl-12 p-3 bg-slate-50 rounded-xl font-bold text-sm outline-none focus:ring-2 ring-blue-100"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none w-1/2" onChange={(e) => setSelectedClass(e.target.value)}>
                  <option>সব শ্রেণী</option>
                  {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white w-1/2 rounded-xl font-black text-xs flex items-center justify-center gap-1 shadow-lg shadow-blue-200">
                  <Plus size={16}/> নতুন ভর্তি
                </button>
              </div>
            </div>

            {/* স্টুডেন্ট কার্ডস */}
            {filteredStudents.map((st:any) => (
              <div key={st.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center font-black text-lg border-2 border-blue-100 shadow-sm">{st.roll}</div>
                    <div>
                      <h3 className="font-black text-lg leading-tight text-slate-800">{st.name}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-1">শ্রেণী: {st.class_name} | মোবা: {st.phone}</p>
                    </div>
                  </div>
                  {/* এডিট ও ডিলিট বাটন */}
                  <div className="flex gap-2">
                    <button className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(st.id)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="bg-rose-50 p-4 rounded-2xl flex justify-between items-center mb-4 border border-rose-100">
                  <span className="text-[11px] font-black text-rose-500 uppercase tracking-wide">মোট বকেয়া</span>
                  <span className="text-2xl font-black text-rose-600">৳{toBn(st.dues)}</span>
                </div>

                {/* ৪টি অ্যাকশন বাটন */}
                <div className="grid grid-cols-2 gap-2.5">
                  <ActionBtn 
                    label="বকেয়া পরিশোধ" 
                    icon={<CheckCircle size={14}/>} 
                    color="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    onClick={() => { setSelectedStudent(st); setShowPayModal(true); }}
                  />
                  <ActionBtn 
                    label="বকেয়া কপি" 
                    icon={<Copy size={14}/>} 
                    color="bg-orange-100 text-orange-700 hover:bg-orange-200"
                    onClick={() => copyDuesMessage(st)}
                  />
                  <ActionBtn 
                    label="অনুপস্থিতি কপি" 
                    icon={<FileX size={14}/>} 
                    color="bg-rose-100 text-rose-700 hover:bg-rose-200"
                    onClick={() => copyAbsentMessage(st)}
                  />
                  <ActionBtn 
                    label="কল দিন" 
                    icon={<PhoneCall size={14}/>} 
                    color="bg-slate-800 text-white hover:bg-black" 
                    onClick={() => window.open(`tel:${st.phone}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ৪. শিক্ষক স্যালারি ম্যানেজমেন্ট */}
        {activeTab === 'teachers' && (
           <div className="space-y-4">
              {teachers.map((t:any) => (
                <div key={t.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-black text-lg text-slate-800">{t.name}</h3>
                       <p className="text-xs font-bold text-slate-400 mt-1">{t.designation}</p>
                     </div>
                     <div className="bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-600">ID: {t.id}</div>
                   </div>
                   <div className="mt-4 bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400">বকেয়া বেতন</span>
                      <span className="font-black text-xl text-rose-600">৳{toBn(t.salary_dues)}</span>
                   </div>
                   <button className="w-full mt-4 py-3 bg-slate-800 text-white rounded-xl font-bold text-xs active:scale-95 transition-all">বেতন পরিশোধ করুন</button>
                </div>
              ))}
           </div>
        )}

        {/* ৫. QR হাজিরা (Premium UI) */}
        {activeTab === 'qr' && (
          <div className="bg-white h-[60vh] rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
             <div className="bg-slate-50 p-6 rounded-3xl mb-6 ring-4 ring-blue-50">
                <QrCode size={120} className="text-slate-800"/>
             </div>
             <h2 className="text-2xl font-black text-slate-800">QR হাজিরা স্ক্যানার</h2>
             <p className="text-xs font-bold text-slate-400 mt-2 max-w-[200px]">শিক্ষার্থীর আইডি কার্ডের QR কোড স্ক্যান করতে নিচের বাটনে ক্লিক করুন</p>
             <button className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-95 transition-all">ক্যামেরা চালু করুন</button>
          </div>
        )}

      </main>

      {/* পপআপ ১: ভর্তি ফর্ম (জলছাপ ও ক্যালকুলেশন সহ) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 max-h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-5 right-5 bg-slate-100 p-2 rounded-full text-slate-500"><X size={20}/></button>
            <h2 className="text-xl font-black text-blue-600 mb-6 flex items-center gap-2"><Plus className="bg-blue-100 p-1 rounded-lg"/> নতুন ভর্তি ফরম</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" value={formData.name} placeholder="এম এস সাদী মিনার / এম এস ফাদি মিহাল" className="input-field" onChange={handleInputChange} required />
              <input name="father_name" value={formData.father_name} placeholder="গিয়াস উদ্দিন" className="input-field" onChange={handleInputChange} required />
              
              <div className="grid grid-cols-2 gap-3">
                <select name="gender" className="input-field" onChange={handleInputChange}>
                  <option>ছাত্র</option><option>ছাত্রী</option>
                </select>
                <input name="phone" value={formData.phone} placeholder="মোবাইল নং" className="input-field" onChange={handleInputChange} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select name="class_name" className="input-field" onChange={handleInputChange}>
                  {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="roll" value={formData.roll} placeholder="রোল নং" className="input-field" onChange={handleInputChange} required />
              </div>

              <textarea name="address" value={formData.address} placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" className="input-field h-20 pt-3 resize-none" onChange={handleInputChange}></textarea>
              
              <div className="bg-blue-50 p-4 rounded-2xl space-y-2 border border-blue-100">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">ফি তথ্য (টাকা)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" name="monthly_fee" value={formData.monthly_fee} placeholder="মাসিক বেতন" className="input-field bg-white" onChange={handleInputChange} />
                  <input type="number" name="exam_fee" value={formData.exam_fee} placeholder="পরীক্ষা ফি" className="input-field bg-white" onChange={handleInputChange} />
                  <input type="number" name="other_fee" value={formData.other_fee} placeholder="অন্যান্য ফি" className="input-field bg-white" onChange={handleInputChange} />
                  <input type="number" name="previous_dues" value={formData.previous_dues} placeholder="পূর্বের বকেয়া" className="input-field bg-white" onChange={handleInputChange} />
                </div>
              </div>

              {/* অটো ক্যালকুলেটেড মোট বকেয়া */}
              <div className="bg-slate-800 text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
                 <span className="font-bold text-sm text-slate-300">সর্বমোট বকেয়া:</span>
                 <span className="font-black text-2xl">৳{toBn(totalDuesCalc)}</span>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 mt-2 active:scale-95 transition-all">তথ্য সংরক্ষণ করুন</button>
            </form>
          </div>
        </div>
      )}

      {/* পপআপ ২: পেমেন্ট মডাল */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={32}/>
              </div>
              <h3 className="text-xl font-black mb-1 text-slate-800">{selectedStudent?.name}</h3>
              <p className="text-xs font-bold text-rose-500 mb-6 bg-rose-50 inline-block px-3 py-1 rounded-full">বর্তমান বকেয়া: ৳{toBn(selectedStudent?.dues)}</p>
              
              <input 
                type="number" 
                placeholder="টাকার পরিমাণ লিখুন" 
                className="w-full text-center text-3xl font-black p-4 bg-slate-100 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all mb-6 placeholder:text-2xl"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                autoFocus
              />
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowPayModal(false)} className="py-3.5 rounded-xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200">বাতিল</button>
                <button onClick={handlePaymentSubmit} className="py-3.5 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-200 active:scale-95 transition-all">জমা দিন</button>
              </div>
           </div>
        </div>
      )}

      {/* ৬. ফুটার (ছবি সহ) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-4 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-between items-center max-w-md mx-auto">
          
          {/* ডেভেলপার ইনফো (ছবিসহ) */}
          <div className="flex items-center gap-3">
            {/* আপনার ছবি এখানে আসবে */}
            <img src="/developer.jpg" alt="Dev" className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover shadow-sm"/> 
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Developed By</span>
              <span className="text-xs font-black text-blue-700">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
            </div>
          </div>

          {/* নেভিগেশন আইকন */}
          <div className="flex gap-5 bg-slate-100 px-5 py-2.5 rounded-3xl">
             <TabBtn active={activeTab==='dashboard'} icon={<LayoutDashboard/>} onClick={()=>setActiveTab('dashboard')}/>
             <TabBtn active={activeTab==='students'} icon={<Users/>} onClick={()=>setActiveTab('students')}/>
             <TabBtn active={activeTab==='teachers'} icon={<UserCheck/>} onClick={()=>setActiveTab('teachers')}/>
             <TabBtn active={activeTab==='qr'} icon={<QrCode/>} onClick={()=>setActiveTab('qr')}/>
          </div>
        </div>
      </footer>

      <style>{`
        .input-field { @apply w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm; }
        /* Chrome Scrollbar Hide */
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ছোট কম্পোনেন্টস
function StatCard({title, value, icon, color, bg}: any) {
  return (
    <div className={`p-5 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 ${bg} border border-white shadow-sm transition-transform active:scale-95`}>
      <div className={`${color} bg-white p-2 rounded-full shadow-sm`}>{icon}</div>
      <div className="text-center">
        <p className="text-[10px] font-black opacity-60 uppercase tracking-tight">{title}</p>
        <h3 className={`text-xl font-black ${color}`}>৳{toBn(value)}</h3>
      </div>
    </div>
  )
}

function ActionBtn({label, icon, color, onClick}: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl font-bold text-[9px] uppercase shadow-sm active:scale-95 transition-all ${color}`}>
      {icon} <span className="tracking-tighter">{label}</span>
    </button>
  )
}

function TabBtn({active, icon, onClick}: any) {
  return <button onClick={onClick} className={`${active ? 'text-blue-600 scale-110' : 'text-slate-400'} transition-all`}>{React.cloneElement(icon, {size: 20, strokeWidth: active?3:2.5})}</button>
}
