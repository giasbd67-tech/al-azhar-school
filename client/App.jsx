import React from 'react';

function App() {
  // ৮টি ফিচারের তালিকা
  const features = [
    { title: "ছাত্র তথ্য", icon: "👨‍🎓", desc: "সকল শিক্ষার্থীর ডাটাবেস" },
    { title: "অনলাইন হাজিরা", icon: "📅", desc: "দৈনিক উপস্থিতি ট্র্যাকিং" },
    { title: "পরীক্ষার ফলাফল", icon: "📝", desc: "মার্কশিট ও প্রগতি পত্র" },
    { title: "নোটিশ বোর্ড", icon: "📢", desc: "জরুরি ঘোষণা ও সংবাদ" },
    { title: "ক্লাস রুটিন", icon: "⏰", desc: "সাপ্তাহিক ক্লাসের সময়সূচী" },
    { title: "ফি ম্যানেজমেন্ট", icon: "💰", desc: "বেতন ও ফিস সংগ্রহ" },
    { title: "শিক্ষক প্রোফাইল", icon: "👨‍🏫", desc: "শিক্ষকদের তথ্য ও যোগাযোগ" },
    { title: "লাইব্রেরি", icon: "📚", desc: "বইয়ের তালিকা ও ইস্যু তথ্য" }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* হেডার */}
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

      {/* মূল কন্টেন্ট - ফিচার গ্রিড */}
      <main className="flex-grow bg-gray-50 p-6 md:p-12">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">ড্যাশবোর্ড ফিচারসমূহ</h2>
            <p className="text-gray-500 mt-2">আপনার স্কুলের সকল কার্যক্রম পরিচালনা করুন এখান থেকে</p>
          </div>

          {/* ফিচার কার্ডস গ্রিড (৮টি ফিচার) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold text-green-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ফুটার */}
      <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-700">
        <div className="container mx-auto text-center flex flex-col items-center">
          <div className="mb-4">
            <img 
              src="/gias.jpg" 
              alt="Gias Uddin" 
              className="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover shadow-2xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Gias' }}
            />
          </div>
          <p className="text-lg font-semibold text-white">অ্যাপ ডেভেলপারঃ গিয়াস উদ্দিন</p>
          <p className="text-xs mt-1 text-gray-400">&copy; {new Date().getFullYear()} অল রাইটস রিজার্ভড।</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
