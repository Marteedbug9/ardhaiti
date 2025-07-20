import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ADMIN : voir toutes les demandes
  if (req.method === "GET" && req.query.all === "1") {
    // Exemple de vérif rapide (à remplacer par token JWT ou session réelle)
    // if (req.headers.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    try {
      const { rows } = await pool.query(
        `SELECT h.id, h.user_id, u.first_name || ' ' || u.last_name as user_name, h.service, h.status, 
                to_char(h.created_at, 'YYYY-MM-DD') as "createdAt",
                to_char(h.updated_at, 'YYYY-MM-DD') as "updatedAt"
           FROM help_requests h
           JOIN users u ON h.user_id = u.id
           ORDER BY h.created_at DESC`
      );
      return res.status(200).json({ requests: rows });
    } catch (e: any) {
      console.error("Error fetching help requests:", e);
      return res.status(500).json({ error: "Could not fetch help requests." });
    }
  }
  
  // Ajoute ici les autres méthodes (POST pour créer une demande, PUT pour changer statut, etc)

  // Méthode non supportée
  return res.status(405).json({ error: "Method not allowed." });
}
