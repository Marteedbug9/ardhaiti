import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!form.identifier || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && (data.ok || data.token || data.userId)) {
        setSubmitted(true);

        // Stocke userId et role si disponibles
        if (data.userId) localStorage.setItem("userId", data.userId);
        if (data.role) localStorage.setItem("role", data.role);

        // Redirige selon le rôle : admin => admin-help-requests, sinon help-request
        setTimeout(() => {
          if (data.role === "admin") {
            router.push("/admin-help-requests");
          } else {
            router.push("/help-request");
          }
        }, 1200); // 1.2s de délai pour laisser voir le message
      } else {
        setError(data.error || "Login failed. Check your credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 8px 40px 8px", color: "#145a7e" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 18 }}>Login</h1>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 18px #145a7e16",
              padding: "24px 22px",
              marginBottom: 24,
            }}
          >
            <label htmlFor="identifier" style={{ fontWeight: 600, display: "block" }}>
              Email or Phone Number<span style={{ color: "#e64b1d" }}>*</span>
            </label>
            <input
              required
              type="text"
              name="identifier"
              id="identifier"
              placeholder="Email or Phone"
              value={form.identifier}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #c1d4ea",
                marginBottom: 16,
                marginTop: 3,
              }}
            />

            <label htmlFor="password" style={{ fontWeight: 600, display: "block" }}>
              Password<span style={{ color: "#e64b1d" }}>*</span>
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #c1d4ea",
                marginBottom: 20,
                marginTop: 3,
              }}
            />

            <button
              type="submit"
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
                transition: "background 0.15s",
              }}
            >
              Login
            </button>

            {submitted && !error && (
              <div style={{ marginTop: 15, color: "#118c47", fontWeight: 600 }}>
                Login successful!
              </div>
            )}
            {error && (
              <div style={{ marginTop: 15, color: "#d32f2f", fontWeight: 600 }}>
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
