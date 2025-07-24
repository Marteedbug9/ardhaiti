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
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HelpRequestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState<HelpRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      if (!userId) router.push("/login");
    }
  }, [router]);

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
      const userId = localStorage.getItem("userId");
      await fetch(`${API_URL}/help/request`, {
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
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div className="help-container">
          <h1 className="help-title">
            Request Support
          </h1>
          <form onSubmit={handleSubmit} className="help-form soft-card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>
              Select the service(s) you need:
            </div>
            <div className="help-services">
              {availableServices.length === 0 && (
                <span style={{ color: "#888" }}>You have already requested all services.</span>
              )}
              {availableServices.map(service => (
                <label
                  key={service}
                  className={`help-service-btn ${selected.includes(service) ? "selected" : ""}`}
                >
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
            <button type="submit" className="soft-btn" style={{ marginTop: 6 }}>
              Submit my request
            </button>
            {notice && <div style={{
              marginTop: 14,
              color: notice.startsWith("Your request") ? "#1b924c" : "#c52e2e",
              fontWeight: 600
            }}>{notice}</div>}
          </form>

          <h2 className="help-history-title">Your Previous Requests</h2>
          <div className="soft-card">
            <div className="soft-table-responsive">
              <table className="soft-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Request</th>
                    <th>Sent At</th>
                    <th>Last Update</th>
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
                      <td style={{ color: "#007b40", fontWeight: 600 }}>{h.status}</td>
                      <td>{h.service}</td>
                      <td>{h.createdAt}</td>
                      <td>{h.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .help-container {
          max-width: 540px;
          margin: 0 auto;
          padding: 44px 12px;
        }
        .help-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #145a7e;
        }
        .help-form {
          margin-bottom: 32px;
        }
        .help-services {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }
        .help-service-btn {
          background: #e8f2fa;
          color: #145a7e;
          padding: 10px 20px;
          border-radius: 18px;
          font-weight: 500;
          cursor: pointer;
          border: 2px solid #145a7e;
          min-width: 150px;
          text-align: center;
          transition: all 0.15s;
          margin-bottom: 4px;
          user-select: none;
        }
        .help-service-btn.selected {
          background: #145a7e;
          color: #fff;
        }
        .help-history-title {
          font-size: 1.22rem;
          font-weight: 600;
          margin-bottom: 14px;
        }

        /* TABLE RESPONSIVE */
        @media (max-width: 700px) {
          .help-container { max-width: 98vw; padding: 18px 1vw; }
          .help-title { font-size: 1.22rem; }
          .help-service-btn { min-width: 95px; font-size: 13px; padding: 8px 7px;}
        }
        @media (max-width: 430px) {
          .help-container { padding: 10px 0px; }
          .help-form { padding: 10px 2vw; }
          .help-services { gap: 7px; }
        }
      `}</style>
    </>
  );
}
