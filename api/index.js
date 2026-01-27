/**
 * প্রজেক্ট: আল-আজহার স্কুল স্মার্ট ম্যানেজমেন্ট
 * অ্যাপ ডেভেলপার: গিয়াস উদ্দিন
 */
import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);

// ১. ড্যাশবোর্ড ডাটা (বকেয়া ও কালেকশন)
app.get('/api/dashboard', async (req, res) => {
  try {
    const stats = await sql`
      SELECT 
        (SELECT COALESCE(SUM(dues), 0) FROM students) as total_dues,
        (SELECT COALESCE(SUM(amount), 0) FROM payment_history WHERE date >= CURRENT_DATE) as today_collection,
        (SELECT COALESCE(SUM(salary_dues), 0) FROM teachers) as total_teacher_dues,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses) as total_expense
    `;
    res.json(stats[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ২. অটো-বিলিং ও স্যালারি লজিক
app.post('/api/billing/auto', async (req, res) => {
  await sql`UPDATE students SET dues = dues + monthly_fee`;
  res.json({ success: true });
});

app.post('/api/teachers/generate-salary', async (req, res) => {
  await sql`UPDATE teachers SET salary_dues = salary_dues + monthly_salary`;
  res.json({ success: true });
});

// ৩. ডাটা এন্ট্রি ও রিড
app.get('/api/students', async (req, res) => res.json(await sql`SELECT * FROM students ORDER BY id DESC`));
app.get('/api/teachers', async (req, res) => res.json(await sql`SELECT * FROM teachers ORDER BY id DESC`));

app.post('/api/students', async (req, res) => {
  const { name, father_name, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues } = req.body;
  const initial_dues = Number(monthly_fee) + Number(exam_fee) + Number(other_fee) + Number(previous_dues);
  await sql`INSERT INTO students (name, father_name, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues, dues) 
            VALUES (${name}, ${father_name}, ${class_name}, ${roll}, ${phone}, ${monthly_fee}, ${exam_fee}, ${other_fee}, ${previous_dues}, ${initial_dues})`;
  res.json({ success: true });
});

export default app;
