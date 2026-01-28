import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);

// ১. ড্যাশবোর্ড ডাটা (AI Analytics)
app.get('/api/dashboard', async (req, res) => {
  const stats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM students) as total_students,
      (SELECT COALESCE(SUM(total_dues), 0) FROM students) as total_dues,
      (SELECT COALESCE(SUM(salary_dues), 0) FROM teachers) as teacher_dues,
      (SELECT COUNT(*) FROM teachers) as total_teachers
  `;
  res.json(stats[0]);
});

// ২. সব স্টুডেন্ট ডাটা
app.get('/api/students', async (req, res) => {
  const data = await sql`SELECT * FROM students ORDER BY id DESC`;
  res.json(data);
});

// ৩. নতুন স্টুডেন্ট ভর্তি (সেভ হওয়া নিশ্চিত করবে)
app.post('/api/students', async (req, res) => {
  const { name, father_name, address, gender, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues } = req.body;
  const total_dues = Number(monthly_fee) + Number(exam_fee) + Number(other_fee) + Number(previous_dues);
  
  try {
    const result = await sql`
      INSERT INTO students (name, father_name, address, gender, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues, total_dues)
      VALUES (${name}, ${father_name}, ${address}, ${gender}, ${class_name}, ${roll}, ${phone}, ${monthly_fee}, ${exam_fee}, ${other_fee}, ${previous_dues}, ${total_dues})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৪. বকেয়া পরিশোধ (বিয়োগ হওয়া নিশ্চিত করবে)
app.post('/api/students/pay', async (req, res) => {
  const { id, amount } = req.body;
  try {
    await sql`UPDATE students SET total_dues = total_dues - ${amount} WHERE id = ${id}`;
    await sql`INSERT INTO transactions (student_id, amount, type) VALUES (${id}, ${amount}, 'payment')`;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ৫. স্টুডেন্ট ডিলিট
app.delete('/api/students/:id', async (req, res) => {
  await sql`DELETE FROM students WHERE id = ${req.params.id}`;
  res.json({ success: true });
});

export default app;
