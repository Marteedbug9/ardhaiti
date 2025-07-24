import { useEffect, useState } from "react";
import Navbar from "../components/Navbar_adm";
import Footer from "../components/Footer";

const TABS = ["Client", "Request", "Register"];

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
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchClients();
    fetchRequests();
    fetchRegisters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      if (!res.ok) throw new Error("Erreur lors du chargement des clients");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setClients([]);
    }
  };
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/help-requests`);
      if (!res.ok) throw new Error("Erreur lors du chargement des demandes");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    }
  };
  const fetchRegisters = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      if (!res.ok) throw new Error("Erreur lors du chargement des registers");
      const data = await res.json();
      setRegisters(Array.isArray(data) ? data : []);
    } catch {
      setRegisters([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Confirmer la suppression de ce client ?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      await fetchClients();
    } catch {
      alert("Erreur lors de la suppression !");
    }
  };

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

  const editableFields: (keyof Client)[] = [
    "sexe", "status", "first_name", "last_name", "email", "phone", "address",
    "city", "state", "zipcode", "year_of_birth", "month_of_birth", "day_of_birth"
  ];
  const fieldLabels: { [K in keyof Client]?: string } = {
    sexe: "Sexe",
    status: "Status",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    state: "State",
    zipcode: "Zipcode",
    year_of_birth: "Birth Year",
    month_of_birth: "Birth Month",
    day_of_birth: "Birth Day"
  };

  // --- Tableau des Clients (Edition inline)
  function renderClientTable() {
    const list = filterClients(clients, search);

    // Commence édition : charge toutes les valeurs du client dans editForm
    const startEditRow = (client: Client) => {
      setEditId(client.id);
      setEditForm({ ...client });
    };
    const cancelEditRow = () => {
      setEditId(null);
      setEditForm({});
    };
    const saveEditRow = async (id: number) => {
      try {
        const res = await fetch(`${API_URL}/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm)
        });
        if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
        setEditId(null);
        setEditForm({});
        await fetchClients();
      } catch {
        alert("Erreur lors de la sauvegarde !");
      }
    };

    return (
      <div style={{ overflowX: "auto" }}>
        <table className="soft-table">
          <thead>
            <tr>
              {editableFields.map(field =>
                <th key={field}>{fieldLabels[field] || field}</th>
              )}
              <th>Confirmé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={editableFields.length + 2} style={noResultStyle}>Aucun résultat</td>
              </tr>
            ) : list.map((c, idx) => (
              <tr
                key={c.id}
                style={{
                  background: idx % 2 === 0 ? "#fafdff" : "#eaf3ff"
                }}
              >
                {editId === c.id ? (
                  <>
                    {editableFields.map(field => (
                      <td key={field}>
                        <input
                          className="soft-input"
                          value={typeof editForm[field] === "boolean"
                            ? editForm[field] ? "true" : "false"
                            : editForm[field] ?? ""}
                          onChange={e =>
                            setEditForm(prev => ({
                              ...prev,
                              [field]: e.target.value
                            }))
                          }
                        />
                      </td>
                    ))}
                    <td>
                      <select
                        className="soft-input"
                        value={editForm.is_confirmed ? "true" : "false"}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            is_confirmed: e.target.value === "true"
                          }))
                        }
                      >
                        <option value="false">❌</option>
                        <option value="true">✔️</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="soft-btn"
                        style={{ maxWidth: 38, marginRight: 6, padding: "2px 9px" }}
                        onClick={() => saveEditRow(c.id)}
                      >✔️</button>
                      <button
                        className="soft-btn"
                        style={{ background: "#e91c1c", maxWidth: 38, padding: "2px 9px" }}
                        onClick={cancelEditRow}
                      >✖️</button>
                    </td>
                  </>
                ) : (
                  <>
                    {editableFields.map(field => (
                      <td key={field}>{c[field] ?? ""}</td>
                    ))}
                    <td style={{ textAlign: "center" }}>{c.is_confirmed ? "✔️" : "❌"}</td>
                    <td>
                      <button
                        className="soft-btn"
                        style={{ maxWidth: 85, marginRight: 6, padding: "2px 11px" }}
                        onClick={() => startEditRow(c)}
                      >Éditer</button>
                      <button
                        className="soft-btn"
                        style={{ background: "#d93240", maxWidth: 90, padding: "2px 11px" }}
                        onClick={() => handleDelete(c.id)}
                      >Supprimer</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // --- Tableau des Requests (demande d’aide)
  function renderRequestTable() {
    const list = filterRequests(requests, search);
    const saveStatus = async (id: number, value: string) => {
      try {
        const res = await fetch(`${API_URL}/admin/help-requests/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: value })
        });
        if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
        await fetchRequests();
      } catch {
        alert("Erreur lors de la sauvegarde du status");
      }
    };

    return (
      <div style={{ overflowX: "auto" }}>
        <table className="soft-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Sexe</th>
              <th>State</th>
              <th>City</th>
              <th>Service</th>
              <th>Status</th>
              <th>Sent At</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={8} style={noResultStyle}>Aucun résultat</td>
              </tr>
            ) : list.map((r, idx) => (
              <tr
                key={r.id}
                style={{
                  background: idx % 2 === 0 ? "#fffbe5" : "#eaf3ff"
                }}
              >
                <td>{r.user_name ?? r.user_id}</td>
                <td>{r.sexe}</td>
                <td>{r.state}</td>
                <td>{r.city}</td>
                <td>{r.service}</td>
                <td>
                  <select
                    className="soft-input"
                    style={{ width: "90%" }}
                    value={r.status}
                    onChange={e => saveStatus(r.id, e.target.value)}
                  >
                    <option value="traitement">Traitement</option>
                    <option value="terminer">Terminer</option>
                    <option value="peut etre modifier">Peut être modifier</option>
                  </select>
                </td>
                <td>{r.created_at}</td>
                <td>{r.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // --- Tableau des Registers (pré-inscrits)
  function renderRegisterTable() {
    const list = filterRegisters(registers, search);
    const handleDeleteRegister = async (id?: number) => {
      if (!id) return;
      if (!window.confirm("Voulez-vous supprimer cet enregistrement ?")) return;
      try {
        const res = await fetch(`${API_URL}/admin/registers/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        await fetchRegisters();
      } catch {
        alert("Erreur lors de la suppression !");
      }
    };

    return (
      <div style={{ overflowX: "auto" }}>
        <table className="soft-table">
          <thead>
            <tr>
              <th>Sexe</th>
              <th>Status</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zipcode</th>
              <th>Birth (Y/M/D)</th>
              <th>Confirm</th>
              <th>Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={14} style={noResultStyle}>Aucun résultat</td>
              </tr>
            ) : list.map((r, idx) => (
              <tr
                key={String(r.id)}
                style={{
                  background: idx % 2 === 0 ? "#f7faff" : "#eaf3ff"
                }}
              >
                <td>{r.sexe}</td>
                <td>{r.status}</td>
                <td>{r.first_name}</td>
                <td>{r.last_name}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>{r.address}</td>
                <td>{r.city}</td>
                <td>{r.state}</td>
                <td>{r.zipcode}</td>
                <td>{`${r.year_of_birth}/${r.month_of_birth ?? ""}/${r.day_of_birth ?? ""}`}</td>
                <td style={{ textAlign: "center" }}>{r.is_confirmed ? "✔️" : "❌"}</td>
                <td>{r.document ?? ""}</td>
                <td>
                  <button
                    className="soft-btn"
                    style={{ background: "#d93240", maxWidth: 95, padding: "2px 11px" }}
                    onClick={() => handleDeleteRegister(r.id)}
                  >Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // --- Formulaire d'ajout pour Register (idem version précédente)
   function renderRegisterForm() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setRegisterSuccess(false);
        setRegisterError("");
        try {
          const res = await fetch(`${API_URL}/admin/registers`, {
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
      {/* Ligne 1 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="sexe">Sexe *</label>
          <input
            required
            name="sexe"
            id="sexe"
            value={registerForm.sexe}
            onChange={e => setRegisterForm(f => ({ ...f, sexe: e.target.value }))}
            className="soft-input"
            placeholder="M / F / Autre"
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="status">Status *</label>
          <input
            required
            name="status"
            id="status"
            value={registerForm.status}
            onChange={e => setRegisterForm(f => ({ ...f, status: e.target.value }))}
            className="soft-input"
            placeholder="Pending / Active / ..."
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="document">Document</label>
          <input
            name="document"
            id="document"
            value={registerForm.document ?? ""}
            onChange={e => setRegisterForm(f => ({ ...f, document: e.target.value }))}
            className="soft-input"
            placeholder="N° Passeport, ID, etc."
          />
        </div>
      </div>
      {/* Ligne 2 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="first_name">First Name *</label>
          <input
            required
            name="first_name"
            id="first_name"
            value={registerForm.first_name}
            onChange={e => setRegisterForm(f => ({ ...f, first_name: e.target.value }))}
            className="soft-input"
            placeholder="ex: Jean"
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="last_name">Last Name *</label>
          <input
            required
            name="last_name"
            id="last_name"
            value={registerForm.last_name}
            onChange={e => setRegisterForm(f => ({ ...f, last_name: e.target.value }))}
            className="soft-input"
            placeholder="ex: Pierre"
          />
        </div>
      </div>
      {/* Ligne 3 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="email">Email *</label>
          <input
            required
            type="email"
            name="email"
            id="email"
            value={registerForm.email}
            onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
            className="soft-input"
            placeholder="ex: mail@domain.com"
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="phone">Phone *</label>
          <input
            required
            name="phone"
            id="phone"
            value={registerForm.phone}
            onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))}
            className="soft-input"
            placeholder="ex: 37000000"
          />
        </div>
      </div>
      {/* Ligne 4 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="address">Address *</label>
          <input
            required
            name="address"
            id="address"
            value={registerForm.address}
            onChange={e => setRegisterForm(f => ({ ...f, address: e.target.value }))}
            className="soft-input"
            placeholder="ex: 12 Rue Bonheur"
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="city">City *</label>
          <input
            required
            name="city"
            id="city"
            value={registerForm.city}
            onChange={e => setRegisterForm(f => ({ ...f, city: e.target.value }))}
            className="soft-input"
            placeholder="ex: Port-au-Prince"
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="state">State *</label>
          <input
            required
            name="state"
            id="state"
            value={registerForm.state}
            onChange={e => setRegisterForm(f => ({ ...f, state: e.target.value }))}
            className="soft-input"
            placeholder="ex: Ouest"
          />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label htmlFor="zipcode">Zipcode *</label>
          <input
            required
            name="zipcode"
            id="zipcode"
            value={registerForm.zipcode}
            onChange={e => setRegisterForm(f => ({ ...f, zipcode: e.target.value }))}
            className="soft-input"
            placeholder="ex: 6140"
          />
        </div>
      </div>
      {/* Ligne 5 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label htmlFor="year_of_birth">Year of Birth *</label>
          <input
            required
            name="year_of_birth"
            id="year_of_birth"
            value={registerForm.year_of_birth}
            onChange={e => setRegisterForm(f => ({ ...f, year_of_birth: e.target.value }))}
            className="soft-input"
            placeholder="ex: 1990"
          />
        </div>
        <div style={{ flex: 1, minWidth: 100 }}>
          <label htmlFor="month_of_birth">Month of Birth</label>
          <input
            name="month_of_birth"
            id="month_of_birth"
            value={registerForm.month_of_birth ?? ""}
            onChange={e => setRegisterForm(f => ({ ...f, month_of_birth: e.target.value }))}
            className="soft-input"
            placeholder="ex: 03"
          />
        </div>
        <div style={{ flex: 1, minWidth: 100 }}>
          <label htmlFor="day_of_birth">Day of Birth</label>
          <input
            name="day_of_birth"
            id="day_of_birth"
            value={registerForm.day_of_birth ?? ""}
            onChange={e => setRegisterForm(f => ({ ...f, day_of_birth: e.target.value }))}
            className="soft-input"
            placeholder="ex: 14"
          />
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <label htmlFor="is_confirmed">Confirm *</label>
          <select
            required
            name="is_confirmed"
            id="is_confirmed"
            value={registerForm.is_confirmed ? "true" : "false"}
            onChange={e => setRegisterForm(f => ({ ...f, is_confirmed: e.target.value === "true" }))}
            className="soft-input"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
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
        <div style={{
          color: "#259621",
          fontWeight: 600,
          background: "#edffec",
          borderRadius: 7,
          padding: 12,
          marginTop: 6,
          textAlign: "center",
          fontSize: 15
        }}>
          Enregistré avec succès !
        </div>
      )}
      {registerError && (
        <div style={{
          color: "#c72525",
          fontWeight: 600,
          background: "#ffeded",
          borderRadius: 7,
          padding: 12,
          marginTop: 6,
          textAlign: "center",
          fontSize: 15
        }}>
          {registerError}
        </div>
      )}
    </form>
  );
}


  // --- RENDU PRINCIPAL
  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "44px 12px" }}>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 18, color: "#145a7e" }}>Admin Dashboard</h1>
          <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: "1 1 auto" }}>
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
            </div>
            <input
              placeholder="🔍 Rechercher par champ…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                minWidth: 220, padding: 8, fontSize: 15,
                border: "1px solid #c1d4ea", borderRadius: 9, marginTop: 4
              }}
            />
          </div>
          {editError && (
            <div style={{ color: "#c72525", fontWeight: 600, background: "#ffeded", borderRadius: 7, padding: 12, marginBottom: 12, textAlign: "center", fontSize: 15 }}>
              {editError}
            </div>
          )}
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
const noResultStyle: React.CSSProperties = { textAlign: "center", color: "#888", background: "#f3f7fa", padding: 16 };

// Ajoute ceci dans ton CSS si besoin pour la responsivité des tables :
/*
@media (max-width: 700px) {
  .soft-table th, .soft-table td { font-size: 12px; padding: 7px 3px; }
  .soft-input { font-size: 13px; }
}
*/
