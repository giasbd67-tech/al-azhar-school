import React, { useState } from 'react';
import { QrCode, X, Camera, MessageSquare } from 'lucide-react';

// কিউআর স্ক্যানার ফিচার
const Scanner = ({ onScanClose, students }: any) => {
  const [scanResult, setScanResult] = useState<string | null>(null);

  // স্ক্যান করার পর হোয়াটসঅ্যাপ মেসেজ পাঠানোর লজিক
  const handleAttendance = (studentId: string) => {
    const student = students.find((s: any) => s.id.toString() === studentId);
    
    if (student) {
      const msg = `আসসালামু আলাইকুম, আপনার সন্তান ${student.name} আজ স্কুলে উপস্থিত হয়েছে। ধন্যবাদ। - আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ`;
      window.open(`https://wa.me/88${student.phone}?text=${encodeURIComponent(msg)}`, '_blank');
      alert(`${student.name}-এর হাজিরা নেওয়া হয়েছে এবং মেসেজ পাঠানো হয়েছে।`);
    } else {
      alert("স্টুডেন্ট খুঁজে পাওয়া যায়নি!");
    }
    setScanResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6 text-white">
      <div className="absolute top-8 right-8">
        <button onClick={onScanClose} className="p-3 bg-white/10 rounded-full">
          <X size={30} />
        </button>
      </div>

      <div className="text-center mb-10">
        <QrCode size={60} className="mx-auto text-blue-400 mb-4" />
        <h2 className="text-2xl font-black">কিউআর হাজিরা স্ক্যানার</h2>
        <p className="text-sm opacity-60">ক্যামেরা কিউআর কোডের সামনে ধরুন</p>
      </div>

      {/* স্ক্যানার ফ্রেম (মোবাইলের জন্য সিমুলেটেড) */}
      <div className="relative w-72 h-72 border-4 border-blue-500 rounded-[2rem] overflow-hidden flex items-center justify-center bg-slate-900 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
        <Camera size={40} className="opacity-20" />
        
        {/* স্ক্যানার এনিমেশন লাইন */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-lg animate-[bounce_2s_infinite]"></div>
      </div>

      <div className="mt-12 w-full max-w-xs space-y-4">
        <p className="text-center text-xs opacity-50 mb-4 font-bold">ম্যানুয়াল এন্ট্রি (টেস্ট করার জন্য)</p>
        <div className="flex gap-2">
           <input 
             type="text" 
             placeholder="স্টুডেন্ট আইডি লিখুন" 
             className="flex-1 p-4 bg-white/10 rounded-2xl outline-none border border-white/20"
             onChange={(e) => setScanResult(e.target.value)}
           />
           <button 
             onClick={() => scanResult && handleAttendance(scanResult)}
             className="bg-blue-600 p-4 rounded-2xl"
           >
             <MessageSquare />
           </button>
        </div>
      </div>

      <footer className="absolute bottom-10 flex flex-col items-center">
        <p className="text-[10px] font-black text-blue-400">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
      </footer>
    </div>
  );
};

export default Scanner;
