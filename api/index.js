/**
 * প্রজেক্ট: আল-আজহার স্কুল ম্যানেজমেন্ট (Full Suite)
 * অ্যাপ ডেভেলপার: গিয়াস উদ্দিন
 */
import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);

// ১. ড্যাশবোর্ড স্ট্যাটস
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

// ২. অটো-বিলিং ও স্যালারি জেনারেশন
app.post('/api/billing/auto', async (req, res) => {
  await sql`UPDATE students SET dues = dues + monthly_fee`;
  res.json({ success: true });
});

app.post('/api/teachers/generate-salary', async (req, res) => {
  await sql`UPDATE teachers SET salary_dues = salary_dues + monthly_salary`;
  res.json({ success: true });
});

// ৩. টিচার স্যালারি প্রদান
app.post('/api/teachers/pay-salary', async (req, res) => {
  const { id, name, amount } = req.body;
  await sql`UPDATE teachers SET salary_dues = salary_dues - ${amount} WHERE id = ${id}`;
  await sql`INSERT INTO expenses (title, amount, category) VALUES (${'Salary: ' + name}, ${amount}, 'Salary')`;
  res.json({ success: true });
});

// ৪. ডেটা রিড
app.get('/api/students', async (req, res) => res.json(await sql`SELECT * FROM students ORDER BY id DESC`));
app.get('/api/teachers', async (req, res) => res.json(await sql`SELECT * FROM teachers ORDER BY id DESC`));

export default app;
