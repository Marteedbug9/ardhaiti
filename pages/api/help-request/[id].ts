import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const { status } = req.body;
    // Optionnel : validation de sécurité (admin)
    await pool.query(
      `UPDATE help_requests SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    );
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}
