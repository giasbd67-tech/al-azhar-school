import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* হেডার অংশ: নাম, ঠিকানা ও সিস্টেম টাইটেল */}
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

      {/* মূল কন্টেন্ট অংশ */}
      <main className="flex-grow bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-700">স্বাগতম!</h2>
          <p className="text-gray-500 mt-2">আপনার ম্যানেজমেন্ট সিস্টেমটি এখন অনলাইনে সচল আছে।</p>
        </div>
      </main>

      {/* ফুটার অংশ: আপনার ছবি ও ডেভেলপার নাম */}
      <footer className="bg-gray-900 text-gray-300 py-6 border-t border-gray-700">
        <div className="container mx-auto text-center flex flex-col items-center">
          
          {/* ডেভেলপার ফটো (gias.jpg ফাইলটি আপনি রুট ফোল্ডারে আপলোড করেছেন) */}
          <div className="mb-3">
            <img 
              src="/gias.jpg" 
              alt="Gias Uddin" 
              className="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover shadow-2xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Gias' }}
            />
          </div>

          <p className="text-sm md:text-base font-semibold text-white">
            অ্যাপ ডেভেলপারঃ গিয়াস উদ্দিন
          </p>
          <p className="text-xs mt-1 text-gray-400">
            &copy; {new Date().getFullYear()} অল রাইটস রিজার্ভড।
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
