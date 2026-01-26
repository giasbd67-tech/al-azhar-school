/**
 * স্মার্ট স্কুল ম্যানেজমেন্ট সিস্টেম
 * অ্যাপ ডেভেলপার: গিয়াস উদ্দিন
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Wallet, QrCode, 
  Send, Plus, Landmark, TrendingUp, TrendingDown, 
  CheckCircle, School, Download, BrainCircuit, Banknote, BadgeCheck
} from 'lucide-react';

const toBn = (n: any) => n?.toLocaleString('bn-BD') || "০";

export default function SchoolApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState<any>({ total_dues: 0, today_collection: 0, total_teacher_dues: 0, total_expense: 0 });
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => { loadAllData(); }, [activeTab]);

  const loadAllData = async () => {
    try {
      const [st, stat, ai, tc] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/ai/insights').then(r => r.json()),
        fetch('/api/teachers').then(r => r.json())
      ]);
      setStudents(st); setStats(stat); setAiInsights(ai); setTeachers(tc);
    } catch (e) { console.error("Error loading data"); }
  };

  const paySalary = async (id: number, name: string, dues: number) => {
    const amount = prompt(`${name}-কে কত টাকা স্যালারি দিতে চান? (বকেয়া: ${dues})`);
    if (!amount || isNaN(Number(amount))) return;
    await fetch('/api/teachers/pay-salary', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id, name, amount: Number(amount) })
    });
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans antialiased">
      <nav className="bg-[#1E293B] text-white p-5 sticky top-0 z-50 shadow-2xl flex justify-between items-center rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2.5 rounded-2xl text-slate-900 shadow-lg">
            <School size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight">আল-আজহার স্কুল</h1>
            <p className="text-[9px] uppercase font-bold text-yellow-400 tracking-widest italic">Smart School OS</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setActiveTab('qr')} className="text-slate-400 hover:text-white"><QrCode/></button>
           <button onClick={() => setActiveTab('dashboard')} className="text-slate-400 hover:text-white"><LayoutDashboard/></button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox title="ছাত্র বকেয়া" value={stats.total_dues} color="border-orange-500" icon={<Landmark/>}/>
              <StatBox title="আজকের আদায়" value={stats.today_collection} color="border-emerald-500" icon={<TrendingUp/>}/>
              <StatBox title="শিক্ষক বকেয়া" value={stats.total_teacher_dues} color="border-rose-500" icon={<Banknote/>}/>
              <StatBox title="মোট খরচ" value={stats.total_expense} color="border-blue-500" icon={<TrendingDown/>}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2.5rem] text-white shadow-xl">
                 <h3 className="font-bold text-sm mb-4 tracking-tight">ছাত্র মাসিক ফি জেনারেট</h3>
                 <button onClick={() => fetch('/api/billing/auto', {method:'POST'}).then(() => loadAllData())} className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">রান অটো-বিলিং</button>
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-6 rounded-[2.5rem] text-white shadow-xl">
                 <h3 className="font-bold text-sm mb-4 tracking-tight">শিক্ষক স্যালারি জেনারেট</h3>
                 <button onClick={() => fetch('/api/teachers/generate-salary', {method:'POST'}).then(() => loadAllData())} className="bg-white text-rose-700 px-8 py-3 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">রান অটো-স্যালারি</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
               <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4"><BrainCircuit className="text-indigo-600"/> AI পারফরম্যান্স এলার্ট</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiInsights.map((st:any, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                       <span className="font-black text-xs text-slate-700">{st.name}</span>
                       <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full uppercase">অ্যাকশন প্রয়োজন</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <MenuBtn label="শিক্ষার্থী" icon={<Users/>} onClick={() => setActiveTab('students')} color="bg-blue-50 text-blue-600"/>
              <MenuBtn label="শিক্ষক" icon={<UserCheck/>} onClick={() => setActiveTab('teachers')} color="bg-rose-50 text-rose-600"/>
              <MenuBtn label="হাজিরা" icon={<QrCode/>} onClick={() => setActiveTab('qr')} color="bg-emerald-50 text-emerald-600"/>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500">
            {teachers.map((t: any) => (
              <div key={t.id} className="bg-white p-7 rounded-[3rem] shadow-sm border border-slate-100 relative group transition-all hover:shadow-2xl">
                <div className="flex justify-between items-start mb-5">
                   <div className="bg-rose-50 p-4 rounded-3xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all"><UserCheck size={24}/></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.designation}</span>
                </div>
                <h3 className="font-black text-xl text-slate-800 mb-6">{t.name}</h3>
                <div className={`p-5 rounded-[2rem] flex justify-between items-center mb-6 ${t.salary_dues > 0 ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                   <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">পাওনা বেতন</span>
                      <span className={`text-2xl font-black ${t.salary_dues > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>৳{toBn(t.salary_dues)}</span>
                   </div>
                   {t.salary_dues === 0 && <BadgeCheck className="text-emerald-500" size={30}/>}
                </div>
                <button 
                  disabled={t.salary_dues <= 0}
                  onClick={() => paySalary(t.id, t.name, t.salary_dues)}
                  className={`w-full py-4 rounded-[1.5rem] font-black text-xs shadow-lg transition-all ${t.salary_dues > 0 ? 'bg-[#0F172A] text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                >
                  স্যালারি প্রদান করুন
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-5 flex justify-between items-center px-10 shadow-2xl rounded-t-[2.5rem]">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Developed By</span>
          <span className="text-sm font-black text-blue-700 tracking-tight">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</span>
        </div>
        <div className="flex gap-8 text-slate-300">
           <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-600' : ''}><LayoutDashboard size={24}/></button>
           <button onClick={() => setActiveTab('teachers')} className={activeTab === 'teachers' ? 'text-blue-600' : ''}><UserCheck size={24}/></button>
           <button onClick={() => setActiveTab('students')} className={activeTab === 'students' ? 'text-blue-600' : ''}><Users size={24}/></button>
           <button onClick={() => setActiveTab('qr')} className={activeTab === 'qr' ? 'text-blue-600' : ''}><QrCode size={24}/></button>
        </div>
      </footer>
    </div>
  );
}

function StatBox({title, value, color, icon}: any) {
  return (
    <div className={`bg-white p-5 rounded-[2rem] shadow-sm border-b-4 ${color}`}>
      <div className="flex justify-between items-center mb-2 font-black text-slate-400 text-[10px] uppercase">
        {title} {icon}
      </div>
      <h2 className="text-xl font-black text-slate-800">৳{toBn(value || 0)}</h2>
    </div>
  );
}

function MenuBtn({label, icon, onClick, color}: any) {
  return (
    <button onClick={onClick} className={`${color} p-6 rounded-[2.5rem] flex flex-col items-center gap-2 font-black text-[10px] uppercase shadow-sm active:scale-90 transition-all border border-white`}>
      {icon} {label}
    </button>
  );
}
