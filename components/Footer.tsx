import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <Image src="/icon.png" alt="ARDH Logo" width={80} height={80} className="footer-logo" />
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
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/contact">Contact</Link></li>
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
            <li>+1 (614) 930-2727</li>
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
