import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Edit, Phone, Copy, X, 
  LayoutDashboard, QrCode, CreditCard, UserCheck, 
  BarChart, MessageSquare, FileText, Download, Camera, Printer, Search, Contact, CheckCircle, ScanLine, UserPlus, School, ShieldCheck, FileSpreadsheet
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
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // বিভিন্ন মডাল স্টেট
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false); // নতুন: রসিদ
  const [showProfile, setShowProfile] = useState(false); // নতুন: প্রোফাইল
  const [showIDCard, setShowIDCard] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);

  // পেমেন্ট ডাটা
  const [payAmount, setPayAmount] = useState('');
  const [lastPaymentInfo, setLastPaymentInfo] = useState<any>(null);

  // হাজিরা ও রেজাল্ট স্টেট
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [marks, setMarks] = useState({ bangla: '', english: '', math: '', science: '' });

  // অটো হাজিরার স্টেট
  const [scanValue, setScanValue] = useState('');
  const [attClass, setAttClass] = useState('প্লে');
  const [attRoll, setAttRoll] = useState('');

  // সার্চ ও ফিল্টার
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('সবগুলো');

  // ভর্তি ফরম স্টেট
  const [formData, setFormData] = useState({
    name: '', father_name: '', address: '', gender: 'ছাত্র', 
    class_name: 'প্লে', roll: '', phone: '',
    monthly_fee: '0', exam_fee: '0', other_fee: '0', previous_dues: '0'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    // ডামি ডাটা লোড (API না থাকলে এরর এড়াতে)
    // বাস্তবে এখানে fetch() কল থাকবে
  };

  // ২. লজিক ফাংশনসমূহ
  const sendWhatsAppAttendance = (student: any) => {
    const message = `আসসালামু আলাইকুম, আপনার সন্তান ${student.name}, শ্রেণী: ${student.class_name}, রোল: ${student.roll} আজ স্কুলে উপস্থিত হয়েছে। ধন্যবাদ।`;
    window.open(`https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const processAttendance = (student: any) => {
    const alreadyPresent = attendanceList.find(a => a.id === student.id);
    if (!alreadyPresent) {
      setAttendanceList([{ ...student, time: new Date().toLocaleTimeString() }, ...attendanceList]);
      sendWhatsAppAttendance(student);
    } else {
      alert("ইতোমধ্যেই হাজিরা নেওয়া হয়েছে!");
    }
  };

  const handleQRScan = (val: string) => {
    setScanValue(val);
    if (val.includes('STUDENT-ID:')) {
      const id = val.replace('STUDENT-ID:', '');
      const student = students.find(s => s.id.toString() === id);
      if (student) { processAttendance(student); setScanValue(''); }
    }
  };

  const handleManualAttendance = () => {
    if (!attRoll) return alert("রোল নম্বর লিখুন");
    const student = students.find(s => s.class_name === attClass && s.roll.toString() === attRoll.toString());
    if (student) { processAttendance(student); setAttRoll(''); }
    else { alert("ছাত্র খুঁজে পাওয়া যায়নি!"); }
  };

  const calculateGrade = (mark: number) => {
    if (mark >= 80) return { gpa: 5.0, grade: 'A+' };
    if (mark >= 33) return { gpa: 1.0, grade: 'D' };
    return { gpa: 0.0, grade: 'F' };
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name?.toLowerCase().includes(searchTerm.toLowerCase()) || st.roll?.toString().includes(searchTerm);
    const matchesClass = selectedClass === 'সবগুলো' || st.class_name === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handlePayment = () => {
    if (!payAmount || Number(payAmount) <= 0) return alert("সঠিক পরিমাণ লিখুন");
    setLastPaymentInfo({
        amount: payAmount,
        date: new Date().toLocaleDateString(),
        trxId: 'TXN-' + Math.floor(Math.random() * 1000000)
    });
    setShowPayModal(false);
    setShowReceipt(true); // রসিদ ওপেন হবে
  };

  const handleSaveStudent = () => {
    const newStudent = { ...formData, id: Date.now(), total_dues: Number(formData.monthly_fee) + Number(formData.previous_dues) };
    setStudents([newStudent, ...students]);
    setShowForm(false);
    alert("ভর্তি সফল হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans overflow-x-hidden">
      {/* হেডার */}
      <header className="bg-[#1E3A8A] text-white p-8 rounded-b-[3.5rem] shadow-2xl relative">
        <div className="flex items-center gap-5 max-w-5xl mx-auto">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" />
          <div>
            <h1 className="text-xl font-black">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Smart School OS • অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        
        {/* ড্যাশবোর্ড ট্যাব */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 mt-[-40px]">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="মোট শিক্ষার্থী" value={students.length} icon={<Users/>} color="bg-blue-600" />
              <StatCard title="আজকের হাজিরা" value={attendanceList.length} icon={<CheckCircle/>} color="bg-emerald-600" />
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-blue-100 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ScanLine size={20}/></div>
                <h3 className="font-black text-slate-800">অটো হাজিরা</h3>
              </div>
              <input type="text" value={scanValue} onChange={(e) => handleQRScan(e.target.value)} placeholder="কিউআর কোড স্ক্যান করুন..." className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-blue-200 outline-none font-bold text-center" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select value={attClass} onChange={(e)=>setAttClass(e.target.value)} className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500">
                  {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={attRoll} onChange={(e)=>setAttRoll(e.target.value)} placeholder="রোল" className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500" />
                <button onClick={handleManualAttendance} className="bg-emerald-600 text-white p-4 rounded-2xl font-black shadow-lg">হাজিরা দিন</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="font-black text-sm">উপস্থিতি তালিকা</h3>
                    <button onClick={()=>window.print()} className="bg-blue-50 text-blue-600 p-2 rounded-xl text-xs font-bold flex items-center gap-1"><Printer size={14}/> প্রিন্ট</button>
                </div>
                
                {/* হাজিরা প্রিন্ট এরিয়া (জলছাপ সহ) */}
                <div id="attendance-print" className="grid gap-2 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none print:opacity-[0.05]"><School size={200}/></div>
                    {attendanceList.map((a, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 z-10 relative">
                            <div><p className="font-black text-xs">{a.name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{a.class_name} - রোল: {a.roll}</p></div>
                            <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-1 rounded-lg shadow-sm">{a.time}</span>
                        </div>
                    ))}
                    {attendanceList.length === 0 && <p className="text-center text-xs text-slate-400 py-4">এখনও কেউ আসেনি</p>}
                </div>
            </div>
          </div>
        )}

        {/* শিক্ষার্থী তালিকা ট্যাব */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <button onClick={() => setShowForm(true)} className="w-full bg-[#1E3A8A] text-white p-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-lg mb-2"><Plus/> নতুন স্টুডেন্ট ভর্তি</button>
            <div className="flex gap-2">
              <input type="text" placeholder="খুঁজুন..." className="flex-1 p-4 bg-white rounded-2xl shadow-sm border outline-none font-bold" onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="bg-white px-4 rounded-2xl shadow-sm border font-bold text-xs" onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="সবগুলো">সব ক্লাস</option>
                {CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid gap-4">
              {filteredStudents.map((st) => (
                <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-slate-50 rounded-xl border"><QRCode value={`STUDENT-ID:${st.id}`} size={45} /></div>
                      <div className="cursor-pointer" onClick={()=>{setSelectedStudent(st); setShowProfile(true);}}>
                        <h3 className="font-black text-slate-800 hover:text-blue-600 transition-colors">{st.name}</h3>
                        <p className="text-xs font-bold text-slate-400">রোল: {st.roll} • {st.class_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">বকেয়া</p>
                      <p className="font-black text-rose-600 text-lg">৳{st.total_dues}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ActionBtn label="টাকা জমা" icon={<CreditCard size={14}/>} onClick={() => {setSelectedStudent(st); setShowPayModal(true);}} color="bg-emerald-600 text-white flex-1" />
                    <ActionBtn label="ID কার্ড" icon={<Contact size={14}/>} onClick={() => {setSelectedStudent(st); setShowIDCard(true);}} color="bg-blue-100 text-blue-700" />
                    <ActionBtn label="প্রোফাইল" icon={<FileSpreadsheet size={14}/>} onClick={() => {setSelectedStudent(st); setShowProfile(true);}} color="bg-slate-100 text-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* মার্কশিট ট্যাব */}
        {activeTab === 'marksheet' && (
          <div className="space-y-4">
             {/* হেডার অংশ আগের মতোই... */}
             {filteredStudents.map((st) => (
              <div key={st.id} className="bg-white p-5 rounded-[2rem] shadow-sm flex justify-between items-center border border-slate-100">
                <div><h4 className="font-black text-slate-800">{st.name}</h4><p className="text-[10px] font-bold text-slate-400 uppercase">রোল: {st.roll} | {st.class_name}</p></div>
                <button onClick={() => {setSelectedStudent(st); setShowMarksModal(true);}} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2"><FileText size={14}/> নম্বর</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- মডাল সেকশন --- */}
      <AnimatePresence>
        
        {/* ১. ভর্তি ফরম (ইনপুট) */}
        {showForm && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 bg-black/60 z-[600] flex items-end">
            <div className="bg-white w-full h-[95vh] rounded-t-[4rem] overflow-hidden flex flex-col p-8 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black">নতুন স্টুডেন্ট ভর্তি</h2>
                <button onClick={()=>setShowForm(false)} className="bg-slate-100 p-2 rounded-full"><X/></button>
              </div>
              <div className="overflow-y-auto space-y-5 pb-20 custom-scroll">
                 <Input label="শিক্ষার্থীর নাম" onChange={(v:any)=>setFormData({...formData, name: v})} />
                 <Input label="পিতার নাম" onChange={(v:any)=>setFormData({...formData, father_name: v})} />
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="রোল" type="number" onChange={(v:any)=>setFormData({...formData, roll: v})} />
                    <Input label="মোবাইল" onChange={(v:any)=>setFormData({...formData, phone: v})} />
                 </div>
                 {/* বাকি ইনপুটগুলো সংক্ষেপে... */}
                 <button onClick={handleSaveStudent} className="w-full bg-[#1E3A8A] text-white py-5 rounded-3xl font-black text-lg">ভর্তি নিশ্চিত করুন</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ২. পেমেন্ট ও রসিদ মডাল (জলছাপ সহ) */}
        {showPayModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/60 z-[800] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 shadow-2xl">
              <div className="text-center"><h3 className="font-black text-xl">টাকা জমা নিন</h3><p className="text-sm text-slate-400 font-bold">{selectedStudent?.name}</p></div>
              <Input label="জমার পরিমাণ (৳)" type="number" onChange={setPayAmount} />
              <button onClick={handlePayment} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-lg">জমা নিশ্চিত করুন</button>
              <button onClick={()=>setShowPayModal(false)} className="w-full text-slate-400 font-bold">বাতিল</button>
            </div>
          </motion.div>
        )}

        {/* ৩. মানি রসিদ প্রিন্ট ভিউ (নতুন) */}
        {showReceipt && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-slate-900/95 z-[900] flex flex-col items-center justify-center p-4">
                <button onClick={()=>setShowReceipt(false)} className="self-end text-white mb-4"><X/></button>
                <div id="receipt-print" className="bg-white w-[350px] p-8 rounded-[2rem] relative overflow-hidden">
                    {/* জলছাপ */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none"><School size={200}/></div>
                    
                    <div className="relative z-10 text-center space-y-6">
                        <div className="border-b-2 border-dashed border-slate-200 pb-4">
                            <h2 className="font-black text-lg text-blue-900">আল-আজহার স্কুল এন্ড কলেজ</h2>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">Money Receipt</p>
                        </div>
                        <div className="text-left space-y-2 text-xs font-bold">
                            <div className="flex justify-between"><span>Date:</span> <span>{lastPaymentInfo?.date}</span></div>
                            <div className="flex justify-between"><span>TRX ID:</span> <span>{lastPaymentInfo?.trxId}</span></div>
                            <div className="flex justify-between"><span>Student:</span> <span>{selectedStudent?.name}</span></div>
                            <div className="flex justify-between"><span>Class:</span> <span>{selectedStudent?.class_name} (Roll: {selectedStudent?.roll})</span></div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-slate-400 uppercase font-black">Paid Amount</p>
                            <h1 className="text-3xl font-black text-emerald-600">৳{lastPaymentInfo?.amount}</h1>
                        </div>
                        <div className="pt-8 flex justify-between items-end">
                            <div className="text-left"><p className="text-[8px] font-black text-slate-400">Authorized Sign</p><div className="w-20 h-px bg-slate-400 mt-4"></div></div>
                            <div className="text-right"><p className="text-[6px] font-black text-blue-900 uppercase">Dev: গিয়াস উদ্দিন</p></div>
                        </div>
                    </div>
                </div>
                <button onClick={()=>window.print()} className="mt-4 bg-white text-blue-900 px-8 py-3 rounded-full font-black flex items-center gap-2"><Printer size={16}/> প্রিন্ট রসিদ</button>
            </motion.div>
        )}

        {/* ৪. স্টুডেন্ট প্রোফাইল/বায়োডাটা প্রিন্ট (নতুন) */}
        {showProfile && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-slate-900/95 z-[900] flex flex-col items-center justify-center p-4">
                <button onClick={()=>setShowProfile(false)} className="self-end text-white mb-4"><X/></button>
                <div id="profile-print" className="bg-white w-full max-w-lg p-10 rounded-[2rem] relative overflow-hidden h-[80vh] overflow-y-auto">
                    {/* জলছাপ */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none fixed"><Users size={300}/></div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="text-center border-b-4 border-blue-900 pb-5">
                            <h1 className="text-2xl font-black text-blue-900">আল-আজহার ইন্টারন্যাশনাল স্কুল</h1>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mt-1">Student Profile</p>
                        </div>
                        <div className="flex justify-center"><div className="p-2 border-2 border-dashed rounded-2xl"><QRCode value={`ID:${selectedStudent?.id}`} size={80} /></div></div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                            <InfoRow label="Name" value={selectedStudent?.name} />
                            <InfoRow label="Father's Name" value={selectedStudent?.father_name} />
                            <InfoRow label="Class" value={selectedStudent?.class_name} />
                            <InfoRow label="Roll No" value={selectedStudent?.roll} />
                            <InfoRow label="Gender" value={selectedStudent?.gender} />
                            <InfoRow label="Mobile" value={selectedStudent?.phone} />
                            <div className="col-span-2"><InfoRow label="Address" value={selectedStudent?.address} /></div>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-5">
                            <h4 className="font-black text-slate-800 mb-3 border-b pb-2">Financial Status</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InfoRow label="Monthly Fee" value={`৳${selectedStudent?.monthly_fee}`} />
                                <InfoRow label="Total Dues" value={`৳${selectedStudent?.total_dues}`} />
                            </div>
                        </div>
                        <div className="pt-10 text-center"><p className="text-[10px] font-black text-blue-200 uppercase">Software by: Gias Uddin</p></div>
                    </div>
                </div>
                <button onClick={()=>window.print()} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-full font-black flex items-center gap-2"><Printer size={16}/> প্রিন্ট প্রোফাইল</button>
            </motion.div>
        )}

        {/* ৫. আইডি কার্ড মডাল (জলছাপ সহ) */}
        {showIDCard && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-slate-900/95 z-[700] flex flex-col items-center justify-center p-6 backdrop-blur-md">
            <button onClick={()=>setShowIDCard(false)} className="self-end text-white mb-4"><X/></button>
            <div id="id-card-print" className="bg-white w-[300px] h-[480px] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border-4 border-blue-900 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0"><School size={200} className="text-blue-900" /></div>
                {/* আইডি কার্ডের কন্টেন্ট আগের মতোই... */}
                <div className="bg-blue-900 h-24 flex flex-col items-center justify-center p-4 text-center z-10 relative">
                    <h2 className="text-white font-black text-[12px]">আল-আজহার স্কুল এন্ড কলেজ</h2>
                    <p className="text-blue-300 text-[8px] font-bold uppercase tracking-widest mt-1">Identity Card</p>
                </div>
                <div className="flex-1 flex flex-col items-center p-6 space-y-4 text-center z-10 relative">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200"><Users size={40} className="text-slate-200"/></div>
                    <div><h3 className="text-xl font-black text-slate-800">{selectedStudent?.name}</h3><p className="text-blue-600 font-bold text-xs uppercase">{selectedStudent?.class_name}</p></div>
                    <div className="w-full space-y-2 bg-slate-50/80 p-4 rounded-2xl text-[10px] font-black uppercase backdrop-blur-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Roll:</span><span>{selectedStudent?.roll}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Mobile:</span><span>{selectedStudent?.phone}</span></div>
                    </div>
                    <div className="mt-2 p-2 bg-white border rounded-xl shadow-inner"><QRCode value={`STUDENT-ID:${selectedStudent?.id}`} size={60} /></div>
                </div>
                <div className="bg-slate-900 p-3 text-center z-10 relative"><p className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Dev: গিয়াস উদ্দিন</p></div>
            </div>
            <button onClick={()=>window.print()} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-full font-black flex items-center gap-2"><Printer size={16}/> প্রিন্ট</button>
          </motion.div>
        )}

        {/* ৬. মার্কশিট মডাল (জলছাপ সহ) */}
        {showMarksModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-slate-900/95 z-[700] flex items-center justify-center p-4">
             {/* মার্কশিট কন্টেন্ট ও প্রিন্ট ভিউ (জলছাপ সহ) আগের মতোই... */}
             <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-5 relative max-h-[90vh] overflow-y-auto">
              <button onClick={()=>setShowMarksModal(false)} className="absolute top-6 right-6"><X/></button>
              <div className="text-center"><h3 className="font-black text-xl">মার্কশিট জেনারেটর</h3></div>
              <div className="space-y-3">
                 <Input label="বাংলা" type="number" onChange={(v:any)=>setMarks({...marks, bangla: v})} />
                 <Input label="ইংরেজি" type="number" onChange={(v:any)=>setMarks({...marks, english: v})} />
                 <button onClick={()=>window.print()} className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black mt-4">প্রিন্ট মার্কশিট</button>
              </div>

              {/* প্রিন্ট ভিউ */}
              <div id="marksheet-print" className="hidden print:block bg-white p-10 border-[10px] border-blue-900 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0"><ShieldCheck size={400} className="text-blue-900" /></div>
                <div className="relative z-10">
                    <div className="text-center border-b-2 border-blue-900 pb-5 mb-5">
                        <h1 className="text-3xl font-black text-blue-900">আল-আজহার ইন্টারন্যাশনাল স্কুল</h1>
                        <p className="font-bold uppercase tracking-widest text-slate-500 mt-2">Academic Transcript</p>
                    </div>
                    <div className="flex justify-between mb-8 text-sm font-bold"><span>নাম: {selectedStudent?.name}</span><span>শ্রেণী: {selectedStudent?.class_name} | রোল: {selectedStudent?.roll}</span></div>
                    <table className="w-full border-collapse border border-slate-400 text-center bg-white/50 backdrop-blur-sm">
                        <thead><tr className="bg-slate-100"><th className="border p-2">Subject</th><th className="border p-2">Marks</th><th className="border p-2">Grade</th></tr></thead>
                        <tbody>
                            <tr><td className="border p-2">Bangla</td><td className="border p-2">{marks.bangla}</td><td className="border p-2 font-bold">{calculateGrade(Number(marks.bangla)).grade}</td></tr>
                            <tr><td className="border p-2">English</td><td className="border p-2">{marks.english}</td><td className="border p-2 font-bold">{calculateGrade(Number(marks.english)).grade}</td></tr>
                        </tbody>
                    </table>
                    <div className="mt-20 flex justify-between items-end"><div className="border-t border-slate-400 px-6 pt-2 text-[10px] font-bold">প্রধান শিক্ষক</div><div className="text-right"><p className="text-[10px] font-black text-blue-900 uppercase">Dev: গিয়াস উদ্দিন</p></div></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* নেভিগেশন */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t p-4 flex justify-around items-center rounded-t-[3rem] shadow-2xl z-[100]">
        <NavBtn icon={<LayoutDashboard/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavBtn icon={<Users/>} active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        <NavBtn icon={<UserCheck/>} active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
        <NavBtn icon={<FileText/>} active={activeTab === 'marksheet'} onClick={() => setActiveTab('marksheet')} />
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center font-black text-blue-900 text-[10px]">GU</div>
          <span className="text-[7px] font-black text-blue-900 mt-1 uppercase">গিয়াস উদ্দিন</span>
        </div>
      </nav>

      {/* প্রিন্ট স্টাইল (খুবই গুরুত্বপূর্ণ) */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 0; }
        @media print {
          body * { visibility: hidden; }
          #id-card-print, #id-card-print *,
          #marksheet-print, #marksheet-print *,
          #receipt-print, #receipt-print *,
          #profile-print, #profile-print *,
          #attendance-print, #attendance-print * { visibility: visible; }
          
          #id-card-print { position: fixed; left: 0; top: 0; }
          #receipt-print { position: fixed; left: 0; top: 0; width: 100%; max-width: 350px; }
          #marksheet-print { position: absolute; left: 0; top: 0; width: 100%; }
          #profile-print { position: absolute; left: 0; top: 0; width: 100%; height: auto; }
          #attendance-print { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ছোট রিইউজেবল কম্পোনেন্টস
function Input({label, placeholder, value, onChange, type="text"}: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">{label}</label>
      <input type={type} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold shadow-inner transition-all" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function InfoRow({label, value}: any) {
    return (
        <div className="border-b border-dashed border-slate-200 pb-1">
            <span className="text-slate-400 text-xs uppercase font-bold mr-2">{label}:</span>
            <span className="font-black text-slate-800">{value || '-'}</span>
        </div>
    );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
      <div className={`${color} p-3 rounded-xl text-white shadow-lg`}>{icon}</div>
      <div><p className="text-[9px] font-black text-slate-400 uppercase">{title}</p><h2 className="text-lg font-black">{value}</h2></div>
    </div>
  );
}

function ActionBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-3 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm`}>{icon} {label}</button>
  );
}

function NavBtn({icon, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-blue-50 text-blue-700 scale-110 shadow-inner' : 'text-slate-300'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 26 })}
    </button>
  );
}
