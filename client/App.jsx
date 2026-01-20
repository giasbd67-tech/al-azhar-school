import React, { useState } from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1b6535', borderBottom: '2px solid #1b6535', paddingBottom: '10px' }}>
          স্বাগতম, অ্যাডমিন প্যানেলে
        </h3>
        <p style={{ marginTop: '15px', color: '#666' }}>
          আপনার স্টুডেন্ট ম্যানেজমেন্ট সিস্টেম এখন ভেরসেলে লাইভ হতে প্রস্তুত। আপনি এখান থেকে ছাত্রদের তথ্য নিয়ন্ত্রণ করতে পারবেন।
        </p>
        
        {/* আপনি চাইলে পরে আপনার Replit-এর মূল কোডগুলো এখানে বসিয়ে আপডেট করতে পারেন */}
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '5px' }}>
          <strong>ফিচারসমূহ শীঘ্রই আসছে:</strong>
          <ul style={{ marginTop: '10px' }}>
            <li>ছাত্র ভর্তি ফরম</li>
            <li>বেতন কালেকশন</li>
            <li>রেজাল্ট পাবলিশিং</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
