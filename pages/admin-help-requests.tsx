import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Onglets du dashboard admin
const TABS = ["Client", "Request", "Register"];

// ---- MODELES TYPES ----
interface Client {
  [key: string]: unknown; // <-- index signature ajouté
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
  document: string;
}

// ---- DUMMY DATA ----
const DUMMY_CLIENTS: Client[] = [
  {
    id: 1, sexe: "M", status: "Active", firstName: "Jean", lastName: "Pierre",
    email: "jp@gmail.com", phone: "123456", address: "Rue X", city: "Port-au-Prince", state: "Ouest", zipcode: "6110",
    yearOfBirth: "1992", monthOfBirth: "04", dayOfBirth: "22", confirm: true
  },
  // Ajoute plus de clients ici...
];

const DUMMY_REQUESTS: HelpRequest[] = [
  {
    id: 5, user_id: 1, user_name: "Jean Pierre", sexe: "M", state: "Ouest", city: "PaP",
    service: "Legal", status: "Pending", createdAt: "2024-07-21", updatedAt: "2024-07-22"
  },
  // ...
];

const DUMMY_REGISTERS: Register[] = [
  {
    id: 13, sexe: "F", status: "Pending", firstName: "Marie", lastName: "Louise",
    email: "marie@gmail.com", phone: "987654", address: "Rue Y", city: "Cité Soleil", state: "Ouest",
    zipcode: "6111", yearOfBirth: "2001", monthOfBirth: "12", dayOfBirth: "01", confirm: false,
    document: "passport.pdf"
  }
  // ...
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("Client");
  // Données réelles à charger via API si besoin !
  const [clients] = useState<Client[]>(DUMMY_CLIENTS);
  const [requests] = useState<HelpRequest[]>(DUMMY_REQUESTS);
  const [registers] = useState<Register[]>(DUMMY_REGISTERS);

  // Recherche/tri par input
  const [search, setSearch] = useState("");

  // ---- FILTRES ----
  function filterData<T extends Record<string, unknown>>(list: T[], search: string): T[] {
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter(item =>
      Object.values(item).some(
        val => typeof val === "string" && val.toLowerCase().includes(s)
      )
    );
  }

  // ----- TABLEAU CLIENT -----
  function renderClientTable() {
    const list = filterData(clients, search);
    return (
      <table style={{ width: "100%" }}>
        <thead>
          <tr style={{ background: "#e8f2fa" }}>
            <th>Sexe</th><th>Status</th><th>First Name</th><th>Last Name</th><th>Email</th>
            <th>Phone</th><th>Address</th><th>City</th><th>State</th><th>Zipcode</th>
            <th>Birth (Y/M/D)</th><th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={12} style={{ textAlign: "center", color: "#888" }}>No results</td></tr>
          ) : (
            list.map(c => (
              <tr key={String(c.id)}>
                <td>{c.sexe as string}</td><td>{c.status as string}</td><td>{c.firstName as string}</td><td>{c.lastName as string}</td><td>{c.email as string}</td>
                <td>{c.phone as string}</td><td>{c.address as string}</td><td>{c.city as string}</td><td>{c.state as string}</td><td>{c.zipcode as string}</td>
                <td>{`${c.yearOfBirth as string}/${c.monthOfBirth as string}/${c.dayOfBirth as string}`}</td>
                <td>{c.confirm ? "✔️" : "❌"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  // ----- TABLEAU REQUEST -----
  function renderRequestTable() {
    const list = filterData(requests, search);
    return (
      <table style={{ width: "100%" }}>
        <thead>
          <tr style={{ background: "#e8f2fa" }}>
            <th>User</th><th>Sexe</th><th>State</th><th>City</th>
            <th>Service</th><th>Status</th><th>Sent At</th><th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={8} style={{ textAlign: "center", color: "#888" }}>No results</td></tr>
          ) : (
            list.map(r => (
              <tr key={String(r.id)}>
                <td>{(r.user_name as string) || (r.user_id as number)}</td>
                <td>{r.sexe as string}</td>
                <td>{r.state as string}</td>
                <td>{r.city as string}</td>
                <td>{r.service as string}</td>
                <td>{r.status as string}</td>
                <td>{r.createdAt as string}</td>
                <td>{r.updatedAt as string}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  // ----- TABLEAU REGISTER -----
  function renderRegisterTable() {
    const list = filterData(registers, search);
    return (
      <table style={{ width: "100%" }}>
        <thead>
          <tr style={{ background: "#e8f2fa" }}>
            <th>Sexe</th><th>Status</th><th>First Name</th><th>Last Name</th><th>Email</th>
            <th>Phone</th><th>Address</th><th>City</th><th>State</th><th>Zipcode</th>
            <th>Birth (Y/M/D)</th><th>Confirm</th><th>Document</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={13} style={{ textAlign: "center", color: "#888" }}>No results</td></tr>
          ) : (
            list.map(r => (
              <tr key={String(r.id)}>
                <td>{r.sexe as string}</td><td>{r.status as string}</td><td>{r.firstName as string}</td><td>{r.lastName as string}</td><td>{r.email as string}</td>
                <td>{r.phone as string}</td><td>{r.address as string}</td><td>{r.city as string}</td><td>{r.state as string}</td><td>{r.zipcode as string}</td>
                <td>{`${r.yearOfBirth as string}/${r.monthOfBirth as string}/${r.dayOfBirth as string}`}</td>
                <td>{r.confirm ? "✔️" : "❌"}</td>
                <td>{r.document as string}</td>
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
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: 18 }}>Admin Dashboard</h1>
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
