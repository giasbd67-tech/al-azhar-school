// পেমেন্ট রিসিট ডিজাইন (প্রিন্ট ফ্রেন্ডলি)
const PaymentReceipt = ({ student, amount, date }: any) => {
  return (
    <div id="receipt-print" className="p-8 bg-white border-2 border-dashed border-slate-300 rounded-3xl max-w-md mx-auto text-slate-800">
      <div className="text-center border-b-2 border-slate-100 pb-4 mb-4">
        <h2 className="text-xl font-black text-indigo-900">আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">টাকা প্রাপ্তির রশিদ (Payment Receipt)</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">রশিদ নং:</span>
          <span className="font-bold">#{Math.floor(Math.random() * 10000)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">তারিখ:</span>
          <span className="font-bold">{date}</span>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
          <p className="text-xs text-slate-400 uppercase font-black">ছাত্রের তথ্য</p>
          <h3 className="font-black text-lg">{student.name}</h3>
          <p className="text-sm font-bold">শ্রেণী: {student.class_name} | রোল: {student.roll}</p>
        </div>

        <div className="py-4 border-y-2 border-slate-50 flex justify-between items-center">
          <span className="font-bold text-slate-600">জমার পরিমাণ:</span>
          <span className="text-2xl font-black text-indigo-600">৳{amount}</span>
        </div>

        <div className="flex justify-between text-xs font-bold text-slate-500 pt-2">
          <span>অবশিষ্ট বকেয়া:</span>
          <span>৳{student.total_dues - amount}</span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 italic">সফটওয়্যারটি তৈরি করেছেন</p>
        <p className="text-[12px] font-black text-indigo-900">অ্যাপ ডেভেলপার: গিয়াস উদ্দিন</p>
      </div>
      
      <div className="mt-6 flex gap-2 no-print">
        <button onClick={() => window.print()} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <Download size={16}/> প্রিন্ট করুন
        </button>
      </div>
    </div>
  );
};
