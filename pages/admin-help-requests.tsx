import { useEffect, useState } from "react";
import Navbar from "../components/Navbar_adm";
import Footer from "../components/Footer";

// Onglets du dashboard admin
const TABS = ["Client", "Request", "Register"];

// ---- MODELES TYPES ----
interface Client {
  [key: string]: unknown;
  id: number;
  sexe: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  yearOfBirth: string;
  monthOfBirth: string;
  dayOfBirth: string;
  confirm: boolean;
}

interface HelpRequest {
  [key: string]: unknown;
  id: number;
  user_id: number;
  user_name: string | null;
  sexe: string;
  state: string;
  city: string;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Register {
  [key: string]: unknown;
  id?: number;
  sexe: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  yearOfBirth: string;
  monthOfBirth: string;
  dayOfBirth: string;
  confirm: boolean;
  document: string;
}

// ---- INIT ÉTAT POUR AJOUT REGISTER ----
const INIT_REGISTER: Register = {
  sexe: "",
  status: "Pending",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  yearOfBirth: "",
  monthOfBirth: "",
  dayOfBirth: "",
  confirm: false,
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
    } catch (err: unknown) {
      setClients([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/requests`);
      if (!res.ok) throw new Error("Erreur lors du chargement des demandes");
      setRequests(await res.json());
    } catch (err: unknown) {
      setRequests([]);
    }
  };

  const fetchRegisters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/registers`);
      if (!res.ok) throw new Error("Erreur lors du chargement des registers");
      setRegisters(await res.json());
    } catch (err: unknown) {
      setRegisters([]);
    }
  };

  // ---- Filtre
  function filterData<T extends Record<string, unknown>>(list: T[], search: string): T[] {
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter(item =>
      Object.values(item).some(
        val => typeof val === "string" && val.toLowerCase().includes(s)
      )
    );
  }

  // ---- Formulaire d'ajout register (admin → users)
  function renderRegisterForm() {
    return (
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
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
          } catch (err: unknown) {
            if (err instanceof Error) setRegisterError(err.message || "Erreur inconnue");
            else setRegisterError("Erreur inconnue");
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
            <input name="document" value={registerForm.document} onChange={e => setRegisterForm(f => ({ ...f, document: e.target.value }))} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>First Name *</label>
            <input required name="firstName" value={registerForm.firstName} onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name *</label>
            <input required name="lastName" value={registerForm.lastName} onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))} style={inputStyle} />
          </div>
        </div>
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
            <input required name="yearOfBirth" value={registerForm.yearOfBirth} onChange={e => setRegisterForm(f => ({ ...f, yearOfBirth: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Month of Birth *</label>
            <input required name="monthOfBirth" value={registerForm.monthOfBirth} onChange={e => setRegisterForm(f => ({ ...f, monthOfBirth: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Day of Birth *</label>
            <input required name="dayOfBirth" value={registerForm.dayOfBirth} onChange={e => setRegisterForm(f => ({ ...f, dayOfBirth: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Confirm *</label>
            <select required name="confirm" value={registerForm.confirm ? "true" : "false"} onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value === "true" }))} style={inputStyle}>
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

  // ---- Rendus des tableaux ----
  function renderClientTable() {
    const list = filterData(clients, search);
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
                <td style={tdStyle}>{c.sexe as string}</td>
                <td style={tdStyle}>{c.status as string}</td>
                <td style={tdStyle}>{c.firstName as string}</td>
                <td style={tdStyle}>{c.lastName as string}</td>
                <td style={tdStyle}>{c.email as string}</td>
                <td style={tdStyle}>{c.phone as string}</td>
                <td style={tdStyle}>{c.address as string}</td>
                <td style={tdStyle}>{c.city as string}</td>
                <td style={tdStyle}>{c.state as string}</td>
                <td style={tdStyle}>{c.zipcode as string}</td>
                <td style={tdStyle}>{`${c.yearOfBirth as string}/${c.monthOfBirth as string}/${c.dayOfBirth as string}`}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{c.confirm ? "✔️" : "❌"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  function renderRequestTable() {
    const list = filterData(requests, search);
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
                <td style={tdStyle}>{(r.user_name as string) || (r.user_id as number)}</td>
                <td style={tdStyle}>{r.sexe as string}</td>
                <td style={tdStyle}>{r.state as string}</td>
                <td style={tdStyle}>{r.city as string}</td>
                <td style={tdStyle}>{r.service as string}</td>
                <td style={tdStyle}>{r.status as string}</td>
                <td style={tdStyle}>{r.createdAt as string}</td>
                <td style={tdStyle}>{r.updatedAt as string}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  function renderRegisterTable() {
    const list = filterData(registers, search);
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
                <td style={tdStyle}>{r.sexe as string}</td>
                <td style={tdStyle}>{r.status as string}</td>
                <td style={tdStyle}>{r.firstName as string}</td>
                <td style={tdStyle}>{r.lastName as string}</td>
                <td style={tdStyle}>{r.email as string}</td>
                <td style={tdStyle}>{r.phone as string}</td>
                <td style={tdStyle}>{r.address as string}</td>
                <td style={tdStyle}>{r.city as string}</td>
                <td style={tdStyle}>{r.state as string}</td>
                <td style={tdStyle}>{r.zipcode as string}</td>
                <td style={tdStyle}>{`${r.yearOfBirth as string}/${r.monthOfBirth as string}/${r.dayOfBirth as string}`}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{r.confirm ? "✔️" : "❌"}</td>
                <td style={tdStyle}>{r.document as string}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  // ------ UI ------
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

