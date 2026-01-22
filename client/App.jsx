import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* হেডার অংশ: প্রতিষ্ঠানের নাম ও ঠিকানা */}
      <header className="bg-green-800 text-white py-6 shadow-xl border-b-4 border-yellow-500">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            আল-আজহার ইন্টারন্যাশনাল স্কুল এন্ড কলেজ
          </h1>
          <p className="text-sm md:text-base mt-2 font-medium opacity-90">
            ঠিকানাঃ নদোনা বাজার, সোনাইমুড়ী, নোয়াখালী
          </p>
          <div className="inline-block mt-3 px-4 py-1 bg-yellow-500 text-green-900 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest">
            স্টুডেন্ট ম্যানেজমেন্ট সিস্টেম
          </div>
        </div>
      </header>

      {/* মূল কন্টেন্ট অংশ (এখানে আপনার ড্যাশবোর্ড বা অন্যান্য তথ্য থাকবে) */}
      <main className="flex-grow bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">স্বাগতম!</h2>
          <p className="text-gray-500 mt-2">আপনার সিস্টেমটি সঠিকভাবে কাজ করছে।</p>
        </div>
      </main>

      {/* ফুটার অংশ: ডেভেলপার তথ্য */}
      <footer className="bg-gray-900 text-gray-300 py-4 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-sm md:text-base font-semibold">
            অ্যাপ ডেভেলপারঃ গিয়াস উদ্দিন
          </p>
          <p className="text-xs mt-1 text-gray-500">
            &copy; {new Date().getFullYear()} অল রাইটস রিজার্ভড।
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
