import React, { useState } from 'react';
import { 
  Users, Calendar, GraduationCap, Bell, Clock, 
  CircleDollarSign, BookOpen, Search, 
  Plus, Phone, Edit2, Trash2, LayoutDashboard, 
  Copy, CheckCircle, MessageSquareOff, PhoneCall, X
} from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("সব শ্রেণী");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classes = ["প্লে", "নার্সারি", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম", "১১দশ", "১২দশ"];

  const [students, setStudents] = useState([
    { id: 1, name: "মিনার মিহাল", class: "৩য়", roll: "৫", phone: "01867486677", dues: 1500 },
    { id: 2, name: "এম এস সাদী মিনার", class: "৪র্থ", roll: "৪", phone: "01812345678", dues: 500 },
  ]);

  const [payFields, setPayFields] = useState({
    prevDues: 0,
    monthlyFee: 0,
    examFee: 0,
    customFee: 0,
    customLabel: "অন্যান্য ফি"
  });

  const totalPayment = Number(payFields.prevDues) + Number(payFields.monthlyFee) + Number(payFields.examFee) + Number(payFields.customFee);

  // ফিল্টারিং লজিক (নাম, রোল এবং শ্রেণী অনুযায়ী)
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.roll.includes(searchTerm);
    const matchesClass = selectedClass === "সব শ্রেণী" || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const confirmPayment = () => {
    setStudents(students.map(s => 
      s.id === selectedStudent.id ? { ...s, dues: Math.max(0, s.dues - totalPayment) } : s
    ));
    setSelectedStudent(null);
    setPayFields({ prevDues: 0, monthlyFee: 0, examFee: 0, customFee: 0, customLabel: "অন্যান্য ফি" });
    alert("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-[#F3F7FA] font-['Hind_Siliguri'] pb-10">
      
      {/* হেডার */}
      <header className="bg-[#1e4db7] text-white pt-10 pb-24 px-6 rounded-b-[60px] shadow-xl text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h1>
        <p className="text-blue-100 mt-1 opacity-80 text-sm">সোনাইমুড়ী, নোয়াখালী | স্টুডেন্ট ম্যানেজমেন্ট সিস্টেম</p>
      </header>

      <main className="container mx-auto px-4 -mt-16 relative z-10">
        
        {/* সার্চ এবং ফিল্টার সেকশন */}
        <div className="bg-white p-5 rounded-[35px] shadow-lg mb-8 border border-blue-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="নাম বা রোল দিয়ে খুঁজুন..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="md:w-48 p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option>সব শ্রেণী</option>
              {classes.map(c => <option key={c} value={c}>{c} শ্রেণী</option>)}
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#1e4db7] text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg"
            >
              <Plus size={20} /> নতুন ভর্তি
            </button>
          </div>
        </div>

        {/* শিক্ষার্থী তালিকা */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <Users className="text-blue-600" /> শিক্ষার্থী তালিকা ({filteredStudents.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-[#1e4db7] font-bold text-2xl shadow-inner">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">শ্রেণী: <span className="text-blue-600 font-bold">{student.class}</span> | রোল: <span className="text-blue-600 font-bold">{student.roll}</span></p>
                    <p className={`text-sm font-bold mt-1 ${student.dues > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      মোট বকেয়া: ৳{student.dues}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => {
                    const msg = `আসসালামু আলাইকুম, ${student.name}-এর মোট বকেয়া ${student.dues} টাকা। দ্রুত পরিশোধের অনুরোধ রইল।`;
                    navigator.clipboard.writeText(msg); alert("বকেয়া মেসেজ কপি হয়েছে!");
                  }} className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl text-[11px] font-bold text-slate-600 border border-slate-100">
                    <Copy size={14} className="text-blue-500" /> বকেয়া কপি
                  </button>

                  <button onClick={() => setSelectedStudent(student)} className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl text-[11px] font-bold text-slate-600 border border-slate-100">
                    <CheckCircle size={14} className="text-green-500" /> বকেয়া পরিশোধ
                  </button>

                  <button onClick={() => {
                    const msg = `আসসালামু আলাইকুম, আজ আপনার সন্তান ${student.name} স্কুলে অনুপস্থিত। - আল-আজহার স্কুল।`;
                    navigator.clipboard.writeText(msg); alert("অনুপস্থিতি মেসেজ কপি হয়েছে!");
                  }} className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl text-[11px] font-bold text-slate-600 border border-slate-100">
                    <MessageSquareOff size={14} className="text-orange-500" /> অনুপস্থিতি কপি
                  </button>

                  <button onClick={() => window.location.href = `tel:${student.phone}`} className="flex items-center justify-center gap-2 bg-[#1e4db7] py-3 rounded-2xl text-[11px] font-bold text-white shadow-md">
                    <PhoneCall size={14} /> কল করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* বকেয়া পরিশোধ পপ-আপ (Modal) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl">
            <div className="bg-[#1e4db7] p-6 text-white text-center relative">
              <button onClick={() => setSelectedStudent(null)} className="absolute right-6 top-6 bg-white/20 p-1 rounded-full"><X size={20}/></button>
              <h2 className="text-xl font-bold">বকেয়া পরিশোধ ফরম</h2>
              <p className="text-sm opacity-80">{selectedStudent.name}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">পূর্বের বকেয়া ফি</label>
                  <input type="number" onChange={(e) => setPayFields({...payFields, prevDues: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">মাসিক বেতন</label>
                  <input type="number" onChange={(e) => setPayFields({...payFields, monthlyFee: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">পরীক্ষা ফি</label>
                  <input type="number" onChange={(e) => setPayFields({...payFields, examFee: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 block mb-1 underline cursor-pointer hover:text-blue-800" onClick={() => {
                    const label = prompt("ফি-এর নাম লিখুন (যেমন: ড্রেস ফি):");
                    if(label) setPayFields({...payFields, customLabel: label});
                  }}>{payFields.customLabel}</label>
                  <input type="number" onChange={(e) => setPayFields({...payFields, customFee: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold" placeholder="0" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex justify-between items-center border border-blue-100">
                <span className="font-bold text-slate-600 text-sm md:text-base">মোট জমা হবে:</span>
                <span className="text-2xl font-black text-[#1e4db7]">৳{totalPayment}</span>
              </div>

              <button onClick={confirmPayment} className="w-full bg-[#1e4db7] text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all">কনফার্ম করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* নতুন ভর্তি ফরম (Modal) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
            <div className="bg-[#1e4db7] p-6 text-white text-center relative">
              <button onClick={() => setShowAddModal(false)} className="absolute right-6 top-6 bg-white/20 p-1 rounded-full"><X size={20}/></button>
              <h2 className="text-xl font-bold">নতুন ছাত্র/ছাত্রী ভর্তি ফরম</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">ছাত্রের নাম</label>
                <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" placeholder="নাম লিখুন" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">শ্রেণী নির্বাচন</label>
                  <select className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold">
                    {classes.map(c => <option key={c} value={c}>{c} শ্রেণী</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">রোল নং</label>
                  <input type="number" className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">অভিভাবকের মোবাইল</label>
                <input type="tel" className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" placeholder="017XXXXXXXX" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">প্রাথমিক বকেয়া (যদি থাকে)</label>
                <input type="number" className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" placeholder="0" />
              </div>
              <button className="w-full bg-[#1e4db7] text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-lg active:scale-95 transition-all">ভর্তি সম্পন্ন করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* ফুটার */}
      <footer className="mt-12 text-center">
        <img src="/gias.jpg" alt="Gias" className="w-20 h-20 rounded-[25px] mx-auto border-4 border-white shadow-xl mb-2 object-cover" />
        <p className="font-bold text-slate-800 text-lg">গিয়াস উদ্দিন</p>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">App Developer</p>
      </footer>
    </div>
  );
}

export default App;
