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
      if (e instanceof Error) {
        console.error("Error fetching help requests:", e.message);
      } else {
        console.error("Unknown error fetching help requests:", e);
      }
      return res.status(500).json({ error: "Could not fetch help requests." });
    }
  }

  // UTILISATEUR : Soumission d'une demande
  if (req.method === "POST") {
    const { userId, services } = req.body;
    if (!userId || !services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Missing userId or services." });
    }

    try {
      for (const service of services) {
        await pool.query(
          `INSERT INTO help_requests (user_id, service) VALUES ($1, $2)`,
          [userId, service]
        );
      }
      return res.status(200).json({ ok: true });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Error inserting help request:", e.message);
      } else {
        console.error("Unknown error inserting help request:", e);
      }
      return res.status(500).json({ error: "Failed to submit request." });
    }
  }

  // Méthode non supportée
  return res.status(405).json({ error: "Method not allowed." });
}
