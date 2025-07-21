// pages/api/pro-contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg"; // ou ta lib db préférée

// Configure ta connexion PostgreSQL (à ajuster à ta stack/env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Met dans .env.local !
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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
  } catch (e: any) {
    // log l’erreur si besoin
    return res.status(500).json({ error: "Erreur d’enregistrement en base" });
  }
}
