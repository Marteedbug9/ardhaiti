import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token || typeof token !== "string") {
      setError("Lien invalide ou expiré.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{
          maxWidth: 480, margin: "0 auto", padding: "44px 16px"
        }}>
          <h1 style={{
            fontSize: "1.5rem", fontWeight: 700, color: "#1976d2",
            marginBottom: 28, textAlign: "center"
          }}>
            Définir mon mot de passe
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff", borderRadius: 14,
              boxShadow: "0 4px 18px #135ba712", padding: 30,
              display: "flex", flexDirection: "column", gap: 20
            }}
          >
            <div>
              <label>Nouveau mot de passe *</label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Mot de passe (min 8 caractères)"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label>Confirmer le mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Confirmez le mot de passe"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#1976d2", color: "#fff", fontWeight: 700,
                fontSize: 17, border: "none", borderRadius: 8,
                padding: "12px 0", marginTop: 8, cursor: "pointer"
              }}
            >
              {loading ? "Enregistrement…" : "Définir le mot de passe"}
            </button>
            {success && (
              <div style={{
                color: "#259621", fontWeight: 600, background: "#edffec",
                borderRadius: 7, padding: 12, marginTop: 6, textAlign: "center", fontSize: 15
              }}>
                Mot de passe enregistré ! Vous pouvez maintenant vous connecter.
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
        </div>
      </main>
      <Footer />
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 3,
  padding: "10px 11px",
  fontSize: 15,
  borderRadius: 8,
  border: "1px solid #c4d5ec",
  outline: "none",
  background: "#f8fbfe"
};
