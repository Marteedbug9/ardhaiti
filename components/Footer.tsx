export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <img src="/logo.jpeg" alt="ARDH Logo" className="footer-logo" />
          <div>
            <strong>ARDH</strong><br />
            Assistance for Refugees
          </div>
          <p>
            We are dedicated to supporting Haitian refugees by providing full assistance for integration and success.
          </p>
        </div>
        <div>
          <strong>Quick Links</strong>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <strong>Services</strong>
          <ul>
            <li>Legal Assistance</li>
            <li>Rent Support</li>
            <li>Food Assistance</li>
            <li>Education</li>
            <li>Job Placement</li>
            <li>Cultural Orientation</li>
          </ul>
        </div>
        <div>
          <strong>Contact</strong>
          <ul>
            <li>+1 (555) 123-4567</li>
            <li>contact@ardh.com</li>
            <li>4285 Morse Rd,1st Floor,Columbus,OH 43230</li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        © 2025 ARDH - Assistance for Refugees and Displaced Haitians. All rights reserved.
      </div>
    </footer>
  );
}
