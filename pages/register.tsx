import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Icône SVG œil plus compacte
const Eye = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <span onClick={onClick} style={{ cursor: "pointer", marginLeft: 2, userSelect: "none" }}>
    {open ? (
      <svg width="18" height="18" style={{ verticalAlign: "middle" }} fill="none" viewBox="0 0 24 24">
        <path stroke="#777" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
        <circle cx="12" cy="12" r="3.5" stroke="#777" strokeWidth="2"/>
      </svg>
    ) : (
      <svg width="18" height="18" style={{ verticalAlign: "middle" }} fill="none" viewBox="0 0 24 24">
        <path stroke="#777" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
        <line x1="4" y1="20" x2="20" y2="4" stroke="#777" strokeWidth="2"/>
      </svg>
    )}
  </span>
);

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  yearOfBirth: string;
  password: string;
  confirmPassword: string;
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function isNumeric(str: string) {
  return /^\d+$/.test(str);
}

function isOver18(year: string) {
  const yearInt = parseInt(year, 10);
  if (isNaN(yearInt)) return false;
  const currentYear = new Date().getFullYear();
  return currentYear - yearInt >= 18;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    yearOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zipcode ||
      !form.yearOfBirth ||
      !form.password ||
      !form.confirmPassword
    ) return "All fields are required.";
    if (!isValidEmail(form.email)) return "Please enter a valid email address.";
    if (!isNumeric(form.phone)) return "Phone must be a number only.";
    if (!isNumeric(form.yearOfBirth)) return "Year of birth must be a number.";
    if (!isOver18(form.yearOfBirth)) return "You must be at least 18 years old to register.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      // On envoie seulement le password, pas le confirmPassword
      const { confirmPassword, ...toSend } = form;
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSend),
      });
      if (res.ok) setSubmitted(true);
      else setError("An error occurred. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 8px 40px 8px", color: "#145a7e" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 18 }}>Create an Account</h1>
          <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 18px #145a7e16", padding: "24px 22px", marginBottom: 24 }}>
            {/* ... Tous les autres champs inchangés ... */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="firstName" style={{ fontWeight: 600, display: "block" }}>First Name<span style={{ color: "#e64b1d" }}>*</span></label>
                <input required type="text" name="firstName" id="firstName" value={form.firstName} onChange={handleChange}
                  style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="lastName" style={{ fontWeight: 600, display: "block" }}>Last Name<span style={{ color: "#e64b1d" }}>*</span></label>
                <input required type="text" name="lastName" id="lastName" value={form.lastName} onChange={handleChange}
                  style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />
              </div>
            </div>
            {/* ... email, phone, yearOfBirth, address, city, state, zipcode ... */}
            <label htmlFor="email" style={{ fontWeight: 600, display: "block" }}>Email Address<span style={{ color: "#e64b1d" }}>*</span></label>
            <input required type="email" name="email" id="email" value={form.email} onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />

            <label htmlFor="phone" style={{ fontWeight: 600, display: "block" }}>Phone Number<span style={{ color: "#e64b1d" }}>*</span></label>
            <input required type="tel" name="phone" id="phone" value={form.phone} onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />

            <label htmlFor="yearOfBirth" style={{ fontWeight: 600, display: "block" }}>Year of Birth<span style={{ color: "#e64b1d" }}>*</span></label>
            <input required type="text" name="yearOfBirth" id="yearOfBirth" value={form.yearOfBirth} onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }}
              placeholder="e.g. 1999" />

            <label htmlFor="address" style={{ fontWeight: 600, display: "block" }}>Address<span style={{ color: "#e64b1d" }}>*</span></label>
            <input required type="text" name="address" id="address" value={form.address} onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="city" style={{ fontWeight: 600, display: "block" }}>City<span style={{ color: "#e64b1d" }}>*</span></label>
                <input required type="text" name="city" id="city" value={form.city} onChange={handleChange}
                  style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="state" style={{ fontWeight: 600, display: "block" }}>State<span style={{ color: "#e64b1d" }}>*</span></label>
                <input required type="text" name="state" id="state" value={form.state} onChange={handleChange}
                  style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="zipcode" style={{ fontWeight: 600, display: "block" }}>Zip Code<span style={{ color: "#e64b1d" }}>*</span></label>
                <input required type="text" name="zipcode" id="zipcode" value={form.zipcode} onChange={handleChange}
                  style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #c1d4ea", marginBottom: 16, marginTop: 3 }} />
              </div>
            </div>

            {/* Mot de passe compact */}
            <label htmlFor="password" style={{ fontWeight: 600, display: "block" }}>Password<span style={{ color: "#e64b1d" }}>*</span></label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 26px 8px 8px",
                  borderRadius: 8,
                  border: "1px solid #c1d4ea",
                  marginTop: 3
                }}
              />
              <span style={{ position: "absolute", top: 10, right: 7 }}>
                <Eye open={showPassword} onClick={() => setShowPassword((v) => !v)} />
              </span>
            </div>

            {/* Confirmation mot de passe compact */}
            <label htmlFor="confirmPassword" style={{ fontWeight: 600, display: "block" }}>Confirm Password<span style={{ color: "#e64b1d" }}>*</span></label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                required
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 26px 8px 8px",
                  borderRadius: 8,
                  border: "1px solid #c1d4ea",
                  marginTop: 3
                }}
              />
              <span style={{ position: "absolute", top: 10, right: 7 }}>
                <Eye open={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
              </span>
            </div>

            <button type="submit"
              style={{
                width: "100%",
                background: "#145a7e",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontSize: "1.1rem",
                marginTop: 6,
                cursor: "pointer",
                transition: "background 0.15s"
              }}>
              Register
            </button>
            {submitted && (
              <div style={{ marginTop: 15, color: "#118c47", fontWeight: 600 }}>Thank you! Your registration was submitted.</div>
            )}
            {error && (
              <div style={{ marginTop: 15, color: "#d32f2f", fontWeight: 600 }}>{error}</div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
