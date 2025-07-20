import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    // Validation simple avant envoi
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setError('All fields are required.');
      return;
    }
    if (!form.email.includes('@')) {
      setError('A valid email is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const data = await res.json();
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f7fafc", minHeight: "100vh" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 8px 40px 8px", color: "#145a7e" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>Get Involved</h1>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 6 }}>Donate • Contact</h2>
          <p style={{ margin: "10px 0 18px 0", color: "#11466a", fontSize: "1.08rem" }}>
            Join the conversation. We want to hear from you.<br />
            Please fill out this form and we will respond shortly.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 18px #145a7e16",
              padding: "24px 22px",
              marginBottom: 24
            }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="firstName" style={{ fontWeight: 600, display: "block" }}>
                  First Name<span style={{ color: "#e64b1d" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 8,
                    border: "1px solid #c1d4ea",
                    marginBottom: 16,
                    marginTop: 3
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="lastName" style={{ fontWeight: 600, display: "block" }}>
                  Last Name<span style={{ color: "#e64b1d" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 8,
                    border: "1px solid #c1d4ea",
                    marginBottom: 16,
                    marginTop: 3
                  }}
                />
              </div>
            </div>
            <label htmlFor="email" style={{ fontWeight: 600, display: "block" }}>
              Email Address<span style={{ color: "#e64b1d" }}>*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #c1d4ea",
                marginBottom: 16,
                marginTop: 3
              }}
            />

            <label htmlFor="subject" style={{ fontWeight: 600, display: "block" }}>
              Subject<span style={{ color: "#e64b1d" }}>*</span>
            </label>
            <input
              required
              type="text"
              name="subject"
              id="subject"
              value={form.subject}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #c1d4ea",
                marginBottom: 16,
                marginTop: 3
              }}
            />

            <label htmlFor="message" style={{ fontWeight: 600, display: "block" }}>
              Message<span style={{ color: "#e64b1d" }}>*</span>
            </label>
            <textarea
              required
              name="message"
              id="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #c1d4ea",
                marginBottom: 18,
                marginTop: 3,
                resize: "vertical"
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#e3e3e3" : "#145a7e",
                color: loading ? "#aaa" : "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontSize: "1.1rem",
                marginTop: 6,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s"
              }}>
              {loading ? "Sending..." : "Submit"}
            </button>

            {error && (
              <div style={{ marginTop: 14, color: "#d32f2f", fontWeight: 600 }}>
                {error}
              </div>
            )}
            {submitted && (
              <div style={{ marginTop: 15, color: "#118c47", fontWeight: 600 }}>
                Thank you! Your message has been sent.
              </div>
            )}
          </form>

          <div style={{ background: "#e8f2fa", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontWeight: 600, fontSize: "1.12rem", marginBottom: 6 }}>Other Ways to Get in Touch</div>
            <div>
              Call us at <a href="tel:3307431196" style={{ color: "#145a7e", textDecoration: "underline" }}>614-930-2727</a> or email us at <a href="mailto:contact@ardhaiti.com" style={{ color: "#145a7e", textDecoration: "underline" }}>contact@ardhaiti.com</a>.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
