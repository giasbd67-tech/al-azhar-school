import React, { useState } from 'react';
import { Plus, UserCheck, Phone, CreditCard, Trash2, X } from 'lucide-react';

const Teachers = ({ teachers, setTeachers }: any) => {
  const [showTForm, setShowTForm] = useState(false);
  const [tData, setTData] = useState({ name: '', designation: '', salary: '', phone: '' });

  const handleAddTeacher = () => {
    if (!tData.name || !tData.salary) return alert("নাম ও বেতন লিখুন!");
    const newTeacher = { ...tData, id: Date.now(), paid: 0 };
    setTeachers([newTeacher, ...teachers]);
    setShowTForm(false);
    setTData({ name: '', designation: '', salary: '', phone: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      {/* স্যালারি সামারি কার্ড */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[3rem] text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">মাসিক মোট স্যালারি বাজেট</p>
        <h2 className="text-4xl font-black mt-2">৳{teachers.reduce((a:any, b:any) => a + Number(b.salary), 0)}</h2>
        <div className="flex justify-between mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-[10px] opacity-70">পরিশোধিত</p>
            <p className="font-bold">৳০</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] opacity-70">বকেয়া স্যালারি</p>
            <p className="font-bold text-rose-200">৳০</p>
          </div>
        </div>
      </div>

      <button onClick={() => setShowTForm(true)} className="w-full bg-white border-2 border-dashed border-emerald-500 text-emerald-600 p-5 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all">
        <Plus /> নতুন শিক্ষক যোগ করুন
      </button>

      {/* শিক্ষক লিস্ট */}
      <div className="grid gap-4">
        {teachers.map((t: any) => (
          <div key={t.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-xl">
                {t.name[0]}
              </div>
              <div>
                <h4 className="font-black text-slate-800">{t.name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.designation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400">মাসিক বেতন</p>
              <h4 className="text-xl font-black text-emerald-600">৳{t.salary}</h4>
              <button className="mt-2 text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">পে-স্লিপ</button>
            </div>
          </div>
        ))}
      </div>

      {/* শিক্ষক যোগ করার ফরম */}
      {showTForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-end">
          <div className="bg-white w-full rounded-t-[3.5rem] p-8 space-y-5 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-slate-800">শিক্ষক নিবন্ধন</h2>
              <button onClick={() => setShowTForm(false)} className="p-2 bg-slate-100 rounded-full"><X/></button>
            </div>
            
            <input className="w-full p-5 bg-slate-50 rounded-2xl border-none text-lg font-bold" placeholder="শিক্ষকের নাম" onChange={e => setTData({...tData, name: e.target.value})} />
            <input className="w-full p-5 bg-slate-50 rounded-2xl border-none text-lg font-bold" placeholder="পদবী (যেমন: সিনিয়র টিচার)" onChange={e => setTData({...tData, designation: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" className="w-full p-5 bg-emerald-50 rounded-2xl border-none text-lg font-bold" placeholder="বেতন (৳)" onChange={e => setTData({...tData, salary: e.target.value})} />
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-none text-lg font-bold" placeholder="মোবাইল নং" onChange={e => setTData({...tData, phone: e.target.value})} />
            </div>

            <button onClick={handleAddTeacher} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100">যোগদান সম্পন্ন করুন</button>
          </div>
        </div>
      )}

      {/* ফুটার ব্র্যান্ডিং */}
      <div className="flex justify-center items-center gap-2 pt-10 opacity-50">
        <img src="/developer.jpg" className="w-6 h-6 rounded-full" alt="" />
        <p className="text-[10px] font-black italic">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
      </div>
    </div>
  );
};

export default Teachers;
