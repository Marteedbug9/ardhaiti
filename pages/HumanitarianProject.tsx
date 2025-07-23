import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar_adm";
import Footer from "../components/Footer";

interface HumanitarianProjectForm {
  name: string;
  peopleCount: number;
  workforceCount: number;
  expenses: number;
  beneficiaryType: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  notes: string;
}
interface HumanitarianProject {
  id: number;
  name: string;
  people_count: number;
  workforce_count: number;
  expenses: number;
  beneficiary_type: string;
  status: string;
  start_date: string;
  end_date: string;
  description: string;
  notes: string;
  created_at: string;
}

const INIT_STATE: HumanitarianProjectForm = {
  name: "",
  peopleCount: 0,
  workforceCount: 0,
  expenses: 0,
  beneficiaryType: "",
  status: "",
  startDate: "",
  endDate: "",
  description: "",
  notes: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HumanitarianProjectsPage() {
  const [form, setForm] = useState<HumanitarianProjectForm>(INIT_STATE);
  const [projects, setProjects] = useState<HumanitarianProject[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const numberFields = ["peopleCount", "workforceCount", "expenses"];

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/humanitarian-projects`);
      if (!res.ok) throw new Error("Erreur lors du chargement des projets");
      const data: HumanitarianProject[] = await res.json();
      setProjects(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur inconnue lors du chargement");
      } else {
        setError("Erreur inconnue lors du chargement");
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    if (numberFields.includes(name)) {
      setForm((f) => ({
        ...f,
        [name]: value === "" ? "" : Number(value)
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/humanitarian-projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      setSuccess(true);
      setForm(INIT_STATE);
      fetchProjects();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur inconnue");
      } else {
        setError("Erreur inconnue");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh", color: "#111" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "46px 16px" }}>
          <h1 style={{
            fontSize: "2rem", fontWeight: 800, color: "#135ba733",
            marginBottom: 28, textAlign: "center", letterSpacing: 1
          }}>
            Projets d’aide humanitaire
          </h1>

          <h2 style={{ color: "#135ba733", fontSize: 18, marginBottom: 8, fontWeight: 700 }}>
            Ajouter un nouveau projet
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 4px 18px #aaa2",
              padding: 30,
              marginBottom: 40,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              color: "#111"
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 2 }}>
                <label style={{ color: "#135ba733" }}>Nom du projet *</label>
                <input
                  required name="name" value={form.name} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Ex: Aide alimentaire Juillet 2025"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Statut *</label>
                <select
                  required name="status" value={form.status} onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Prévu">Prévu</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Personnes aidées *</label>
                <input
                  required type="number" min={0}
                  name="peopleCount" value={form.peopleCount}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Ex: 500"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Aide Humaine *</label>
                <input
                  required type="number" min={0}
                  name="workforceCount" value={form.workforceCount}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Nombre de bénévoles/travailleurs"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Dépenses ($) *</label>
                <input
                  required type="number" min={0}
                  name="expenses" value={form.expenses}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Montant total"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Type de bénéficiaire *</label>
                <select
                  required name="beneficiaryType" value={form.beneficiaryType} onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Enfants">Enfants</option>
                  <option value="Femmes">Femmes</option>
                  <option value="Familles">Familles</option>
                  <option value="Personnes âgées">Personnes âgées</option>
                  <option value="Réfugiés">Réfugiés</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Date de début *</label>
                <input
                  required name="startDate" type="date" value={form.startDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#135ba733" }}>Date de fin *</label>
                <input
                  required name="endDate" type="date" value={form.endDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={{ color: "#135ba733" }}>Description *</label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: 60, resize: "vertical", color: "#111" }}
                placeholder="Brève description du projet, objectifs, modalités, etc."
              />
            </div>
            <div>
              <label style={{ color: "#135ba733" }}>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: 40, resize: "vertical", color: "#135ba733" }}
                placeholder="Notes additionnelles"
              />
            </div>

            <button
              type="submit"
              style={{
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                marginTop: 10,
                boxShadow: "0 2px 8px #3335",
                cursor: "pointer",
                transition: "background .15s"
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#333")}
              onMouseOut={e => (e.currentTarget.style.background = "#111")}
            >
              Enregistrer
            </button>

            {success && (
              <div style={{
                color: "#259621", fontWeight: 600, background: "#edffec",
                borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15
              }}>
                Projet enregistré !
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

          {/* TABLEAU DES PROJETS */}
          <div style={{ background: "#fff", borderRadius: 13, boxShadow: "0 4px 12px #bbb8", padding: 16 }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#111", fontSize: 19, fontWeight: 700 }}>
              Liste des projets
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Nom</th>
                    <th style={thStyle}>Bénéficiaires</th>
                    <th style={thStyle}>Aide Humaine</th>
                    <th style={thStyle}>Dépenses ($)</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Statut</th>
                    <th style={thStyle}>Début</th>
                    <th style={thStyle}>Fin</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Notes</th>
                    <th style={thStyle}>Ajouté le</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", color: "#888" }}>
                        Aucun projet enregistré
                      </td>
                    </tr>
                  ) : projects.map((p, idx) => (
                    <tr
                      key={p.id}
                      style={{
                        background: idx % 2 === 0 ? "#fff" : "#ededed"
                      }}
                    >
                      <td style={tdStyle}>{p.name}</td>
                      <td style={tdStyle}>{p.people_count}</td>
                      <td style={tdStyle}>{p.workforce_count}</td>
                      <td style={tdStyle}>{p.expenses}</td>
                      <td style={tdStyle}>{p.beneficiary_type}</td>
                      <td style={tdStyle}>{p.status}</td>
                      <td style={tdStyle}>{new Date(p.start_date).toLocaleDateString()}</td>
                      <td style={tdStyle}>{new Date(p.end_date).toLocaleDateString()}</td>
                      <td style={tdStyle}>{p.description}</td>
                      <td style={tdStyle}>{p.notes || "-"}</td>
                      <td style={tdStyle}>{new Date(p.created_at).toLocaleDateString()}</td>
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

// Styles bien visibles
const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 3,
  marginBottom: 0,
  padding: "10px 11px",
  fontSize: 15,
  borderRadius: 8,
  border: "1px solid #222",
  outline: "none",
  background: "#fff",
  color: "#111"
};
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 15,
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  marginTop: 10,
  marginBottom: 20,
  boxShadow: "0 2px 8px #3332"
};
const thStyle: React.CSSProperties = {
  padding: "12px 7px",
  background: "#f1f1f1",
  color: "#111",
  fontWeight: 700,
  textAlign: "center",
  borderBottom: "2px solid #333"
};
const tdStyle: React.CSSProperties = {
  padding: "9px 7px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
  color: "#111"
};
