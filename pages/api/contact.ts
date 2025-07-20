import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';

// --- CONFIG PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// --- CONFIG EMAIL (Nodemailer) ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // exemple : 'smtp.gmail.com'
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465, // true pour 465, false pour 587
  auth: {
    user: process.env.SMTP_USER,      // ex: contact@ardhaiti.com
    pass: process.env.SMTP_PASS,      // mot de passe d’application
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, subject, message } = req.body;
  if (!firstName || !lastName || !email || !subject || !message)
    return res.status(400).json({ error: 'Missing required fields.' });

  // --- Validation simple d'email ---
  if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address.' });

  try {
    // 1. ENVOYER EMAIL
    await transporter.sendMail({
      from: `"Contact ARDH" <${process.env.SMTP_USER}>`,
      to: 'contact@ardhaiti.com',
      subject: `[Contact ARDH] ${subject}`,
      text: `
        New contact message from ARDH site:
        Name: ${firstName} ${lastName}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
      html: `
        <b>New contact message from ARDH site:</b><br>
        <b>Name:</b> ${firstName} ${lastName}<br>
        <b>Email:</b> ${email}<br>
        <b>Subject:</b> ${subject}<br>
        <b>Message:</b> <br>
        <pre style="font-family:inherit">${message}</pre>
      `
    });

    // 2. STOCKAGE EN BASE
    await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, subject, message, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [firstName, lastName, email, subject, message]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    // Tu peux logger plus d’infos ici si besoin :
    console.error('Contact error:', err);
    return res.status(500).json({ error: "Server error" });
  }
}
