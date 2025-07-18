import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Language selector under navbar */}
      <div style={{ marginTop: "16px", textAlign: "right", marginRight: "40px" }}>
        <LanguageSwitcher />
      </div>

      <main className="hero-bg">
        <div className="hero-content">
          <h1>ARDH: Assistance for Refugees and Displaced Haitians</h1>
          <p>
            We are dedicated to supporting Haitian refugees and displaced individuals by providing:
          </p>
          <ul style={{
            textAlign: "left",
            display: "inline-block",
            margin: "30px auto 10px auto",
            fontSize: "1.17rem",
            color: "#fff",
            lineHeight: 1.7,
            fontWeight: 500,
            background: "rgba(36, 109, 161, 0.18)",
            borderRadius: "14px",
            padding: "16px 32px",
            boxShadow: "0 8px 24px #0002"
          }}>
           
          </ul>
          <div style={{ marginTop: 24 }}>
            <i style={{ fontWeight: 600, fontSize: "1.07rem", color: "#fff" }}>
              Our goal is to foster independence, dignity, and hope for every Haitian refugee we serve.
            </i>
          </div>
          <div className="hero-buttons">
            <a href="#" className="hero-btn hero-btn-primary">Donate Now</a>
            <a href="#" className="hero-btn hero-btn-outline">Become a Volunteer</a>
          </div>
        </div>
      </main>

      <section className="services">
        <h2>Details of Our Services</h2>
        <div className="service-cards">
          <div className="card">
            <div className="card-icon">⚖️</div>
            <h3>Legal Assistance</h3>
            <ul>
              <li>Know-Your-Rights workshops and info sessions</li>
              <li>Connection with trusted legal agencies</li>
              <li>Help with legal fees if needed</li>
              <li>Immigration paperwork & documentation</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-icon">🏠</div>
            <h3>Rent Support</h3>
            <ul>
              <li>Emergency rental support</li>
              <li>Connection to affordable housing</li>
              <li>Tenants’ rights education</li>
              <li>Support to prevent homelessness</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-icon">🥗</div>
            <h3>Food Assistance</h3>
            <ul>
              <li>Food packages for families in need</li>
              <li>Coordination with local food banks</li>
              <li>Regular access to groceries</li>
              <li>Nutrition workshops</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-icon">📚</div>
            <h3>Education & English Classes</h3>
            <ul>
              <li>Beginner to advanced ESL classes</li>
              <li>School enrollment support for children</li>
              <li>Tutoring and academic catch-up</li>
              <li>Digital literacy workshops</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-icon">💼</div>
            <h3>Job Placement Services</h3>
            <ul>
              <li>Job readiness workshops</li>
              <li>Résumé writing & interview prep</li>
              <li>Direct referrals to employers</li>
              <li>Partnerships with local businesses</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-icon">🌍</div>
            <h3>Cultural Orientation</h3>
            <ul>
              <li>Public transportation, laws, healthcare</li>
              <li>Financial literacy and U.S. culture</li>
              <li>Integration workshops</li>
              <li>Support for navigating daily life</li>
            </ul>
          </div>
          <div className="card">
            <div className="card-icon">✈️</div>
            <h3>Support for Returning to Haiti</h3>
            <ul>
              <li>Information about voluntary return programs</li>
              <li>Travel coordination & financial support if eligible</li>
              <li>Assistance with paperwork and reintegration</li>
              <li>Connection with partners in Haiti for resettlement</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="impact">
        <h2>Our Impact</h2>
        <p>
          Our core values guide our mission to assist Haitian refugees and make a lasting difference in their lives.
        </p>
        <div className="impact-cards">
          <div className="impact-card">
            <div className="impact-icon">👥</div>
            <h4>Putting People First</h4>
            <p>We place the needs of refugees at the heart of everything, providing personalized and compassionate support.</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">💙</div>
            <h4>Investing in Community</h4>
            <p>We invest in local actions that create lasting impact and strengthen community bonds.</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">💲</div>
            <h4>Experience You Can Trust</h4>
            <p>Our commitment to transparency and excellence lets us earn the trust of our community.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
