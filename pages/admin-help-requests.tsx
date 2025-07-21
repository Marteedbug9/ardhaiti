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

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("Client");
  const [clients, setClients] = useState<Client[]>([]);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [registerForm, setRegisterForm] = useState<Register>(INIT_REGISTER);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [search, setSearch] = useState("");

  // Charger data au chargement de la page
  useEffect(() => {
    fetchClients();
    fetchRequests();
    fetchRegisters();
  }, []);

 const fetchClients = async () => {
  try {
    const res = await fetch("/api/admin/clients");
    if (!res.ok) throw new Error("Erreur lors du chargement des clients");
    setClients(await res.json());
  } catch (err: unknown) {
    // Optionnel : tu peux afficher une alerte ici
    setClients([]); // en cas d’erreur, vider
  }
};

const fetchRequests = async () => {
  try {
    const res = await fetch("/api/admin/requests");
    if (!res.ok) throw new Error("Erreur lors du chargement des demandes");
    setRequests(await res.json());
  } catch (err: unknown) {
    setRequests([]);
  }
};

const fetchRegisters = async () => {
  try {
    const res = await fetch("/api/admin/registers");
    if (!res.ok) throw new Error("Erreur lors du chargement des registers");
    setRegisters(await res.json());
  } catch (err: unknown) {
    setRegisters([]);
  }
};


  // FILTRES
  function filterData<T extends Record<string, unknown>>(list: T[], search: string): T[] {
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter(item =>
      Object.values(item).some(
        val => typeof val === "string" && val.toLowerCase().includes(s)
      )
    );
  }

  // FORMULAIRE AJOUT REGISTER
  function renderRegisterForm() {
    return (
      <form
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterSuccess(false);
    setRegisterError("");
    try {
      const res = await fetch("/api/admin/registers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm)
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      setRegisterSuccess(true);
      setRegisterForm(INIT_REGISTER);
      fetchRegisters(); // recharger
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

  // ... fonctions renderClientTable, renderRequestTable, renderRegisterTable identiques à ta version précédente
// Pour la liste des clients
function renderClientTable() {
  const list = filterData(clients, search);
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        background: "#fafdff",
        borderRadius: 13,
        overflow: "hidden",
        boxShadow: "0 2px 12px #00408009"
      }}
    >
      <thead>
        <tr style={{ background: "#1671b8", color: "#fff" }}>
          <th style={{ padding: 10 }}>Sexe</th>
          <th style={{ padding: 10 }}>Status</th>
          <th style={{ padding: 10 }}>First Name</th>
          <th style={{ padding: 10 }}>Last Name</th>
          <th style={{ padding: 10 }}>Email</th>
          <th style={{ padding: 10 }}>Phone</th>
          <th style={{ padding: 10 }}>Address</th>
          <th style={{ padding: 10 }}>City</th>
          <th style={{ padding: 10 }}>State</th>
          <th style={{ padding: 10 }}>Zipcode</th>
          <th style={{ padding: 10 }}>Birth (Y/M/D)</th>
          <th style={{ padding: 10 }}>Confirm</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={12} style={{ textAlign: "center", color: "#888", background: "#f3f7fa", padding: 16 }}>
              No results
            </td>
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
              <td style={{ padding: 8 }}>{c.sexe as string}</td>
              <td style={{ padding: 8 }}>{c.status as string}</td>
              <td style={{ padding: 8 }}>{c.firstName as string}</td>
              <td style={{ padding: 8 }}>{c.lastName as string}</td>
              <td style={{ padding: 8 }}>{c.email as string}</td>
              <td style={{ padding: 8 }}>{c.phone as string}</td>
              <td style={{ padding: 8 }}>{c.address as string}</td>
              <td style={{ padding: 8 }}>{c.city as string}</td>
              <td style={{ padding: 8 }}>{c.state as string}</td>
              <td style={{ padding: 8 }}>{c.zipcode as string}</td>
              <td style={{ padding: 8 }}>{`${c.yearOfBirth as string}/${c.monthOfBirth as string}/${c.dayOfBirth as string}`}</td>
              <td style={{ padding: 8, textAlign: "center" }}>{c.confirm ? "✔️" : "❌"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// Pour la liste des demandes d'aide
function renderRequestTable() {
  const list = filterData(requests, search);
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        background: "#fafdff",
        borderRadius: 13,
        overflow: "hidden",
        boxShadow: "0 2px 12px #00408009"
      }}
    >
      <thead>
        <tr style={{ background: "#1671b8", color: "#fff" }}>
          <th style={{ padding: 10 }}>User</th>
          <th style={{ padding: 10 }}>Sexe</th>
          <th style={{ padding: 10 }}>State</th>
          <th style={{ padding: 10 }}>City</th>
          <th style={{ padding: 10 }}>Service</th>
          <th style={{ padding: 10 }}>Status</th>
          <th style={{ padding: 10 }}>Sent At</th>
          <th style={{ padding: 10 }}>Last Update</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={8} style={{ textAlign: "center", color: "#888", background: "#f3f7fa", padding: 16 }}>
              No results
            </td>
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
              <td style={{ padding: 8 }}>{(r.user_name as string) || (r.user_id as number)}</td>
              <td style={{ padding: 8 }}>{r.sexe as string}</td>
              <td style={{ padding: 8 }}>{r.state as string}</td>
              <td style={{ padding: 8 }}>{r.city as string}</td>
              <td style={{ padding: 8 }}>{r.service as string}</td>
              <td style={{ padding: 8 }}>{r.status as string}</td>
              <td style={{ padding: 8 }}>{r.createdAt as string}</td>
              <td style={{ padding: 8 }}>{r.updatedAt as string}</td>
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
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        background: "#fafdff",
        borderRadius: 13,
        overflow: "hidden",
        boxShadow: "0 2px 12px #00408009"
      }}
    >
      <thead>
        <tr style={{ background: "#1671b8", color: "#fff" }}>
          <th style={{ padding: 10 }}>Sexe</th>
          <th style={{ padding: 10 }}>Status</th>
          <th style={{ padding: 10 }}>First Name</th>
          <th style={{ padding: 10 }}>Last Name</th>
          <th style={{ padding: 10 }}>Email</th>
          <th style={{ padding: 10 }}>Phone</th>
          <th style={{ padding: 10 }}>Address</th>
          <th style={{ padding: 10 }}>City</th>
          <th style={{ padding: 10 }}>State</th>
          <th style={{ padding: 10 }}>Zipcode</th>
          <th style={{ padding: 10 }}>Birth (Y/M/D)</th>
          <th style={{ padding: 10 }}>Confirm</th>
          <th style={{ padding: 10 }}>Document</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={13} style={{ textAlign: "center", color: "#888", background: "#f3f7fa", padding: 16 }}>No results</td>
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
              <td style={{ padding: 8 }}>{r.sexe as string}</td>
              <td style={{ padding: 8 }}>{r.status as string}</td>
              <td style={{ padding: 8 }}>{r.firstName as string}</td>
              <td style={{ padding: 8 }}>{r.lastName as string}</td>
              <td style={{ padding: 8 }}>{r.email as string}</td>
              <td style={{ padding: 8 }}>{r.phone as string}</td>
              <td style={{ padding: 8 }}>{r.address as string}</td>
              <td style={{ padding: 8 }}>{r.city as string}</td>
              <td style={{ padding: 8 }}>{r.state as string}</td>
              <td style={{ padding: 8 }}>{r.zipcode as string}</td>
              <td style={{ padding: 8 }}>{`${r.yearOfBirth as string}/${r.monthOfBirth as string}/${r.dayOfBirth as string}`}</td>
              <td style={{ padding: 8, textAlign: "center" }}>{r.confirm ? "✔️" : "❌"}</td>
              <td style={{ padding: 8 }}>{r.document as string}</td>
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
       {tab === "Register" && renderRegisterTable()}
        </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

// Style input partagé
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
