import express from 'express';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// আপনার Neon Database URL সেট করা হলো
const sql = neon('postgresql://neondb_owner:npg_oNZ3ePz8iuWG@ep-round-pine-a1siydqx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

// --- স্টুডেন্ট API ---
app.get('/api/students', async (req, res) => {
  const result = await sql`SELECT * FROM students ORDER BY id DESC`;
  res.json(result);
});

app.post('/api/students', async (req, res) => {
  const { name, father_name, address, gender, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues, total_dues } = req.body;
  const result = await sql`
    INSERT INTO students (name, father_name, address, gender, class_name, roll, phone, monthly_fee, exam_fee, other_fee, previous_dues, total_dues)
    VALUES (${name}, ${father_name}, ${address}, ${gender}, ${class_name}, ${roll}, ${phone}, ${monthly_fee}, ${exam_fee}, ${other_fee}, ${previous_dues}, ${total_dues})
    RETURNING *`;
  res.json(result[0]);
});

// --- শিক্ষক API ---
app.get('/api/teachers', async (req, res) => {
  const result = await sql`SELECT * FROM teachers ORDER BY id DESC`;
  res.json(result);
});

app.post('/api/teachers', async (req, res) => {
  const { name, designation, salary, phone } = req.body;
  const result = await sql`
    INSERT INTO teachers (name, designation, salary, phone, salary_dues)
    VALUES (${name}, ${designation}, ${salary}, ${phone}, ${salary})
    RETURNING *`;
  res.json(result[0]);
});

app.listen(3000, () => console.log('সার্ভার রানিং অন পোর্ট ৩০০০'));
