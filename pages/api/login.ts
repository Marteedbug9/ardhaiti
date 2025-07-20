import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Initialisation du pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: "Missing credentials." });
  }

  try {
    // Recherche par email OU téléphone
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [identifier]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Vérifie que le champ "role" existe (user.role peut être 'user' ou 'admin')
    const role = user.role || "user";

    // Authentification réussie
    return res.status(200).json({ ok: true, userId: user.id, role });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error." });
  }
}
