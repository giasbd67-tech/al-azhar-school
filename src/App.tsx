import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, CreditCard, UserCheck, 
  FileText, Printer, CheckCircle, ScanLine, School, DollarSign, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

// ১. কনফিগারেশন ও ধ্রুবক
const CLASS_LIST = ["প্লে", "নার্সারি", "কেজি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "একাদশ", "দ্বাদশ"];
const API_URL = "https://your-neon-api-endpoint.vercel.app/api"; // আপনার আসল API URL এখানে দিন

export default function AlAzharSmartOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');

  // ফরম স্টেট
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
      setStudents(data);
    } catch (err) { console.error("Data fetch failed", err); }
  };

  // ২. অটো মেসেজ ও কপি ফাংশন
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

  // ৩. ভর্তি ও এডিট লজিক
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
        alert("সফলভাবে সেভ হয়েছে!");
        setShowForm(false);
        setEditingStudent(null);
        fetchStudents();
      }
    } catch (err) { alert("সেভ করতে সমস্যা হয়েছে!"); }
  };

  // ৪. পেমেন্ট লজিক (বিয়োগ করা)
  const handlePayment = async () => {
    const amount = Number(payAmount);
    if (amount <= 0) return;

    const updatedDues = selectedStudent.total_dues - amount;
    try {
      await fetch(`${API_URL}/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedStudent, total_dues: updatedDues })
      });
      alert(`${amount} টাকা জমা নেওয়া হয়েছে। বর্তমান বকেয়া: ${updatedDues}`);
      setShowPayModal(false);
      fetchStudents();
    } catch (err) { alert("পেমেন্ট ব্যর্থ হয়েছে"); }
  };

  // ৫. ডিলিট লজিক
  const deleteStudent = async (id: number) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে ডিলিট করতে চান?")) {
      await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* হেডার */}
      <header className="bg-[#1E3A8A] text-white p-6 rounded-b-[2rem] shadow-xl flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full border-2 border-white" />
        <div>
          <h1 className="text-xl font-bold leading-tight">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
          <p className="text-[10px] opacity-80">SMART SCHOOL OS • অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {/* ড্যাশবোর্ড বা স্টুডেন্ট লিস্ট */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => { setEditingStudent(null); setShowForm(true); }} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold flex justify-center gap-2">
              <Plus /> নতুন স্টুডেন্ট ভর্তি
            </button>

            {students.map((st) => (
              <div key={st.id} className="bg-white p-5 rounded-3xl shadow-sm border border-blue-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><QRCode value={`ID:${st.id}`} size={40} /></div>
                    <div>
                      <h3 className="font-bold text-lg">{st.name}</h3>
                      <p className="text-xs text-slate-500">{st.class_name} | রোল: {st.roll}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-red-500">বকেয়া</p>
                    <p className="text-xl font-black text-red-600">৳{st.total_dues}</p>
                  </div>
                </div>

                {/* বাটন গ্রুপ */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => window.location.href = `tel:${st.phone}`} className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-200">
                    <Phone size={14} /> কল করুন
                  </button>
                  <button onClick={() => { setSelectedStudent(st); setShowPayModal(true); }} className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-200">
                    <CreditCard size={14} /> বকেয়া পরিশোধ
                  </button>
                  <button onClick={() => copyDueMessage(st)} className="flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200">
                    <Copy size={14} /> বকেয়া কপি
                  </button>
                  <button onClick={() => copyAbsentMessage(st)} className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-200">
                    <Copy size={14} /> অনুপস্থিতি কপি
                  </button>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button onClick={() => { setEditingStudent(st); setFormData(st); setShowForm(true); }} className="flex-1 flex justify-center py-2 text-blue-500"><Edit size={16} /></button>
                  <button onClick={() => deleteStudent(st.id)} className="flex-1 flex justify-center py-2 text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ভর্তি ফরম মডাল (বড় এবং স্ক্রলযোগ্য) */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full h-[90vh] rounded-t-[3rem] p-6 overflow-y-auto shadow-2xl">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-black">{editingStudent ? 'তথ্য সংশোধন' : 'ভর্তি ফরম'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 bg-slate-100 rounded-full"><X /></button>
              </div>

              <div className="space-y-6 pb-20">
                <BigInput label="নাম (Name)" placeholder="এম এস সাদী মিনার" value={formData.name} onChange={(v:any)=>setFormData({...formData, name:v})} />
                <BigInput label="পিতার নাম (Father's Name)" placeholder="গিয়াস উদ্দিন" value={formData.father_name} onChange={(v:any)=>setFormData({...formData, father_name:v})} />
                <BigInput label="ঠিকানা (Address)" placeholder="নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী" value={formData.address} onChange={(v:any)=>setFormData({...formData, address:v})} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">শ্রেণী (Class)</label>
                    <select value={formData.class_name} onChange={(e)=>setFormData({...formData, class_name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold">
                      {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <BigInput label="রোল (Roll)" type="number" value={formData.roll} onChange={(v:any)=>setFormData({...formData, roll:v})} />
                </div>

                <BigInput label="মোবাইল (Phone)" value={formData.phone} onChange={(v:any)=>setFormData({...formData, phone:v})} />

                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-3xl">
                  <BigInput label="মাসিক বেতন" type="number" value={formData.monthly_fee} onChange={(v:any)=>setFormData({...formData, monthly_fee:v})} />
                  <BigInput label="পরীক্ষা ফি" type="number" value={formData.exam_fee} onChange={(v:any)=>setFormData({...formData, exam_fee:v})} />
                  <BigInput label="অন্যান্য ফি" type="number" value={formData.other_fee} onChange={(v:any)=>setFormData({...formData, other_fee:v})} />
                  <BigInput label="পূর্বের বকেয়া" type="number" value={formData.previous_dues} onChange={(v:any)=>setFormData({...formData, previous_dues:v})} />
                </div>

                <button onClick={handleSaveStudent} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-lg">তথ্য সংরক্ষণ করুন</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* পেমেন্ট মডাল */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-center font-bold text-lg">বকেয়া পরিশোধ</h3>
              <div className="text-center">
                <p className="text-xs text-slate-400">মোট বকেয়া: ৳{selectedStudent?.total_dues}</p>
              </div>
              <input type="number" placeholder="টাকার পরিমাণ লিখুন" value={payAmount} onChange={(e)=>setPayAmount(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-blue-100 text-center text-2xl font-bold outline-none" />
              <button onClick={handlePayment} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold">জমা নিশ্চিত করুন</button>
              <button onClick={()=>setShowPayModal(false)} className="w-full text-slate-400 text-sm">বাতিল করুন</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ফুটার ও ডেভেলপার ইনফো */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around items-center rounded-t-3xl shadow-2xl z-40">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={()=>setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={()=>setActiveTab('students')} />
        <NavBtn icon={<UserCheck/>} active={activeTab === 'attendance'} onClick={()=>setActiveTab('attendance')} />
        
        <div className="flex flex-col items-center">
          <img src="/developer.jpg" alt="Dev" className="w-8 h-8 rounded-full border border-blue-600" />
          <span className="text-[7px] font-bold mt-1">গিয়াস উদ্দিন</span>
        </div>
      </footer>
    </div>
  );
}

// ৪. ছোট হেল্পার কম্পোনেন্ট
function BigInput({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 ml-2">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-inner"
      />
    </div>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-3 rounded-xl ${active ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
      {icon}
    </button>
  );
}
