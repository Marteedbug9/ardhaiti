import { useEffect, useState } from "react";
import Navbar from "../components/Navbar_adm";
import Footer from "../components/Footer";

const TABS = ["Client", "Request", "Register"];

// --- Types alignés SQL
interface Client {
  id: number;
  sexe: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  year_of_birth: string;
  month_of_birth?: string;
  day_of_birth?: string;
  is_confirmed: boolean;
}

interface HelpRequest {
  id: number;
  user_id: number;
  user_name: string | null;
  sexe: string;
  state: string;
  city: string;
  service: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Register {
  id?: number;
  sexe: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  year_of_birth: string;
  month_of_birth?: string;
  day_of_birth?: string;
  is_confirmed: boolean;
  document?: string;
}

const INIT_REGISTER: Register = {
  sexe: "",
  status: "Pending",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  year_of_birth: "",
  is_confirmed: false,
  document: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("Client");
  const [clients, setClients] = useState<Client[]>([]);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [registerForm, setRegisterForm] = useState<Register>(INIT_REGISTER);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients();
    fetchRequests();
    fetchRegisters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/clients`);
      if (!res.ok) throw new Error("Erreur lors du chargement des clients");
      setClients(await res.json());
    } catch {
      setClients([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/requests`);
      if (!res.ok) throw new Error("Erreur lors du chargement des demandes");
      setRequests(await res.json());
    } catch {
      setRequests([]);
    }
  };

  const fetchRegisters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/registers`);
      if (!res.ok) throw new Error("Erreur lors du chargement des registers");
      setRegisters(await res.json());
    } catch {
      setRegisters([]);
    }
  };

  // --- FILTRES SANS any/unknown ---
  function filterClients(clients: Client[], search: string): Client[] {
    if (!search) return clients;
    const s = search.toLowerCase();
    return clients.filter(c =>
      [
        c.sexe, c.status, c.first_name, c.last_name, c.email,
        c.phone, c.address, c.city, c.state, c.zipcode, c.year_of_birth,
        c.month_of_birth ?? "", c.day_of_birth ?? ""
      ].some(field => (field || "").toLowerCase().includes(s))
    );
  }

  function filterRequests(requests: HelpRequest[], search: string): HelpRequest[] {
    if (!search) return requests;
    const s = search.toLowerCase();
    return requests.filter(r =>
      [
        r.user_name ?? "",
        r.sexe, r.state, r.city, r.service, r.status,
        r.created_at, r.updated_at
      ].some(field => (field || "").toLowerCase().includes(s))
    );
  }

  function filterRegisters(registers: Register[], search: string): Register[] {
    if (!search) return registers;
    const s = search.toLowerCase();
    return registers.filter(r =>
      [
        r.sexe, r.status, r.first_name, r.last_name, r.email,
        r.phone, r.address, r.city, r.state, r.zipcode, r.year_of_birth,
        r.month_of_birth ?? "", r.day_of_birth ?? "", r.document ?? ""
      ].some(field => (field || "").toLowerCase().includes(s))
    );
  }

  // --- Formulaire d'ajout
  function renderRegisterForm() {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setRegisterSuccess(false);
          setRegisterError("");
          try {
            const res = await fetch(`${API_URL}/api/admin/registers`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(registerForm)
            });
            if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
            setRegisterSuccess(true);
            setRegisterForm(INIT_REGISTER);
            fetchRegisters();
            fetchClients();
          } catch (err) {
            setRegisterError((err instanceof Error ? err.message : "Erreur inconnue"));
          }
        }}
        style={{
          background: "#f6fbff",
          border: "1px solid #c6e4ff",
          borderRadius: 10,
          padding: 18,
          marginBottom: 32,
          marginTop: 6,
          boxShadow: "0 2px 8px #165b8315"
        }}
      >
        {/* ... mêmes champs que dans ton formulaire, mais avec les bons noms */}
        {/* first_name/last_name au lieu de firstName/lastName */}
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Sexe *</label>
            <input required name="sexe" value={registerForm.sexe} onChange={e => setRegisterForm(f => ({ ...f, sexe: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Status *</label>
            <input required name="status" value={registerForm.status} onChange={e => setRegisterForm(f => ({ ...f, status: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Document</label>
            <input name="document" value={registerForm.document ?? ""} onChange={e => setRegisterForm(f => ({ ...f, document: e.target.value }))} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>First Name *</label>
            <input required name="first_name" value={registerForm.first_name} onChange={e => setRegisterForm(f => ({ ...f, first_name: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name *</label>
            <input required name="last_name" value={registerForm.last_name} onChange={e => setRegisterForm(f => ({ ...f, last_name: e.target.value }))} style={inputStyle} />
          </div>
        </div>
        {/* ...le reste, adapte les noms ! */}
        {/* email, phone, address, etc. */}
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Email *</label>
            <input required name="email" value={registerForm.email} onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} type="email" />
          </div>
          <div style={{ flex: 1 }}>
            <label>Phone *</label>
            <input required name="phone" value={registerForm.phone} onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Address *</label>
            <input required name="address" value={registerForm.address} onChange={e => setRegisterForm(f => ({ ...f, address: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>City *</label>
            <input required name="city" value={registerForm.city} onChange={e => setRegisterForm(f => ({ ...f, city: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>State *</label>
            <input required name="state" value={registerForm.state} onChange={e => setRegisterForm(f => ({ ...f, state: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Zipcode *</label>
            <input required name="zipcode" value={registerForm.zipcode} onChange={e => setRegisterForm(f => ({ ...f, zipcode: e.target.value }))} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Year of Birth *</label>
            <input required name="year_of_birth" value={registerForm.year_of_birth} onChange={e => setRegisterForm(f => ({ ...f, year_of_birth: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Month of Birth</label>
            <input name="month_of_birth" value={registerForm.month_of_birth ?? ""} onChange={e => setRegisterForm(f => ({ ...f, month_of_birth: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Day of Birth</label>
            <input name="day_of_birth" value={registerForm.day_of_birth ?? ""} onChange={e => setRegisterForm(f => ({ ...f, day_of_birth: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Confirm *</label>
            <select required name="is_confirmed" value={registerForm.is_confirmed ? "true" : "false"} onChange={e => setRegisterForm(f => ({ ...f, is_confirmed: e.target.value === "true" }))} style={inputStyle}>
              <option value="false">Non</option>
              <option value="true">Oui</option>
            </select>
          </div>
        </div>
        <button type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            marginTop: 10,
            boxShadow: "0 2px 8px #135ba733",
            cursor: "pointer",
            transition: "background .15s"
          }}>
          Ajouter
        </button>
        {registerSuccess && (
          <div style={{ color: "#259621", fontWeight: 600, background: "#edffec", borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15 }}>
            Enregistré avec succès !
          </div>
        )}
        {registerError && (
          <div style={{ color: "#c72525", fontWeight: 600, background: "#ffeded", borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15 }}>
            {registerError}
          </div>
        )}
      </form>
    );
  }

  // --- Tableau clients
  function renderClientTable() {
    const list = filterClients(clients, search);
    return (
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th style={thStyle}>Sexe</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Last Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Zipcode</th>
            <th style={thStyle}>Birth (Y/M/D)</th>
            <th style={thStyle}>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={12} style={noResultStyle}>No results</td>
            </tr>
          ) : (
            list.map((c, idx) => (
              <tr
                key={String(c.id)}
                style={{
                  background: idx % 2 === 0 ? "#f7faff" : "#eaf3ff",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#d3ecff")}
                onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#f7faff" : "#eaf3ff")}
              >
                <td style={tdStyle}>{c.sexe}</td>
                <td style={tdStyle}>{c.status}</td>
                <td style={tdStyle}>{c.first_name}</td>
                <td style={tdStyle}>{c.last_name}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{c.phone}</td>
                <td style={tdStyle}>{c.address}</td>
                <td style={tdStyle}>{c.city}</td>
                <td style={tdStyle}>{c.state}</td>
                <td style={tdStyle}>{c.zipcode}</td>
                <td style={tdStyle}>{`${c.year_of_birth}/${c.month_of_birth ?? ""}/${c.day_of_birth ?? ""}`}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{c.is_confirmed ? "✔️" : "❌"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  // --- Tableau requests
  function renderRequestTable() {
    const list = filterRequests(requests, search);
    return (
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Sexe</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>Service</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Sent At</th>
            <th style={thStyle}>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={8} style={noResultStyle}>No results</td>
            </tr>
          ) : (
            list.map((r, idx) => (
              <tr
                key={String(r.id)}
                style={{
                  background: idx % 2 === 0 ? "#f7faff" : "#eaf3ff",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#d3ecff")}
                onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#f7faff" : "#eaf3ff")}
              >
                <td style={tdStyle}>{r.user_name ?? r.user_id}</td>
                <td style={tdStyle}>{r.sexe}</td>
                <td style={tdStyle}>{r.state}</td>
                <td style={tdStyle}>{r.city}</td>
                <td style={tdStyle}>{r.service}</td>
                <td style={tdStyle}>{r.status}</td>
                <td style={tdStyle}>{r.created_at}</td>
                <td style={tdStyle}>{r.updated_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  // --- Tableau registers
  function renderRegisterTable() {
    const list = filterRegisters(registers, search);
    return (
      <table style={tableStyle}>
        <thead>
          <tr style={theadStyle}>
            <th style={thStyle}>Sexe</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>First Name</th>
            <th style={thStyle}>Last Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Zipcode</th>
            <th style={thStyle}>Birth (Y/M/D)</th>
            <th style={thStyle}>Confirm</th>
            <th style={thStyle}>Document</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={13} style={noResultStyle}>No results</td>
            </tr>
          ) : (
            list.map((r, idx) => (
              <tr
                key={String(r.id)}
                style={{
                  background: idx % 2 === 0 ? "#f7faff" : "#eaf3ff",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#d3ecff")}
                onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#f7faff" : "#eaf3ff")}
              >
                <td style={tdStyle}>{r.sexe}</td>
                <td style={tdStyle}>{r.status}</td>
                <td style={tdStyle}>{r.first_name}</td>
                <td style={tdStyle}>{r.last_name}</td>
                <td style={tdStyle}>{r.email}</td>
                <td style={tdStyle}>{r.phone}</td>
                <td style={tdStyle}>{r.address}</td>
                <td style={tdStyle}>{r.city}</td>
                <td style={tdStyle}>{r.state}</td>
                <td style={tdStyle}>{r.zipcode}</td>
                <td style={tdStyle}>{`${r.year_of_birth}/${r.month_of_birth ?? ""}/${r.day_of_birth ?? ""}`}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{r.is_confirmed ? "✔️" : "❌"}</td>
                <td style={tdStyle}>{r.document ?? ""}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  // --- UI
  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "44px 12px" }}>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 18, color: "#145a7e" }}>Admin Dashboard</h1>
          <div style={{ marginBottom: 20 }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  marginRight: 10, padding: "8px 24px",
                  borderRadius: 9, border: "none",
                  background: tab === t ? "#0a293dff" : "#e8f2fa",
                  color: tab === t ? "#fff" : "#0a293d",
                  fontWeight: 600, fontSize: "1.04rem",
                  boxShadow: tab === t ? "0 2px 6px #0a293d24" : "none",
                  cursor: "pointer"
                }}
              >
                {t}
              </button>
            ))}
            <input
              placeholder="🔍 Search or sort by any field…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                float: "right", minWidth: 250, padding: 8, fontSize: 15,
                border: "1px solid #c1d4ea", borderRadius: 9, marginTop: 4
              }}
            />
          </div>
          <div style={{ background: "#fff", borderRadius: 13, boxShadow: "0 4px 12px #165b8310", padding: 16 }}>
            {tab === "Client" && renderClientTable()}
            {tab === "Request" && renderRequestTable()}
            {tab === "Register" && (
              <>
                {renderRegisterForm()}
                {renderRegisterTable()}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// --- Styles partagés ---
const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 3,
  marginBottom: 0,
  padding: "10px 11px",
  fontSize: 15,
  borderRadius: 8,
  border: "1px solid #c4d5ec",
  outline: "none",
  background: "#f8fbfe"
};
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  background: "#fafdff",
  borderRadius: 13,
  overflow: "hidden",
  boxShadow: "0 2px 12px #00408009"
};
const theadStyle: React.CSSProperties = { background: "#1671b8", color: "#fff" };
const thStyle: React.CSSProperties = { padding: 10 };
const tdStyle: React.CSSProperties = { padding: 8 };
const noResultStyle: React.CSSProperties = { textAlign: "center", color: "#888", background: "#f3f7fa", padding: 16 };

