import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// ১. শিক্ষার্থীদের তালিকা দেখা (Read)
app.get('/api', async (req, res) => {
  try {
    const data = await sql`SELECT * FROM students ORDER BY id DESC`;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ২. নতুন শিক্ষার্থী ভর্তি করা (Create)
app.post('/api', async (req, res) => {
  const { name, class_name, roll, phone, dues } = req.body;
  try {
    await sql`INSERT INTO students (name, class_name, roll, phone, dues) VALUES (${name}, ${class_name}, ${roll}, ${phone}, ${dues})`;
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ৩. শিক্ষার্থীর তথ্য সংশোধন করা (Update)
app.put('/api/:id', async (req, res) => {
  const { id } = req.params;
  const { name, class_name, roll, phone, dues } = req.body;
  try {
    await sql`UPDATE students SET name=${name}, class_name=${class_name}, roll=${roll}, phone=${phone}, dues=${dues} WHERE id=${id}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ৪. শিক্ষার্থী ডিলিট করা (Delete)
app.delete('/api/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM students WHERE id = ${id}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
