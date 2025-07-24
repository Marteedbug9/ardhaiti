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
  }, [API_URL]);

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
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
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
        body: JSON.stringify(form),
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
      <main className="admin-page-bg">
        <div className="admin-container">
          <h1 className="soft-card-title">Projets d’aide humanitaire</h1>

          <h2 className="soft-section-title">Ajouter un nouveau projet</h2>
          <form onSubmit={handleSubmit} className="soft-card" style={{ gap: 16, display: "flex", flexDirection: "column" }}>
            <div className="form-row">
              <div>
                <label>Nom du projet *</label>
                <input
                  required name="name" value={form.name} onChange={handleChange}
                  className="soft-input"
                  placeholder="Ex: Aide alimentaire Juillet 2025"
                />
              </div>
              <div>
                <label>Statut *</label>
                <select
                  required name="status" value={form.status} onChange={handleChange}
                  className="soft-input"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Prévu">Prévu</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Personnes aidées *</label>
                <input
                  required type="number" min={0}
                  name="peopleCount" value={form.peopleCount}
                  onChange={handleChange}
                  className="soft-input"
                  placeholder="Ex: 500"
                />
              </div>
              <div>
                <label>Aide Humaine *</label>
                <input
                  required type="number" min={0}
                  name="workforceCount" value={form.workforceCount}
                  onChange={handleChange}
                  className="soft-input"
                  placeholder="Nombre de bénévoles/travailleurs"
                />
              </div>
              <div>
                <label>Dépenses ($) *</label>
                <input
                  required type="number" min={0}
                  name="expenses" value={form.expenses}
                  onChange={handleChange}
                  className="soft-input"
                  placeholder="Montant total"
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Type de bénéficiaire *</label>
                <select
                  required name="beneficiaryType" value={form.beneficiaryType} onChange={handleChange}
                  className="soft-input"
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
              <div>
                <label>Date de début *</label>
                <input
                  required name="startDate" type="date" value={form.startDate}
                  onChange={handleChange}
                  className="soft-input"
                />
              </div>
              <div>
                <label>Date de fin *</label>
                <input
                  required name="endDate" type="date" value={form.endDate}
                  onChange={handleChange}
                  className="soft-input"
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
                className="soft-input"
                style={{ minHeight: 60, resize: "vertical" }}
                placeholder="Brève description du projet, objectifs, modalités, etc."
              />
            </div>
            <div>
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="soft-input"
                style={{ minHeight: 40, resize: "vertical" }}
                placeholder="Notes additionnelles"
              />
            </div>

            <button type="submit" className="soft-btn" style={{ marginTop: 10, minWidth: 120 }}>
              Enregistrer
            </button>

            {success && (
              <div className="soft-success">Projet enregistré !</div>
            )}
            {error && (
              <div className="soft-error">{error}</div>
            )}
          </form>

          <div className="soft-card">
            <h2 className="soft-section-title">Liste des projets</h2>
            <div className="soft-table-responsive">
              <table className="soft-table responsive-table">
                <thead>
                  <tr>
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
                  ) : projects.map((p, idx) => (
                    <tr key={p.id}>
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
