import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ATTENTION : cette variable doit être dans le .env DU DOSSIER FRONTEND car tu utilises une API route Next.js (hébergée sur Vercel/Render)
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { firstName, lastName, email, phone, address, city, state, zipcode, yearOfBirth, password } = req.body;

  // Validation rapide
  if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipcode || !yearOfBirth || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email." });
  }
  if (!/^\d+$/.test(phone)) {
    return res.status(400).json({ error: "Phone must be numeric." });
  }
  const age = new Date().getFullYear() - parseInt(yearOfBirth, 10);
  if (age < 18) {
    return res.status(400).json({ error: "You must be at least 18 years old." });
  }

  try {
    // Email ou phone déjà pris ?
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR phone = $2",
      [email, phone]
    );
    if (rows.length > 0) {
      return res.status(400).json({ error: "Email or phone already exists." });
    }

    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Insertion
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, address, city, state, zipcode, year_of_birth, password)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [firstName, lastName, email, phone, address, city, state, zipcode, yearOfBirth, hashed]
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
}
