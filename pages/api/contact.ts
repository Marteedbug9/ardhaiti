import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, subject, message } = req.body;
  if (!firstName || !lastName || !email || !subject || !message)
    return res.status(400).json({ error: 'Missing required fields.' });

  if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email address.' });

  try {
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

    await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, subject, message, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [firstName, lastName, email, subject, message]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    // Correction propre sans suppression de type
    if (typeof err === "object" && err !== null) {
      if ("response" in err) {
        console.error("EMAIL ERROR:", (err as { response: unknown }).response);
      }
      if ("code" in err) {
        console.error("CODE ERROR:", (err as { code: string; message: string }).code, (err as { code: string; message: string }).message);
      }
    }
    console.error("FULL ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
