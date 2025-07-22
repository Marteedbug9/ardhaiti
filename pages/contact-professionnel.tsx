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

// Conversion camelCase => snake_case pour le POST
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

export default function AdminProfessionalContactsPage() {
  const [form, setForm] = useState<ContactFormState>(INIT_STATE);
  const [contacts, setContacts] = useState<ProContact[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/professional-contacts`);
      if (!res.ok) throw new Error("Erreur lors du chargement des contacts");
      const data: ProContact[] = await res.json();
      setContacts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue lors du chargement");
      }
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/professional-contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapFormToSQL(form))
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      setSuccess(true);
      setForm(INIT_STATE);
      fetchContacts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue");
      }
    }
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
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label>Business Name *</label>
                <input
                  required name="businessName" value={form.businessName} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Type of Business *</label>
                <input
                  required name="businessType" value={form.businessType} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Type (SAS, LLC, Service...)"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label>First Name *</label>
                <input
                  required name="firstName" value={form.firstName} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Votre prénom"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Last Name *</label>
                <input
                  required name="lastName" value={form.lastName} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Votre nom"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label>Position/Job Title *</label>
                <input
                  required name="jobTitle" value={form.jobTitle} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Directeur, RH, etc."
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Phone *</label>
                <input
                  required name="phone" value={form.phone} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Téléphone"
                  type="tel"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label>Email *</label>
                <input
                  required name="email" value={form.email} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Address *</label>
                <input
                  required name="address" value={form.address} onChange={handleChange}
                  style={inputStyle}
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
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                placeholder="Votre message, une demande, un commentaire…"
              />
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
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#12599e")}
              onMouseOut={e => (e.currentTarget.style.background = "#1976d2")}
            >
              Enregistrer
            </button>

            {success && (
              <div style={{
                color: "#259621", fontWeight: 600, background: "#edffec",
                borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15
              }}>
                Enregistré avec succès !
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
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
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
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: "center", color: "#888" }}>
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
