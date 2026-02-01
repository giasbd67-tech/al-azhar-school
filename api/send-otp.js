// api/send-otp.js (Node.js/Nodemailer)
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // আপনার জিমেইল
      pass: 'your-app-password' // জিমেইল অ্যাপ পাসওয়ার্ড
    }
  });

  try {
    await transporter.sendMail({
      from: '"Al-Azhar School" <your-email@gmail.com>',
      to: 'giasbd67@gmail.com',
      subject: 'Login OTP for School Management',
      text: 'Your security OTP code is: 1234'
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
