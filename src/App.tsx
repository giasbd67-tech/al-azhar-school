import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, CreditCard, UserCheck, 
  FileText, Printer, CheckCircle, ScanLine, School, DollarSign, BarChart3, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

// ১. কনফিগারেশন
const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];
const API_URL = "https://your-vercel-api.vercel.app/api"; // আপনার ব্যাকএন্ড API URL এখানে দিন

export default function AlAzharSmartOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: 0, exam_fee: 0, other_fee: 0, previous_dues: 0
  });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Data fetch failed", err); }
  };

  // ২. অটো মেসেজ ও ক্যালকুলেশন লজিক
  const copyDueMessage = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ থেকে জানানো যাচ্ছে যে, আপনার সন্তান ${st.name}-এর মাসিক বেতন, পরীক্ষা ফি ও অন্যান্য ফি বাবদ মোট বকেয়া ${st.total_dues} টাকা। দ্রুত পরিশোধ করার জন্য অনুরোধ করা হলো। ধন্যবাদ।`;
    navigator.clipboard.writeText(msg);
    alert("বকেয়া মেসেজ কপি হয়েছে!");
  };

  const copyAbsentMessage = (st: any) => {
    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${st.name} (শ্রেণী: ${st.class_name}) স্কুলে উপস্থিত নেই। অনুপস্থিতির সঠিক কারণটি আমাদের জানানোর জন্য অনুরোধ করা হলো। ইতি, আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ।`;
    navigator.clipboard.writeText(msg);
    alert("অনুপস্থিতি মেসেজ কপি হয়েছে!");
  };

  // ৩. পেমেন্ট লজিক (অটো বিয়োগ)
  const handlePayment = async () => {
    const amount = Number(payAmount);
    if (amount <= 0 || !selectedStudent) return;

    const updatedDues = selectedStudent.total_dues - amount;
    try {
      const res = await fetch(`${API_URL}/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedStudent, total_dues: updatedDues })
      });
      if(res.ok) {
        alert(`${amount} টাকা জমা হয়েছে। নতুন বকেয়া: ${updatedDues}`);
        setShowPayModal(false);
        fetchStudents();
      }
    } catch (err) { alert("পেমেন্ট ব্যর্থ হয়েছে!"); }
  };

  const handleSaveStudent = async () => {
    const total = Number(formData.monthly_fee) + Number(formData.exam_fee) + 
                  Number(formData.other_fee) + Number(formData.previous_dues);
    const payload = { ...formData, total_dues: total };

    const method = editingStudent ? 'PUT' : 'POST';
    const url = editingStudent ? `${API_URL}/students/${editingStudent.id}` : `${API_URL}/students`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowForm(false);
        setEditingStudent(null);
        fetchStudents();
      }
    } catch (err) { alert("সেভ করতে সমস্যা হয়েছে!"); }
  };

  const deleteStudent = async (id: number) => {
    if (confirm("আপনি কি নিশ্চিত ডিলিট করতে চান?")) {
      await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* হেডার লোগো সহ */}
      <header className="bg-[#1E3A8A] text-white p-8 rounded-b-[3rem] shadow-2xl relative">
        <div className="flex items-center gap-5 max-w-5xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" />
          <div>
            <h1 className="text-xl font-black">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Smart School OS • অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* ড্যাশবোর্ড বা স্টুডেন্ট লিস্ট */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => { setEditingStudent(null); setShowForm(true); }} className="w-full bg-[#1E3A8A] text-white p-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-lg mb-4">
              <Plus/> নতুন স্টুডেন্ট ভর্তি
            </button>

            {students.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl border"><QRCode value={`ID:${st.id}`} size={45} /></div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg">{st.name}</h3>
                      <p className="text-xs font-bold text-slate-400">রোল: {st.roll} • {st.class_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-rose-400 uppercase">বকেয়া</p>
                    <p className="font-black text-rose-600 text-xl">৳{st.total_dues}</p>
                  </div>
                </div>

                {/* বাটন গ্রুপ */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => window.location.href=`tel:${st.phone}`} className="flex items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black border border-emerald-100">
                    <Phone size={14}/> কল করুন
                  </button>
                  <button onClick={() => { setSelectedStudent(st); setShowPayModal(true); }} className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-2xl text-xs font-black border border-blue-100">
                    <CreditCard size={14}/> বকেয়া পরিশোধ
                  </button>
                  <button onClick={() => copyDueMessage(st)} className="flex items-center justify-center gap-2 p-4 bg-orange-50 text-orange-700 rounded-2xl text-xs font-black border border-orange-100">
                    <Copy size={14}/> বকেয়া কপি
                  </button>
                  <button onClick={() => copyAbsentMessage(st)} className="flex items-center justify-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-2xl text-xs font-black border border-purple-100">
                    <Copy size={14}/> অনুপস্থিতি কপি
                  </button>
                </div>

                <div className="flex justify-end gap-5 pt-3 border-t border-slate-50">
                  <button onClick={() => { setEditingStudent(st); setFormData(st); setShowForm(true); }} className="text-blue-500 flex items-center gap-1 font-bold text-xs"><Edit size={14}/> সংশোধন</button>
                  <button onClick={() => deleteStudent(st.id)} className="text-rose-500 flex items-center gap-1 font-bold text-xs"><Trash2 size={14}/> ডিলিট</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ভর্তি ফরম (স্ক্রলযোগ্য ও বড় ফিল্ড) */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 bg-black/60 z-[600] flex items-end">
            <div className="bg-white w-full h-[92vh] rounded-t-[4rem] p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800">{editingStudent ? 'তথ্য সংশোধন' : 'নতুন ভর্তি ফরম'}</h2>
                <button onClick={()=>setShowForm(false)} className="bg-slate-100 p-3 rounded-full"><X/></button>
              </div>

              <div className="space-y-6 pb-20">
                <BigInput label="নাম (Name)" placeholder="এম এস সাদী মিনার / এম এস ফাদি মিহাল" value={formData.name} onChange={(v:any)=>setFormData({...formData, name: v})} />
                <BigInput label="পিতার নাম (Father's Name)" placeholder="গিয়াস উদ্দিন" value={formData.father_name} onChange={(v:any)=>setFormData({...formData, father_name: v})} />
                <BigInput label="ঠিকানা (Address)" placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" value={formData.address} onChange={(v:any)=>setFormData({...formData, address: v})} />
                
                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 ml-2 uppercase">শ্রেণী (Class)</label>
                     <select value={formData.class_name} onChange={(e)=>setFormData({...formData, class_name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none font-bold text-lg">
                        {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <BigInput label="রোল নং (Roll)" type="number" value={formData.roll} onChange={(v:any)=>setFormData({...formData, roll: v})} />
                </div>

                <BigInput label="মোবাইল নং (Phone)" value={formData.phone} onChange={(v:any)=>setFormData({...formData, phone: v})} />

                <div className="grid grid-cols-2 gap-5 bg-blue-50/50 p-6 rounded-[3rem] border border-blue-100">
                  <BigInput label="মাসিক বেতন" type="number" value={formData.monthly_fee} onChange={(v:any)=>setFormData({...formData, monthly_fee: v})} />
                  <BigInput label="পরীক্ষা ফি" type="number" value={formData.exam_fee} onChange={(v:any)=>setFormData({...formData, exam_fee: v})} />
                  <BigInput label="অন্যান্য ফি" type="number" value={formData.other_fee} onChange={(v:any)=>setFormData({...formData, other_fee: v})} />
                  <BigInput label="পূর্বের বকেয়া" type="number" value={formData.previous_dues} onChange={(v:any)=>setFormData({...formData, previous_dues: v})} />
                </div>

                <button onClick={handleSaveStudent} className="w-full bg-[#1E3A8A] text-white py-6 rounded-[2.5rem] font-black text-xl shadow-xl hover:bg-blue-800 transition-all">সংরক্ষণ করুন</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* বকেয়া পরিশোধ মডাল */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 bg-black/60 z-[800] flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 space-y-6 shadow-2xl">
              <h3 className="text-center font-black text-xl">টাকা জমা নিন</h3>
              <p className="text-center text-xs font-bold text-slate-400">মোট বকেয়া: ৳{selectedStudent?.total_dues}</p>
              <input type="number" placeholder="৳ পরিমাণ লিখুন" value={payAmount} onChange={(e)=>setPayAmount(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-blue-500 text-center text-3xl font-black outline-none" />
              <button onClick={handlePayment} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-lg">জমা নিশ্চিত করুন</button>
              <button onClick={()=>setShowPayModal(false)} className="w-full text-slate-400 font-bold text-sm">বাতিল</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* নেভিগেশন ও ফুটার */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t p-4 flex justify-around items-center rounded-t-[3rem] shadow-2xl z-[100]">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={()=>setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={()=>setActiveTab('students')} />
        <NavBtn icon={<UserCheck/>} active={activeTab === 'attendance'} onClick={()=>setActiveTab('attendance')} />
        
        <div className="flex flex-col items-center">
          <img src="/developer.jpg" alt="GU" className="w-9 h-9 rounded-full border-2 border-blue-600 shadow-sm" />
          <span className="text-[7px] font-black text-blue-900 mt-1 uppercase">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
      </footer>
    </div>
  );
}

// ৪. হেল্পার কম্পোনেন্ট
function BigInput({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 ml-2 uppercase">{label}</label>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none font-bold text-lg transition-all" />
    </div>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-slate-300'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </button>
  );
}
