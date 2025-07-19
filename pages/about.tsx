import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="about-bg" style={{ minHeight: "100vh", background: "#1a6d99" }}>
        <div className="about-content glass" style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "48px 18px 36px 18px",
          color: "#fff"
        }}>
          {/* LOGO */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Image
              src="/logo.png"
              alt="ARDH Logo"
              width={96}
              height={96}
              style={{
                borderRadius: "18px",
                background: "#fff",
                objectFit: "contain",
                boxShadow: "0 2px 18px #0003"
              }}
            />
          </div>
          <h1 style={{ fontSize: "2.15rem", fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
            About ARDH
          </h1>
          <p style={{ fontSize: "1.15rem", marginBottom: 30 }}>
            As a founding member of <b>ARDH (Assistance for Refugees and Displaced Haitians)</b>, I am dedicated to supporting refugees and displaced persons throughout their journey of integration, training, and rebuilding their lives.
            <br /><br />
            We believe that every individual deserves the tools to move forward. That’s why we provide training, connections, and personalized support to those who want to build a future, no matter the obstacles.
          </p>
          <hr style={{ border: "none", borderTop: "1.5px solid #e0ecfa33", margin: "30px 0 18px" }} />

          <h2 style={{ fontSize: "1.23rem", fontWeight: 600, marginBottom: 14 }}>Contact & Location</h2>
          <ul style={{
            listStyle: "none",
            padding: 0,
            lineHeight: 2,
            fontSize: "1.09rem",
            marginBottom: 18,
            color: "#f8fbff"
          }}>
            <li>
              <b>Phone:</b> <a href="tel:+16149302727" style={{ color: "#fff", textDecoration: "underline" }}>+1 (614) 930-2727</a>
            </li>
            <li>
              <b>Email:</b> <a href="mailto:contact@ardh.com" style={{ color: "#fff", textDecoration: "underline" }}>contact@ardh.com</a>
            </li>
            <li>
              <b>Location:</b> 4285 Morse Rd, 1st Floor, Columbus, OH 43230
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
