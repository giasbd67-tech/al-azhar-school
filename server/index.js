import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());

// আপনার Neon Database URL এখানে দিন
const sql = neon('YOUR_NEON_DATABASE_URL_HERE');

// ১. শিক্ষকদের সব তথ্য নিয়ে আসা
app.get('/api/teachers', async (req, res) => {
  const result = await sql`SELECT * FROM teachers ORDER BY id DESC`;
  res.json(result);
});

// ২. নতুন শিক্ষক যোগ করা
app.post('/api/teachers', async (req, res) => {
  const { name, designation, salary, phone } = req.body;
  const result = await sql`
    INSERT INTO teachers (name, designation, salary_amount, phone)
    VALUES (${name}, ${designation}, ${salary}, ${phone})
    RETURNING *`;
  res.json(result[0]);
});

// ৩. শিক্ষক স্যালারি আপডেট (বেতন পরিশোধ করলে)
app.put('/api/teachers/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const result = await sql`
    UPDATE teachers 
    SET paid_salary = paid_salary + ${amount}, 
        due_salary = salary_amount - (paid_salary + ${amount})
    WHERE id = ${id} RETURNING *`;
  res.json(result[0]);
});

app.listen(3000, () => console.log('সার্ভার রানিং অন পোর্ট ৩০০০'));
