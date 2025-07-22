import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar_adm";
import Footer from "../components/Footer";

// Types/interfaces identiques à ta version
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
      const res = await fetch(`${API_URL}/api/admin/humanitarian-projects`, {
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
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "46px 16px" }}>
          <h1 style={{
            fontSize: "1.6rem", fontWeight: 700, color: "#1976d2",
            marginBottom: 24, textAlign: "center"
          }}>
            Projets d’aide humanitaire
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
              <div style={{ flex: 2 }}>
                <label>Nom du projet *</label>
                <input
                  required name="name" value={form.name} onChange={handleChange}
                  style={inputStyle}
                  placeholder="Ex: Aide alimentaire Juillet 2025"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Statut *</label>
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
                <label>Personnes aidées *</label>
                <input
                  required type="number" min={0}
                  name="peopleCount" value={form.peopleCount}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Ex: 500"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Aide Humaine*</label>
                <input
                  required type="number" min={0}
                  name="workforceCount" value={form.workforceCount}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Nombre de bénévoles/travailleurs"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Dépenses ($)*</label>
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
                <label>Type de bénéficiaire *</label>
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
                <label>Date de début *</label>
                <input
                  required name="startDate" type="date" value={form.startDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Date de fin *</label>
                <input
                  required name="endDate" type="date" value={form.endDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label>Description *</label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                placeholder="Brève description du projet, objectifs, modalités, etc."
              />
            </div>
            <div>
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: 40, resize: "vertical" }}
                placeholder="Notes additionnelles"
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
          <div style={{ background: "#fff", borderRadius: 13, boxShadow: "0 4px 12px #165b8310", padding: 16 }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#1976d2", fontSize: 19 }}>Liste des projets</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                <thead>
                  <tr style={{ background: "#e8f2fa" }}>
                    <th>Nom</th>
                    <th>Bénéficiaires</th>
                    <th>Aide Humaine</th>
                    <th>Dépenses ($)</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Description</th>
                    <th>Notes</th>
                    <th>Ajouté le</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", color: "#888" }}>
                        Aucun projet enregistré
                      </td>
                    </tr>
                  ) : projects.map(p => (
                    <tr key={p.id} style={{ background: "#fafcff" }}>
                      <td>{p.name}</td>
                      <td>{p.people_count}</td>
                      <td>{p.workforce_count}</td>
                      <td>{p.expenses}</td>
                      <td>{p.beneficiary_type}</td>
                      <td>{p.status}</td>
                      <td>{new Date(p.start_date).toLocaleDateString()}</td>
                      <td>{new Date(p.end_date).toLocaleDateString()}</td>
                      <td>{p.description}</td>
                      <td>{p.notes || "-"}</td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
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
