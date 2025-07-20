import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ADMIN : voir toutes les demandes
  if (req.method === "GET" && req.query.all === "1") {
    // TODO : Remplacer par une vraie vérif JWT/sécurité admin
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
    } catch (e: unknown) {
      // Gestion propre de l’erreur sans 'any'
      if (e instanceof Error) {
        console.error("Error fetching help requests:", e.message);
      } else {
        console.error("Unknown error fetching help requests:", e);
      }
      return res.status(500).json({ error: "Could not fetch help requests." });
    }
  }
  
  // À COMPLÉTER : Autres méthodes (POST, PUT, etc.)
  // Exemple pour POST (à implémenter plus tard):
  // if (req.method === "POST") { ... }

  // Méthode non supportée
  return res.status(405).json({ error: "Method not allowed." });
}
