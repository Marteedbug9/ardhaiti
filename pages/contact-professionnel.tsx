import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar_adm";
import Footer from "../components/Footer";

interface ContactFormState {
  businessName: string;
  businessType: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

interface ProContact {
  id: number;
  business_name: string;
  business_type: string;
  first_name: string;
  last_name: string;
  job_title: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  created_at: string;
}

const INIT_STATE: ContactFormState = {
  businessName: "",
  businessType: "",
  firstName: "",
  lastName: "",
  jobTitle: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Conversion camelCase => snake_case pour le POST/PUT
const mapFormToSQL = (form: ContactFormState) => ({
  business_name: form.businessName,
  business_type: form.businessType,
  first_name: form.firstName,
  last_name: form.lastName,
  job_title: form.jobTitle,
  phone: form.phone,
  email: form.email,
  address: form.address,
  note: form.note,
});

// Conversion SQL => camelCase pour le formulaire d’édition
const mapSQLToForm = (contact: ProContact): ContactFormState => ({
  businessName: contact.business_name,
  businessType: contact.business_type,
  firstName: contact.first_name,
  lastName: contact.last_name,
  jobTitle: contact.job_title,
  phone: contact.phone,
  email: contact.email,
  address: contact.address,
  note: contact.note || "",
});

export default function AdminProfessionalContactsPage() {
  const [form, setForm] = useState<ContactFormState>(INIT_STATE);
  const [contacts, setContacts] = useState<ProContact[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null); // Pour édition

  // Récupération
  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/professional-contacts`);
      if (!res.ok) throw new Error("Erreur lors du chargement des contacts");
      const data: ProContact[] = await res.json();
      setContacts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue lors du chargement");
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Saisie
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ajout ou édition selon editId
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${API_URL}/admin/professional-contacts/${editId}`
      : `${API_URL}/admin/professional-contacts`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapFormToSQL(form)),
      });
      if (!res.ok) throw new Error(editId ? "Erreur lors de la modification" : "Erreur lors de l'enregistrement");
      setSuccess(true);
      setForm(INIT_STATE);
      setEditId(null);
      fetchContacts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Éditer un contact
  const startEdit = (contact: ProContact) => {
    setForm(mapSQLToForm(contact));
    setEditId(contact.id);
    setSuccess(false);
    setError("");
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce contact ?")) return;
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/professional-contacts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      fetchContacts();
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Annuler édition
  const cancelEdit = () => {
    setEditId(null);
    setForm(INIT_STATE);
    setError("");
    setSuccess(false);
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "46px 16px" }}>
          <h1 style={{
            fontSize: "1.6rem", fontWeight: 700, color: "#1976d2",
            marginBottom: 24, textAlign: "center"
          }}>
            Contacts Professionnels
          </h1>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 4px 18px #135ba712",
              padding: 30,
              marginBottom: 40,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            <div className="form-row">
              <div>
                <label>Business Name *</label>
                <input
                  required name="businessName" value={form.businessName} onChange={handleChange}
                  className="soft-input"
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <label>Type of Business *</label>
                <input
                  required name="businessType" value={form.businessType} onChange={handleChange}
                  className="soft-input"
                  placeholder="Type (SAS, LLC, Service...)"
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>First Name *</label>
                <input
                  required name="firstName" value={form.firstName} onChange={handleChange}
                  className="soft-input"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label>Last Name *</label>
                <input
                  required name="lastName" value={form.lastName} onChange={handleChange}
                  className="soft-input"
                  placeholder="Votre nom"
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Position/Job Title *</label>
                <input
                  required name="jobTitle" value={form.jobTitle} onChange={handleChange}
                  className="soft-input"
                  placeholder="Directeur, RH, etc."
                />
              </div>
              <div>
                <label>Phone *</label>
                <input
                  required name="phone" value={form.phone} onChange={handleChange}
                  className="soft-input"
                  placeholder="Téléphone"
                  type="tel"
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Email *</label>
                <input
                  required name="email" value={form.email} onChange={handleChange}
                  className="soft-input"
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div>
                <label>Address *</label>
                <input
                  required name="address" value={form.address} onChange={handleChange}
                  className="soft-input"
                  placeholder="Adresse professionnelle"
                />
              </div>
            </div>
            <div>
              <label>Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="soft-input"
                style={{ minHeight: 80, resize: "vertical" }}
                placeholder="Votre message, une demande, un commentaire…"
              />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
                  transition: "background .15s",
                  minWidth: 120,
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#12599e")}
                onMouseOut={e => (e.currentTarget.style.background = "#1976d2")}
              >
                {editId ? "Modifier" : "Enregistrer"}
              </button>
              {editId && (
                <button
                  type="button"
                  style={{
                    background: "#c72525", color: "#fff", fontWeight: 600, borderRadius: 8, border: "none",
                    padding: "12px 0", marginTop: 10, minWidth: 120, cursor: "pointer"
                  }}
                  onClick={cancelEdit}
                >Annuler</button>
              )}
            </div>

            {success && (
              <div style={{
                color: "#259621", fontWeight: 600, background: "#edffec",
                borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15
              }}>
                {editId ? "Modifié avec succès !" : "Enregistré avec succès !"}
              </div>
            )}
            {error && (
              <div style={{
                color: "#c72525", fontWeight: 600, background: "#ffeded",
                borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15
              }}>
                {error}
              </div>
            )}
          </form>

          {/* TABLEAU DES CONTACTS */}
          <div style={{ background: "#fff", borderRadius: 13, boxShadow: "0 4px 12px #165b8310", padding: 16 }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#1976d2", fontSize: 19 }}>Contacts enregistrés</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="soft-table">
                <thead>
                  <tr style={{ background: "#e8f2fa" }}>
                    <th>Entreprise</th>
                    <th>Type</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Poste</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Adresse</th>
                    <th>Note</th>
                    <th>Ajouté le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", color: "#888" }}>
                        Aucun contact enregistré
                      </td>
                    </tr>
                  ) : contacts.map(c => (
                    <tr key={c.id} style={{ background: "#fafcff" }}>
                      <td>{c.business_name}</td>
                      <td>{c.business_type}</td>
                      <td>{c.first_name}</td>
                      <td>{c.last_name}</td>
                      <td>{c.job_title}</td>
                      <td>{c.phone}</td>
                      <td>{c.email}</td>
                      <td>{c.address}</td>
                      <td>{c.note || "-"}</td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          style={{
                            background: "#1976d2", color: "#fff", border: "none", borderRadius: 7,
                            padding: "5px 14px", marginRight: 5, cursor: "pointer"
                          }}
                          onClick={() => startEdit(c)}
                        >Éditer</button>
                        <button
                          style={{
                            background: "#c72525", color: "#fff", border: "none", borderRadius: 7,
                            padding: "5px 14px", cursor: "pointer"
                          }}
                          onClick={() => handleDelete(c.id)}
                        >Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}