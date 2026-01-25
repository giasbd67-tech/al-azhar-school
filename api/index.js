const express = require('express');
const { neon } = require('@neondatabase/serverless');

const app = express();
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// সব ছাত্রের তালিকা আনা
app.get('/api', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM students ORDER BY class_name, roll ASC`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// নতুন ছাত্র যোগ করা
app.post('/api', async (req, res) => {
  const { name, class_name, roll, phone, dues } = req.body;
  try {
    await sql`INSERT INTO students (name, class_name, roll, phone, dues) VALUES (${name}, ${class_name}, ${roll}, ${phone}, ${dues})`;
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
