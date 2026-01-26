import express from 'express';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// ছাত্রদের তালিকা দেখার রুট
app.get('/api', async (req, res) => {
  try {
    const data = await sql`SELECT * FROM students ORDER BY id DESC`;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// নতুন ছাত্র ভর্তি (ভর্তি ফরমের জন্য)
app.post('/api', async (req, res) => {
  const { name, class_name, roll, phone, dues } = req.body;
  try {
    await sql`INSERT INTO students (name, class_name, roll, phone, dues) VALUES (${name}, ${class_name}, ${roll}, ${phone}, ${dues})`;
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ছাত্র ডিলিট করার রুট
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
