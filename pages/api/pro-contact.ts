// pages/api/pro-contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Configure ta connexion PostgreSQL (mettre la variable dans .env.local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    businessName, businessType, firstName, lastName,
    jobTitle, phone, email, address, note
  } = req.body;

  if (
    !businessName || !businessType || !firstName || !lastName ||
    !jobTitle || !phone || !email || !address
  ) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  try {
    await pool.query(
      `INSERT INTO professional_contacts
        (business_name, business_type, first_name, last_name, job_title, phone, email, address, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [businessName, businessType, firstName, lastName, jobTitle, phone, email, address, note]
    );
    return res.status(200).json({ ok: true });
  } catch (e: unknown) {
    // Optionnel : log error pour debug
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Erreur inconnue", e);
    }
    return res.status(500).json({ error: "Erreur d’enregistrement en base" });
  }
}
