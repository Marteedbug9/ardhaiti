import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="about-bg" style={{ minHeight: "100vh", background: "#1a6d99" }}>
        <div className="about-content glass">
          {/* LOGO */}
          <div className="about-logo">
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
          <h1 className="about-title">
            About ARDH
          </h1>
          <p className="about-desc">
            As a founding member of <b>ARDH (Assistance for Refugees and Displaced Haitians)</b>, I am dedicated to supporting refugees and displaced persons throughout their journey of integration, training, and rebuilding their lives.
            <br /><br />
            We believe that every individual deserves the tools to move forward. That’s why we provide training, connections, and personalized support to those who want to build a future, no matter the obstacles.
          </p>
          <hr className="about-hr" />
          <h2 className="about-contact-title">Contact & Location</h2>
          <ul className="about-list">
            <li>
              <b>Phone:</b> <a href="tel:+16149302727">+1 (614) 930-2727</a>
            </li>
            <li>
              <b>Email:</b> <a href="mailto:contact@ardhaiti.com">contact@ardhaiti.com</a>
            </li>
            <li>
              <b>Location:</b> 4285 Morse Rd, 1st Floor, Columbus, OH 43230
            </li>
          </ul>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .about-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 48px 18px 36px 18px;
          color: #fff;
          background: rgba(36,109,161,0.22);
          border-radius: 20px;
          box-shadow: 0 4px 18px #165b8312;
          backdrop-filter: blur(10px);
        }
        .about-logo {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }
        .about-title {
          font-size: 2.15rem;
          font-weight: 700;
          margin-bottom: 18px;
          text-align: center;
        }
        .about-desc {
          font-size: 1.15rem;
          margin-bottom: 30px;
        }
        .about-hr {
          border: none;
          border-top: 1.5px solid #e0ecfa33;
          margin: 30px 0 18px 0;
        }
        .about-contact-title {
          font-size: 1.23rem;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .about-list {
          list-style: none;
          padding: 0;
          line-height: 2;
          font-size: 1.09rem;
          margin-bottom: 18px;
          color: #f8fbff;
        }
        .about-list a {
          color: #fff;
          text-decoration: underline;
          word-break: break-all;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .about-content {
            max-width: 98vw;
            padding: 24px 6vw 22px 6vw;
            border-radius: 16px;
          }
        }
        @media (max-width: 600px) {
          .about-content {
            max-width: 100vw;
            padding: 14px 2vw 12px 2vw;
            border-radius: 10px;
          }
          .about-title {
            font-size: 1.22rem;
            margin-bottom: 12px;
          }
          .about-desc, .about-list {
            font-size: 0.97rem;
          }
          .about-logo img {
            width: 62px !important;
            height: 62px !important;
          }
        }
      `}</style>
    </>
  );
}
