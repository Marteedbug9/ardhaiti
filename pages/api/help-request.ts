import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ADMIN : voir toutes les demandes
  if (req.method === "GET" && req.query.all === "1") {
    // ⚠️ Idéalement, vérifie que l’utilisateur est bien admin (token ou session/cookie)
    const { rows } = await pool.query(
      `SELECT h.id, h.user_id, u.first_name || ' ' || u.last_name as user_name, h.service, h.status, 
              to_char(h.created_at, 'YYYY-MM-DD') as "createdAt",
              to_char(h.updated_at, 'YYYY-MM-DD') as "updatedAt"
         FROM help_requests h
         JOIN users u ON h.user_id = u.id
         ORDER BY h.created_at DESC`
    );
    return res.status(200).json({ requests: rows });
  }
  
  // ...autres méthodes (POST pour user, etc)
}
