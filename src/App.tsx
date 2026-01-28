import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, QrCode, CreditCard, UserCheck, 
  BarChart, MessageSquare, FileText, Download, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

// ১. কনফিগারেশন
const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];
const API_URL = "http://localhost:3000/api"; // আপনার সার্ভার ইউআরএল

export default function AlAzharSmartOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // মার্কশিট স্টেট
  const [markSheetData, setMarkSheetData] = useState({ name: '', subjects: [{ name: 'বাংলা', marks: 0 }, { name: 'ইংরেজি', marks: 0 }] });

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  const [tData, setTData] = useState({ name: '', designation: '', salary: '0', phone: '' });

  // --- ডাটাবেজ থেকে তথ্য লোড করা ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stRes = await fetch(`${API_URL}/students`);
      const stData = await stRes.json();
      setStudents(Array.isArray(stData) ? stData : []);

      const tRes = await fetch(`${API_URL}/teachers`);
      const tData = await tRes.json();
      setTeachers(Array.isArray(tData) ? tData : []);
    } catch (err) {
      console.error("ডাটা লোড করতে সমস্যা:", err);
    }
  };

  // --- ডাটাবেজে স্টুডেন্ট সেভ করা ---
  const handleSaveStudent = async () => {
    const studentWithTotal = {
      ...formData,
      total_dues: Number(formData.monthly_fee) + Number(formData.exam_fee) + 
                  Number(formData.other_fee) + Number(formData.previous_dues)
    };

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentWithTotal),
      });
      if (response.ok) {
        const newData = await response.json();
        setStudents([newData, ...students]);
        setShowForm(false);
        alert("ডাটাবেজে সফলভাবে সেভ হয়েছে!");
      }
    } catch (error) {
      alert("সেভ করতে সমস্যা হয়েছে!");
    }
  };

  // ৩. অটো ক্যালকুলেশন (ডিসপ্লে’র জন্য)
  const totalDuesCalc = Number(formData.monthly_fee) + Number(formData.exam_fee) + 
                       Number(formData.other_fee) + Number(formData.previous_dues);

  const calculateGrade = (m: number) => {
    if (m >= 80) return { g: 'A+', c: 'text-green-600' };
    if (m >= 33) return { g: 'Pass', c: 'text-blue-600' };
    return { g: 'F', c: 'text-red-600' };
  };

  const sendWA = (st: any, type: string) => {
    let msg = "";
    if (type === 'att') msg = `আসসালামু আলাইকুম, আপনার সন্তান ${st.name} আজ স্কুলে উপস্থিত হয়েছে। ধন্যবাদ।`;
    if (type === 'due') msg = `আসসালামু আলাইকুম, আপনার সন্তান ${st.name}-এর মোট বকেয়া ${st.total_dues} টাকা। দ্রুত পরিশোধের অনুরোধ রইল।`;
    window.open(`https://wa.me/88${st.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans overflow-x-hidden">
      {/* হেডার */}
      <header className="bg-[#1E3A8A] text-white p-8 rounded-b-[3.5rem] shadow-2xl relative">
        <div className="flex items-center gap-5 max-w-5xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" />
          <div>
            <h1 className="text-xl font-black">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Smart School OS • Gias Uddin Edition</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* ড্যাশবোর্ড */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-4 mt-[-40px]">
            <StatCard title="শিক্ষার্থী" value={students.length} icon={<Users/>} color="bg-blue-600" />
            <StatCard title="মোট বকেয়া" value={`৳${students.reduce((a,b)=>a+Number(b.total_dues || 0),0)}`} icon={<CreditCard/>} color="bg-rose-600" />
            <StatCard title="শিক্ষক স্যালারি" value={`৳${teachers.reduce((a,b)=>a+Number(b.salary || 0),0)}`} icon={<UserCheck/>} color="bg-emerald-600" />
            <StatCard title="AI রিপোর্ট" value="Active" icon={<BarChart/>} color="bg-amber-600" />
          </div>
        )}

        {/* শিক্ষার্থী ট্যাব */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="w-full bg-[#1E3A8A] text-white p-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-lg">
              <Plus/> নতুন ভর্তি
            </button>
            {students.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl border"><QRCode value={`STUDENT-${st.id}`} size={50} /></div>
                    <div>
                      <h3 className="font-black text-slate-800">{st.name}</h3>
                      <p className="text-xs font-bold text-slate-400">শ্রেণী: {st.class_name} | রোল: {st.roll}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-rose-400">বকেয়া</p>
                     <p className="font-black text-rose-600 text-lg">৳{st.total_dues}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ActionBtn label="বকেয়া SMS" icon={<MessageSquare size={16}/>} onClick={() => sendWA(st, 'due')} color="bg-amber-50 text-amber-700" />
                  <ActionBtn label="হাজিরা (WA)" icon={<QrCode size={16}/>} onClick={() => sendWA(st, 'att')} color="bg-blue-600 text-white flex-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* শিক্ষক ট্যাব ও মার্কশিট ট্যাব আপনার আগের কোড অনুযায়ী কাজ করবে... */}
        {/* (সংক্ষিপ্ত করার জন্য মাঝখানের UI অংশটুকু আগের মতোই থাকবে) */}
        
        {activeTab === 'teachers' && (
          <div className="space-y-4">
            <button onClick={() => setShowTeacherForm(true)} className="w-full bg-emerald-600 text-white p-5 rounded-3xl font-black flex items-center justify-center gap-2">
              <Plus/> শিক্ষক নিয়োগ
            </button>
            {teachers.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black">{t.name[0]}</div>
                  <div>
                    <h4 className="font-black">{t.name}</h4>
                    <p className="text-[10px] uppercase font-bold text-slate-400">{t.designation}</p>
                  </div>
                </div>
                <h4 className="font-black text-emerald-600">৳{t.salary}</h4>
              </div>
            ))}
          </div>
        )}

        {/* মার্কশিট জেনারেটর (আগের মতোই) */}
        {activeTab === 'marksheet' && (
           <div className="space-y-6">
             {/* ... মার্কশিট কোড ... */}
             <div className="bg-white p-8 rounded-[3rem] shadow-sm space-y-4">
               <h2 className="text-xl font-black flex items-center gap-2"><FileText className="text-blue-600"/> মার্কশিট জেনারেটর</h2>
               <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="ছাত্রের নাম" onChange={e => setMarkSheetData({...markSheetData, name: e.target.value})} />
               {markSheetData.subjects.map((sub, i) => (
                 <div key={i} className="flex gap-2">
                   <input className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none" placeholder="বিষয়" value={sub.name} onChange={e => {
                     const s = [...markSheetData.subjects]; s[i].name = e.target.value; setMarkSheetData({...markSheetData, subjects: s});
                   }} />
                   <input type="number" className="w-20 p-4 bg-blue-50 rounded-2xl outline-none text-center font-black" placeholder="মা" onChange={e => {
                     const s = [...markSheetData.subjects]; s[i].marks = Number(e.target.value); setMarkSheetData({...markSheetData, subjects: s});
                   }} />
                 </div>
               ))}
               <button onClick={() => setMarkSheetData({...markSheetData, subjects: [...markSheetData.subjects, {name: '', marks: 0}]})} className="text-blue-600 font-bold text-sm">+ বিষয় যোগ করুন</button>
            </div>
            {markSheetData.name && (
              <div className="bg-slate-900 text-white p-8 rounded-[3rem] space-y-4 shadow-2xl border-b-8 border-blue-600">
                <h3 className="text-center font-black text-xl underline">{markSheetData.name} - এর মার্কশিট</h3>
                {markSheetData.subjects.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-white/10 pb-2">
                    <span>{s.name}</span>
                    <span className={`font-black ${calculateGrade(s.marks).c}`}>{s.marks} ({calculateGrade(s.marks).g})</span>
                  </div>
                ))}
                <button onClick={() => window.print()} className="w-full bg-blue-600 p-4 rounded-2xl font-black mt-4 flex items-center justify-center gap-2"><Download size={18}/> ডাউনলোড</button>
              </div>
            )}
           </div>
        )}
      </main>

      {/* ভর্তি ফরম মডাল */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end">
            <div className="bg-white w-full h-[90vh] rounded-t-[4rem] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-8 bg-[#1E3A8A] text-white flex justify-between items-center shrink-0">
                <h2 className="text-xl font-black tracking-tight">নতুন শিক্ষার্থী ভর্তি</h2>
                <button onClick={() => setShowForm(false)} className="p-2 bg-white/20 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scroll pb-20">
                <Input label="নাম (Name)" placeholder="এম এস সাদী মিনার" onChange={(v:any) => setFormData({...formData, name: v})} />
                <Input label="পিতার নাম" placeholder="গিয়াস উদ্দিন" onChange={(v:any) => setFormData({...formData, father_name: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="শ্রেণী" options={CLASS_LIST} onChange={(v:any) => setFormData({...formData, class_name: v})} />
                  <Input label="রোল" placeholder="১" onChange={(v:any) => setFormData({...formData, roll: v})} />
                </div>
                <Input label="মোবাইল" placeholder="017..." onChange={(v:any) => setFormData({...formData, phone: v})} />
                
                <div className="bg-blue-50 p-6 rounded-[2.5rem] space-y-4">
                  <p className="text-center font-black text-[#1E3A8A] text-xs uppercase tracking-widest">বেতন ও ফিস</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="মাসিক বেতন" type="number" onChange={(v:any) => setFormData({...formData, monthly_fee: v})} />
                    <Input label="পরীক্ষা ফি" type="number" onChange={(v:any) => setFormData({...formData, exam_fee: v})} />
                    <Input label="অন্যান্য ফি" type="number" onChange={(v:any) => setFormData({...formData, other_fee: v})} />
                    <Input label="পূর্বের বকেয়া" type="number" onChange={(v:any) => setFormData({...formData, previous_dues: v})} />
                  </div>
                </div>
                <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex justify-between items-center">
                  <span className="font-bold opacity-60 text-sm">সর্বমোট বকেয়া:</span>
                  <span className="text-3xl font-black text-blue-400">৳{totalDuesCalc}</span>
                </div>
                <button onClick={handleSaveStudent} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all">তথ্য সেভ করুন</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ফুটার নেভিগেশন */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t p-4 flex justify-around items-center rounded-t-[3rem] shadow-2xl z-[100]">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        <NavBtn icon={<UserCheck/>} active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
        <NavBtn icon={<FileText/>} active={activeTab === 'marksheet'} onClick={() => setActiveTab('marksheet')} />
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 overflow-hidden shadow-md">
            <img src="/developer.jpg" alt="Dev" className="w-full h-full object-cover" />
          </div>
          <span className="text-[8px] font-black text-blue-900 mt-1 uppercase">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </nav>

      <style>{`.custom-scroll::-webkit-scrollbar { width: 0; }`}</style>
    </div>
  );
}

// রিইউজেবল কম্পোনেন্টস (আগের মতোই)
function Input({label, placeholder, value, onChange, type="text"}: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      <input type={type} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold shadow-inner" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function Select({label, options, onChange}: any) {
  return (
    <div className="space-y-1 flex-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{label}</label>
      <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none appearance-none" onChange={e => onChange(e.target.value)}>
        {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
      <div className={`${color} p-3 rounded-xl text-white`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase">{title}</p>
        <h2 className="text-lg font-black">{value}</h2>
      </div>
    </div>
  );
}

function ActionBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-3 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all`}>
      {icon} {label}
    </button>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-blue-50 text-blue-700 scale-110' : 'text-slate-300'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 28 })}
    </button>
  );
}
