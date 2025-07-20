import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SERVICE_LIST = [
  "Legal Assistance",
  "Rent Support",
  "Food Assistance",
  "Education & English Classes",
  "Job",
  "Move to Haiti"
];

interface HelpRequest {
  id: number;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function HelpRequestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState<HelpRequest[]>([]);
  const router = useRouter();

  // ----- VÉRIFICATION LOGIN -----
  useEffect(() => {
    // Suppose qu'on stocke userId en localStorage après login
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login"); // Redirige vers login si pas connecté
      }
    }
  }, [router]);

  // ----- LOGIQUE RESTE INCHANGÉ -----
  const handleSelect = (service: string) => {
    setSelected(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
    if (selected.length === 0) {
      setNotice("Please select at least one service.");
      return;
    }
    try {
      // Tu dois transmettre aussi l’userId côté backend
      const userId = localStorage.getItem("userId");
      await fetch("/api/help-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: selected, userId }),
      });
      setNotice("Your request has been sent successfully!");
      setHistory(old =>
        [
          ...old,
          ...selected.map((service, i) => ({
            id: old.length + i + 1,
            service,
            status: "Pending",
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          }))
        ]
      );
      setSelected([]);
    } catch {
      setNotice("An error occurred, please try again.");
    }
  };

  const usedServices = history.map(h => h.service);
  const availableServices = SERVICE_LIST.filter(s => !usedServices.includes(s));

  return (
    <>
      <Navbar />
      <main style={{ background: "#0a293dff", minHeight: "100vh" }}>
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "44px 12px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 10, color: "#145a7e" }}>
            Request Support
          </h1>
          <form onSubmit={handleSubmit} style={{
            background: "#fff", borderRadius: 14, boxShadow: "0 4px 14px #165b8312", padding: 24, marginBottom: 32
          }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>
              Select the service(s) you need:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              {availableServices.length === 0 && (
                <span style={{ color: "#888" }}>You have already requested all services.</span>
              )}
              {availableServices.map(service => (
                <label key={service} style={{
                  background: selected.includes(service) ? "#145a7e" : "#e8f2fa",
                  color: selected.includes(service) ? "#fff" : "#145a7e",
                  padding: "10px 20px",
                  borderRadius: 18,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "2px solid #145a7e",
                  minWidth: 150,
                  textAlign: "center",
                  transition: "all 0.15s"
                }}>
                  <input
                    type="checkbox"
                    value={service}
                    checked={selected.includes(service)}
                    onChange={() => handleSelect(service)}
                    style={{ display: "none" }}
                  />
                  {service}
                </label>
              ))}
            </div>
            <button type="submit"
              style={{
                width: "100%",
                background: "#145a7e",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontSize: "1.1rem",
                marginTop: 6,
                cursor: "pointer"
              }}>
              Submit my request
            </button>
            {notice && <div style={{
              marginTop: 14,
              color: notice.startsWith("Your request") ? "#1b924c" : "#c52e2e",
              fontWeight: 600
            }}>{notice}</div>}
          </form>

          <h2 style={{ fontSize: "1.22rem", fontWeight: 600, marginBottom: 14 }}>Your Previous Requests</h2>
          <div style={{ background: "#fff", borderRadius: 13, boxShadow: "0 4px 12px #165b8310", padding: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.06rem" }}>
              <thead>
                <tr style={{ background: "#e8f2fa" }}>
                  <th style={{ padding: "8px 3px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "8px 3px", textAlign: "left" }}>Request</th>
                  <th style={{ padding: "8px 3px", textAlign: "left" }}>Sent At</th>
                  <th style={{ padding: "8px 3px", textAlign: "left" }}>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#999" }}>No requests yet.</td>
                  </tr>
                )}
                {history.map(h => (
                  <tr key={h.id}>
                    <td style={{ padding: "7px 3px", color: "#007b40", fontWeight: 600 }}>{h.status}</td>
                    <td style={{ padding: "7px 3px" }}>{h.service}</td>
                    <td style={{ padding: "7px 3px" }}>{h.createdAt}</td>
                    <td style={{ padding: "7px 3px" }}>{h.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
