/**
 * স্মার্ট স্কুল ম্যানেজমেন্ট সিস্টেম (Full UI & Logic)
 * অ্যাপ ডেভেলপার: গিয়াস উদ্দিন
 */
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Wallet, QrCode, 
  Plus, Landmark, TrendingUp, TrendingDown, 
  School, X, PhoneCall, Copy, FileX, MapPin, Banknote, History, Search
} from 'lucide-react';

const toBn = (n: any) => n?.toLocaleString('bn-BD') || "০";

export default function SchoolApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('সব শ্রেণী');

  useEffect(() => { loadAllData(); }, [activeTab]);

  const loadAllData = async () => {
    try {
      const [st, stat, tc] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/teachers').then(r => r.json())
      ]);
      setStudents(st); setStats(stat); setTeachers(tc);
    } catch (e) { console.error("Error loading data"); }
  };

  const filteredStudents = students.filter((s:any) => 
    (selectedClass === 'সব শ্রেণী' || s.class_name === selectedClass) &&
    (s.name.includes(searchTerm) || s.roll.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans antialiased">
      
      {/* হেডার সেকশন */}
      <header className="bg-[#1E3A8A] text-white p-10 text-center rounded-b-[3.5rem] shadow-2xl relative">
        <div className="bg-yellow-400 w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-blue-900 shadow-lg">
          <School size={30} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase">
          আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ
        </h1>
        <div className="flex items-center justify-center gap-1.5 mt-2 opacity-80">
          <MapPin size={12} className="text-yellow-400" />
          <p className="text-[11px] font-bold">ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী।</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5 -mt-10 relative z-20">
        
        {/* ড্যাশবোর্ড ট্যাব */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="ছাত্র বকেয়া" value={stats.total_dues} icon={<Landmark/>} color="text-orange-500" />
              <StatCard title="আজকের আদায়" value={stats.today_collection} icon={<TrendingUp/>} color="text-emerald-500" />
              <StatCard title="শিক্ষক বকেয়া" value={stats.total_teacher_dues} icon={<Banknote/>} color="text-rose-500" />
              <StatCard title="মোট খরচ" value={stats.total_expense} icon={<TrendingDown/>} color="text-blue-500" />
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2 px-2">
                 <h3 className="font-black text-slate-800 text-sm flex items-center gap-2"><History size={16}/> অটো-বিলিং সিস্টেম</h3>
              </div>
              <button 
                onClick={() => fetch('/api/billing/auto', {method:'POST'}).then(loadAllData)}
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-lg active:scale-95 transition-all"
              >
                রান অটো-বিলিং (ছাত্র)
              </button>
              <button 
                onClick={() => fetch('/api/teachers/generate-salary', {method:'POST'}).then(loadAllData)}
                className="w-full bg-rose-600 text-white py-5 rounded-3xl font-black shadow-lg active:scale-95 transition-all"
              >
                রান অটো-স্যালারি (শিক্ষক)
              </button>
            </div>
          </div>
        )}

        {/* শিক্ষার্থী ট্যাব */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                <input 
                  type="text" placeholder="নাম বা রোল দিয়ে খুঁজুন..." 
                  className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 ring-blue-100"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option>সব শ্রেণী</option><option>১ম</option><option>২য়</option><option>৩য়</option>
                </select>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2"><Plus size={16}/> নতুন ভর্তি</button>
              </div>
            </div>

            {filteredStudents.map((st:any) => (
              <div key={st.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={20}/></div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800">{st.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">রোল: {toBn(st.roll)} | শ্রেণী: {st.class_name}</p>
                  </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl flex justify-between items-center mb-5 border border-rose-100">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">মোট বকেয়া:</span>
                  <span className="text-xl font-black text-rose-600">৳{toBn(st.dues)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn label="বকেয়া পরিশোধ" icon={<Wallet size={14}/>} color="bg-emerald-50 text-emerald-600"/>
                  <ActionBtn label="বকেয়া কপি" icon={<Copy size={14}/>} color="bg-orange-50 text-orange-600"/>
                  <ActionBtn label="অনুপস্থিতি কপি" icon={<FileX size={14}/>} color="bg-rose-50 text-rose-600"/>
                  <ActionBtn label="কল দিন" icon={<PhoneCall size={14}/>} color="bg-slate-900 text-white" onClick={() => window.open(`tel:${st.phone}`)}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* শিক্ষক ট্যাব */}
        {activeTab === 'teachers' && (
          <div className="grid grid-cols-1 gap-4">
            {teachers.map((t: any) => (
              <div key={t.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-5 text-rose-600 font-black text-[10px] uppercase tracking-widest">{t.designation}</div>
                <h3 className="font-black text-xl text-slate-800 mb-4">{t.name}</h3>
                <div className="p-5 rounded-[2rem] bg-slate-50 flex justify-between items-center mb-6 border border-slate-100">
                   <span className="text-[9px] font-black uppercase text-slate-400">বকেয়া বেতন</span>
                   <span className="text-2xl font-black text-rose-600">৳{toBn(t.salary_dues)}</span>
                </div>
                <button className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black text-xs active:scale-95 transition-all">স্যালারি প্রদান করুন</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ভর্তি ফরম পপআপ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-400 bg-slate-50 p-2 rounded-full"><X/></button>
            <h2 className="text-2xl font-black mb-8 text-blue-600 flex items-center gap-2"><Plus className="bg-blue-50 p-1 rounded-lg"/> ভর্তি ফরম</h2>
            <form className="space-y-4">
              <input placeholder="শিক্ষার্থীর নাম" className="form-input" />
              <input placeholder="পিতার নাম" className="form-input" />
              <div className="grid grid-cols-2 gap-3">
                <select className="form-input"><option>ছাত্র</option><option>ছাত্রী</option></select>
                <input placeholder="রোল নং" className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className="form-input"><option>১ম</option><option>২য়</option><option>৩য়</option></select>
                <input placeholder="মোবাইল নং" className="form-input" />
              </div>
              <textarea placeholder="বর্তমান ঠিকানা" className="form-input h-20 pt-4"></textarea>
              <div className="grid grid-cols-2 gap-2 border-t pt-4">
                <input placeholder="মাসিক বেতন" className="form-input text-xs" />
                <input placeholder="পরীক্ষা ফি" className="form-input text-xs" />
                <input placeholder="অন্যান্য ফি" className="form-input text-xs" />
                <input placeholder="পূর্বের বকেয়া" className="form-input text-xs" />
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg mt-4 active:scale-95 transition-all">ভর্তি নিশ্চিত করুন</button>
            </form>
          </div>
        </div>
      )}

      {/* ফুটার ব্র্যান্ডিং (স্থায়ী) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t p-6 flex justify-between items-center px-10 shadow-2xl rounded-t-[3rem] z-50">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Developed By</span>
          <span className="text-xs font-black text-blue-700 tracking-tight">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
        <div className="flex gap-8 text-slate-300">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-600 scale-125' : ''}><LayoutDashboard size={22}/></button>
          <button onClick={() => setActiveTab('students')} className={activeTab === 'students' ? 'text-blue-600 scale-125' : ''}><Users size={22}/></button>
          <button onClick={() => setActiveTab('teachers')} className={activeTab === 'teachers' ? 'text-blue-600 scale-125' : ''}><UserCheck size={22}/></button>
          <button onClick={() => setActiveTab('qr')} className={activeTab === 'qr' ? 'text-blue-600 scale-125' : ''}><QrCode size={22}/></button>
        </div>
      </footer>

      <style>{`.form-input { @apply w-full bg-slate-50 border-none p-4 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-100 transition-all text-sm shadow-inner; }`}</style>
    </div>
  );
}

function StatCard({title, value, icon, color}: any) {
  return (
    <div className="bg-white p-5 rounded-[2.5rem] shadow-sm flex flex-col items-center border border-white transition-all hover:shadow-md">
      <div className={`mb-2 ${color} bg-slate-50 p-3 rounded-2xl`}>{icon}</div>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{title}</p>
      <h2 className="text-xl font-black text-slate-800">৳{toBn(value || 0)}</h2>
    </div>
  );
}

function ActionBtn({label, icon, color, onClick}: any) {
  return (
    <button onClick={onClick} className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-tighter ${color} shadow-sm active:scale-95 transition-all`}>
      {icon} {label}
    </button>
  );
}
