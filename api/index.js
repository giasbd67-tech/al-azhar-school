import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // ডাটাবেস ইউআরএল চেক করা
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not set' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // ১. স্টুডেন্ট লিস্ট দেখা (GET)
    if (req.method === 'GET') {
      const students = await sql`SELECT * FROM students ORDER BY id DESC`;
      return res.status(200).json(students);
    }

    // ২. নতুন স্টুডেন্ট ভর্তি করা (POST)
    if (req.method === 'POST') {
      const { name, class_name, roll, phone, dues } = req.body;
      const result = await sql`
        INSERT INTO students (name, class_name, roll, phone, dues)
        VALUES (${name}, ${class_name}, ${roll}, ${phone}, ${dues})
        RETURNING *`;
      return res.status(201).json(result[0]);
    }

    // ৩. পেমেন্ট আপডেট করা (PUT)
    if (req.method === 'PUT') {
      const { id, dues } = req.body;
      const result = await sql`
        UPDATE students SET dues = ${dues} WHERE id = ${id} RETURNING *`;
      return res.status(200).json(result[0]);
    }

    // ৪. স্টুডেন্ট ডিলিট করা (DELETE)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM students WHERE id = ${id}`;
      return res.status(200).json({ message: 'Deleted' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database Connection Error' });
  }
}
