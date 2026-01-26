/**
 * প্রজেক্ট: আল-আজহার স্কুল ম্যানেজমেন্ট (Full Suite)
 * অ্যাপ ডেভেলপার: গিয়াস উদ্দিন (Permanent Branding)
 */

import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// ড্যাশবোর্ড স্ট্যাটস
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

// অটো-বিলিং সিস্টেম
app.post('/api/billing/auto', async (req, res) => {
  try {
    await sql`UPDATE students SET dues = dues + monthly_fee`;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// টিচার স্যালারি প্রদান
app.post('/api/teachers/pay-salary', async (req, res) => {
  const { id, name, amount } = req.body;
  try {
    await sql`UPDATE teachers SET salary_dues = salary_dues - ${amount} WHERE id = ${id}`;
    await sql`INSERT INTO expenses (title, amount, category) VALUES (${'Salary: ' + name}, ${amount}, 'Salary')`;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// মাসিক স্যালারি জেনারেট
app.post('/api/teachers/generate-salary', async (req, res) => {
  try {
    await sql`UPDATE teachers SET salary_dues = salary_dues + monthly_salary`;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/students', async (req, res) => res.json(await sql`SELECT * FROM students ORDER BY id DESC`));
app.get('/api/teachers', async (req, res) => res.json(await sql`SELECT * FROM teachers ORDER BY id DESC`));
app.get('/api/expenses', async (req, res) => res.json(await sql`SELECT * FROM expenses ORDER BY date DESC`));
app.get('/api/ai/insights', async (req, res) => res.json(await sql`SELECT name, performance_score, dues FROM students WHERE performance_score < 50 OR dues > 5000 LIMIT 5`));

export default app;
