import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, QrCode, CreditCard, UserCheck, 
  BarChart, MessageSquare, FileText, Download, Camera, Printer, Search, Contact
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

// কনফিগারেশন
const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];
const API_URL = "http://localhost:3000/api";

export default function AlAzharSmartOS() {
  // ১. সকল স্টেট (States)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);

  // সার্চ ও ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('সবগুলো');

  // ভর্তি ফরম স্টেট
  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  // ২. ডাটা লোড করা
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const stRes = await fetch(`${API_URL}/students`);
      const stData = await stRes.json();
      setStudents(Array.isArray(stData) ? stData : []);
      const tRes = await fetch(`${API_URL}/teachers`);
      const tData = await tRes.json();
      setTeachers(Array.isArray(tData) ? tData : []);
    } catch (err) { console.error("ডাটা লোড করতে সমস্যা:", err); }
  };

  // ৩. সার্চ ও ফিল্টার লজিক
  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) || st.roll.toString().includes(searchTerm);
    const matchesClass = selectedClass === 'সবগুলো' || st.class_name === selectedClass;
    return matchesSearch && matchesClass;
  });

  // ৪. পেমেন্ট হ্যান্ডলার
  const handlePayment = async () => {
    if (!payAmount || Number(payAmount) <= 0) return alert("সঠিক পরিমাণ লিখুন");
    try {
      const res = await fetch(`${API_URL}/students/${selectedStudent.id}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(payAmount) }),
      });
      if (res.ok) {
        await fetchData(); 
        setShowPayModal(false);
        setShowReceipt(true); 
      }
    } catch (err) { alert("পেমেন্ট আপডেট করতে সমস্যা হয়েছে"); }
  };

  const handleSaveStudent = async () => {
    const total = Number(formData.monthly_fee) + Number(formData.exam_fee) + 
                  Number(formData.other_fee) + Number(formData.previous_dues);
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, total_dues: total }),
      });
      if (res.ok) { fetchData(); setShowForm(false); alert("ভর্তি সফল হয়েছে!"); }
    } catch (error) { alert("সমস্যা হয়েছে!"); }
  };

  const totalDuesCalc = Number(formData.monthly_fee) + Number(formData.exam_fee) + 
                       Number(formData.other_fee) + Number(formData.previous_dues);

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
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-4 mt-[-40px]">
            <StatCard title="শিক্ষার্থী" value={students.length} icon={<Users/>} color="bg-blue-600" />
            <StatCard title="মোট বকেয়া" value={`৳${students.reduce((a,b)=>a+Number(b.total_dues || 0),0)}`} icon={<CreditCard/>} color="bg-rose-600" />
            <StatCard title="শিক্ষক স্যালারি" value={`৳${teachers.reduce((a,b)=>a+Number(b.salary || 0),0)}`} icon={<UserCheck/>} color="bg-emerald-600" />
            <StatCard title="AI রিপোর্ট" value="Active" icon={<BarChart/>} color="bg-amber-600" />
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="w-full bg-[#1E3A8A] text-white p-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-lg mb-2">
              <Plus/> নতুন ভর্তি
            </button>

            {/* সার্চ বার */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center px-4">
                <Search size={18} className="text-slate-400 mr-2" />
                <input type="text" placeholder="নাম বা রোল..." className="w-full bg-transparent outline-none font-bold text-sm h-10" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="bg-white px-4 rounded-2xl shadow-sm border border-slate-100 font-bold text-xs outline-none" onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="সবগুলো">সব ক্লাস</option>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* স্টুডেন্ট লিস্ট */}
            <div className="grid gap-4">
              {filteredStudents.map((st) => (
                <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-slate-50 rounded-xl border"><QRCode value={`ST-ID-${st.id}`} size={45} /></div>
                      <div>
                        <h3 className="font-black text-slate-800">{st.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">রোল: {st.roll} • {st.class_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-rose-400">বকেয়া</p>
                      <p className="font-black text-rose-600 text-lg">৳{st.total_dues}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ActionBtn label="টাকা জমা" icon={<CreditCard size={14}/>} onClick={() => {setSelectedStudent(st); setShowPayModal(true);}} color="bg-emerald-600 text-white flex-1" />
                    <ActionBtn label="ID কার্ড" icon={<Contact size={14}/>} onClick={() => {setSelectedStudent(st); setShowIDCard(true);}} color="bg-blue-100 text-blue-700" />
                    <ActionBtn label="SMS" icon={<MessageSquare size={14}/>} onClick={() => {}} color="bg-amber-100 text-amber-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* আইডি কার্ড জেনারেটর মডাল */}
      <AnimatePresence>
        {showIDCard && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/95 z-[500] flex items-center justify-center p-6 backdrop-blur-md">
            <div className="w-full max-w-sm flex flex-col items-center">
              <button onClick={() => setShowIDCard(false)} className="self-end mb-4 p-3 bg-white/10 text-white rounded-full"><X/></button>
              
              {/* আইডি কার্ড ডিজাইন */}
              <div id="id-card-print" className="bg-white w-[300px] h-[480px] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative border-4 border-blue-900">
                <div className="bg-blue-900 h-24 flex flex-col items-center justify-center p-4 text-center">
                  <h2 className="text-white font-black text-sm leading-tight">আল-আজহার ইন্টারন্যাশনাল স্কুল</h2>
                  <p className="text-blue-300 text-[8px] font-bold uppercase tracking-widest mt-1">Identity Card</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center p-6 space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border-4 border-slate-50 shadow-md flex items-center justify-center overflow-hidden">
                    <Users size={40} className="text-slate-300"/>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-800">{selectedStudent?.name}</h3>
                    <p className="text-blue-600 font-bold text-xs uppercase">{selectedStudent?.class_name}</p>
                  </div>

                  <div className="w-full space-y-2 bg-slate-50 p-4 rounded-2xl">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-400">Roll No:</span>
                      <span className="text-slate-800">{selectedStudent?.roll}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-400">Father:</span>
                      <span className="text-slate-800">{selectedStudent?.father_name}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-400">Contact:</span>
                      <span className="text-slate-800">{selectedStudent?.phone}</span>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-white border-2 border-dashed border-slate-200 rounded-xl">
                    <QRCode value={`STUDENT-ID:${selectedStudent?.id}`} size={60} />
                  </div>
                </div>

                <div className="bg-slate-900 p-3 text-center">
                  <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[3px]">Created By</p>
                  <p className="text-[9px] font-black text-blue-400 uppercase">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
                </div>
              </div>

              <button onClick={() => window.print()} className="w-full mt-8 bg-blue-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl">
                <Printer size={20}/> আইডি কার্ড প্রিন্ট করুন
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* টাকা জমা মডাল */}
      <AnimatePresence>
        {showPayModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 shadow-2xl">
              <div className="text-center">
                <h3 className="font-black text-xl">টাকা জমা নিন</h3>
                <p className="text-sm text-slate-400 font-bold">{selectedStudent?.name}</p>
              </div>
              <Input label="জমার পরিমাণ (৳)" type="number" value={payAmount} onChange={setPayAmount} placeholder="500" />
              <button onClick={handlePayment} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg">জমা নিশ্চিত করুন</button>
              <button onClick={() => setShowPayModal(false)} className="w-full text-slate-400 font-bold">বাতিল</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* রশিদ মডাল */}
      <AnimatePresence>
        {showReceipt && (
          <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="fixed inset-0 bg-slate-900/90 z-[400] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-[3rem] w-full max-w-sm space-y-6 relative shadow-2xl">
              <button onClick={() => setShowReceipt(false)} className="absolute top-6 right-6 text-slate-300 p-2"><X/></button>
              <div className="text-center border-b pb-4">
                <h2 className="font-black text-blue-900 text-xl tracking-tighter uppercase">Payment Receipt</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">আল-আজহার স্কুল</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="flex justify-between"><span>ছাত্র:</span> <b className="text-slate-800">{selectedStudent?.name}</b></p>
                  <p className="flex justify-between"><span>রোল:</span> <b>{selectedStudent?.roll}</b></p>
                </div>
                <p className="flex justify-between items-center py-2 px-4 border-y border-dashed border-slate-200">
                  <span className="font-bold text-slate-500 text-xs">Paid Amount:</span> 
                  <b className="text-2xl font-black text-emerald-600">৳{payAmount}</b>
                </p>
              </div>
              <div className="text-center pt-4 border-t border-dashed">
                <p className="text-[11px] font-black text-blue-900 uppercase">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
              </div>
              <button onClick={() => window.print()} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg">
                <Printer size={18}/> রশিদ প্রিন্ট করুন
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ভর্তি ফরম */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 bg-black/60 z-[200] flex items-end">
            <div className="bg-white w-full h-[90vh] rounded-t-[4rem] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-8 bg-[#1E3A8A] text-white flex justify-between items-center shrink-0">
                <h2 className="text-xl font-black tracking-tight">নতুন শিক্ষার্থী ভর্তি</h2>
                <button onClick={() => setShowForm(false)} className="p-2 bg-white/20 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scroll pb-20">
                <Input label="নাম" placeholder="ছাত্রের নাম" onChange={(v:any) => setFormData({...formData, name: v})} />
                <Input label="পিতার নাম" placeholder="পিতার নাম" onChange={(v:any) => setFormData({...formData, father_name: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="শ্রেণী" options={CLASS_LIST} onChange={(v:any) => setFormData({...formData, class_name: v})} />
                  <Input label="রোল" placeholder="১" onChange={(v:any) => setFormData({...formData, roll: v})} />
                </div>
                <Input label="মোবাইল" placeholder="017..." onChange={(v:any) => setFormData({...formData, phone: v})} />
                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-6 rounded-[2.5rem]">
                  <Input label="মাসিক বেতন" type="number" onChange={(v:any) => setFormData({...formData, monthly_fee: v})} />
                  <Input label="পরীক্ষা ফি" type="number" onChange={(v:any) => setFormData({...formData, exam_fee: v})} />
                </div>
                <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex justify-between items-center">
                  <span className="font-bold opacity-60">সর্বমোট বকেয়া:</span>
                  <span className="text-3xl font-black text-blue-400">৳{totalDuesCalc}</span>
                </div>
                <button onClick={handleSaveStudent} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl">তথ্য সেভ করুন</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* নেভিগেশন */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t p-4 flex justify-around items-center rounded-t-[3rem] shadow-2xl z-[100]">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        <NavBtn icon={<UserCheck/>} active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
        <NavBtn icon={<FileText/>} active={activeTab === 'marksheet'} onClick={() => setActiveTab('marksheet')} />
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 overflow-hidden shadow-md">
            <img src="/developer.jpg" alt="Dev" className="w-full h-full object-cover" />
          </div>
          <span className="text-[8px] font-black text-blue-900 mt-1 uppercase tracking-tighter">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </nav>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 0; }
        @media print {
          body * { visibility: hidden; }
          #id-card-print, #id-card-print * { visibility: visible; }
          #id-card-print { position: absolute; left: 0; top: 0; margin: 0; border: none; }
          #receipt-print, #receipt-print * { visibility: visible; }
        }
      `}</style>
    </div>
  );
}

// রিইউজেবল ছোট ছোট ডিজাইন কম্পোনেন্টস
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
