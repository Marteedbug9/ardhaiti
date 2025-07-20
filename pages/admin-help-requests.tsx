import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_OPTIONS = ["Pending", "In progress", "Completed", "Rejected"];

interface HelpRequest {
  id: number;
  user_id: number;
  user_name: string; // Peut être null si pas de nom dans la base
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHelpRequestsPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const router = useRouter();

  // --- Redirige si pas admin connecté ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        router.push("/login");
      }
    }
  }, [router]);

  // --- Charge la liste des demandes ---
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setNotice("");
      try {
        const res = await fetch("/api/help-request?all=1");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setRequests(data.requests);
      } catch (err) {
        setNotice("Could not load requests.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  // --- Change le statut d'une demande ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    setNotice("");
    try {
      const res = await fetch(`/api/help-request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("API error");
      setRequests(reqs =>
        reqs.map(req =>
          req.id === id ? { ...req, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] } : req
        )
      );
      setNotice("Status updated!");
      setTimeout(() => setNotice(""), 2000);
    } catch {
      setNotice("Could not update status.");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "44px 12px" }}>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 18 }}>
            All Help Requests
          </h1>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 13, boxShadow: "0 4px 12px #165b8310", padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.04rem" }}>
                <thead>
                  <tr style={{ background: "#e8f2fa" }}>
                    <th style={{ padding: "8px 3px", textAlign: "left" }}>User</th>
                    <th style={{ padding: "8px 3px", textAlign: "left" }}>Service</th>
                    <th style={{ padding: "8px 3px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "8px 3px", textAlign: "left" }}>Sent At</th>
                    <th style={{ padding: "8px 3px", textAlign: "left" }}>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "#999" }}>No requests.</td>
                    </tr>
                  ) : (
                    requests.map(r => (
                      <tr key={r.id}>
                        <td style={{ padding: "7px 3px" }}>{r.user_name || r.user_id}</td>
                        <td style={{ padding: "7px 3px" }}>{r.service}</td>
                        <td style={{ padding: "7px 3px" }}>
                          <select
                            value={r.status}
                            onChange={e => handleStatusChange(r.id, e.target.value)}
                            style={{
                              background: "#e8f2fa",
                              border: "1.2px solid #aaa",
                              borderRadius: 7,
                              padding: "3px 10px"
                            }}>
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "7px 3px" }}>{r.createdAt}</td>
                        <td style={{ padding: "7px 3px" }}>{r.updatedAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {notice && <div style={{ marginTop: 10, color: "#197c33", fontWeight: 600 }}>{notice}</div>}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
