/**
 * স্মার্ট স্কুল ম্যানেজমেন্ট সিস্টেম - ব্যাকএন্ড
 * অ্যাপ ডেভেলপার: গিয়াস উদ্দিন
 */
import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);

// ১. ড্যাশবোর্ড স্ট্যাটাস (AI Analytics Data)
app.get('/api/dashboard', async (req, res) => {
  try {
    const stats = await sql`
      SELECT 
        (SELECT COALESCE(SUM(dues), 0) FROM students) as total_dues,
        (SELECT COALESCE(SUM(amount), 0) FROM payment_history WHERE date::date = CURRENT_DATE) as today_collection,
        (SELECT COALESCE(SUM(salary_dues), 0) FROM teachers) as total_teacher_dues,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses) as total_expense,
        (SELECT COUNT(*) FROM students) as total_students
    `;
    res.json(stats[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ২. ছাত্র/ছাত্রী ম্যানেজমেন্ট (CRUD)
app.get('/api/students', async (req, res) => {
  const data = await sql`SELECT * FROM students ORDER BY id DESC`;
  res.json(data);
});

app.post('/api/students', async (req, res) => {
  const { name, father_name, gender, address, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues } = req.body;
  
  // অটোমেটিক মোট বকেয়া ক্যালকুলেশন
  const total_dues = Number(monthly_fee) + Number(exam_fee) + Number(other_fee) + Number(previous_dues);

  try {
    await sql`INSERT INTO students 
      (name, father_name, gender, address, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues, dues) 
      VALUES (${name}, ${father_name}, ${gender}, ${address}, ${class_name}, ${roll}, ${phone}, ${monthly_fee}, ${exam_fee}, ${other_fee}, ${previous_dues}, ${total_dues})`;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/students/:id', async (req, res) => {
  await sql`DELETE FROM students WHERE id = ${req.params.id}`;
  res.json({ success: true });
});

app.put('/api/students/:id', async (req, res) => {
    // এডিট লজিক এখানে যুক্ত করা যাবে, আপাতত ফ্রন্টএন্ড থেকে নতুন করে সেভ করা হচ্ছে
    res.json({ success: true });
});

// ৩. পেমেন্ট গেটওয়ে (বকেয়া বিয়োগ)
app.post('/api/students/pay', async (req, res) => {
  const { id, amount } = req.body;
  try {
    await sql`INSERT INTO payment_history (student_id, amount) VALUES (${id}, ${amount})`;
    await sql`UPDATE students SET dues = dues - ${amount}, last_payment_date = CURRENT_DATE WHERE id = ${id}`;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ৪. শিক্ষক ও অটোমেশন
app.get('/api/teachers', async (req, res) => res.json(await sql`SELECT * FROM teachers ORDER BY id DESC`));

app.post('/api/billing/auto', async (req, res) => {
  await sql`UPDATE students SET dues = dues + monthly_fee`;
  res.json({ success: true });
});

app.post('/api/teachers/salary', async (req, res) => {
  await sql`UPDATE teachers SET salary_dues = salary_dues + monthly_salary`;
  res.json({ success: true });
});

export default app;
