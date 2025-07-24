import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
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
      const res = await fetch(`${API_URL}/contact`, {
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
        <div className="contact-container">
          <h1 className="contact-title">Get Involved</h1>
          <h2 className="contact-subtitle">Donate • Contact</h2>
          <p className="contact-intro">
            Join the conversation. We want to hear from you.<br />
            Please fill out this form and we will respond shortly.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-row">
              <div className="contact-col">
                <label htmlFor="firstName">
                  First Name<span className="contact-required">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="contact-input"
                />
              </div>
              <div className="contact-col">
                <label htmlFor="lastName">
                  Last Name<span className="contact-required">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="contact-input"
                />
              </div>
            </div>
            <label htmlFor="email">
              Email Address<span className="contact-required">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="contact-input"
            />
            <label htmlFor="subject">
              Subject<span className="contact-required">*</span>
            </label>
            <input
              required
              type="text"
              name="subject"
              id="subject"
              value={form.subject}
              onChange={handleChange}
              className="contact-input"
            />
            <label htmlFor="message">
              Message<span className="contact-required">*</span>
            </label>
            <textarea
              required
              name="message"
              id="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="contact-input"
              style={{ resize: "vertical" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="contact-btn"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {error && (
              <div className="contact-error">
                {error}
              </div>
            )}
            {submitted && (
              <div className="contact-success">
                Thank you! Your message has been sent.
              </div>
            )}
          </form>

          <div className="contact-alt">
            <div className="contact-alt-title">Other Ways to Get in Touch</div>
            <div>
              Call us at <a href="tel:3307431196">614-930-2727</a> or email us at <a href="mailto:contact@ardhaiti.com">contact@ardhaiti.com</a>.
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .contact-container {
          max-width: 560px;
          margin: 0 auto;
          padding: 48px 8px 40px 8px;
          color: #145a7e;
        }
        .contact-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .contact-subtitle {
          font-size: 1.35rem;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .contact-intro {
          margin: 10px 0 18px 0;
          color: #11466a;
          font-size: 1.08rem;
        }
        .contact-form {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 18px #145a7e16;
          padding: 24px 22px;
          margin-bottom: 24px;
        }
        .contact-row {
          display: flex;
          gap: 12px;
        }
        .contact-col {
          flex: 1;
        }
        label {
          font-weight: 600;
          display: block;
          margin-bottom: 3px;
        }
        .contact-required {
          color: #e64b1d;
          margin-left: 2px;
        }
        .contact-input {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #c1d4ea;
          margin-bottom: 16px;
          margin-top: 3px;
        }
        .contact-btn {
          width: 100%;
          background: #145a7e;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          padding: 12px 0;
          font-size: 1.1rem;
          margin-top: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .contact-btn[disabled] {
          background: #e3e3e3 !important;
          color: #aaa !important;
          cursor: not-allowed;
        }
        .contact-error {
          margin-top: 14px;
          color: #d32f2f;
          font-weight: 600;
        }
        .contact-success {
          margin-top: 15px;
          color: #118c47;
          font-weight: 600;
        }
        .contact-alt {
          background: #e8f2fa;
          border-radius: 12px;
          padding: 14px 18px;
        }
        .contact-alt-title {
          font-weight: 600;
          font-size: 1.12rem;
          margin-bottom: 6px;
        }
        .contact-alt a {
          color: #145a7e;
          text-decoration: underline;
        }

        /* RESPONSIVE ADAPTATIONS */
        @media (max-width: 700px) {
          .contact-container { max-width: 99vw; padding: 22px 2vw 20px 2vw; }
          .contact-title { font-size: 1.3rem; }
          .contact-row { flex-direction: column; gap: 5px; }
        }
        @media (max-width: 430px) {
          .contact-form { padding: 12px 2vw; }
          .contact-title { font-size: 1.07rem; }
        }
      `}</style>
    </>
  );
}
