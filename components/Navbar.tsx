import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router"; // Ajoute ceci
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const router = useRouter();

  // Fonction utilitaire pour appliquer "active" sur le bon lien
  const isActive = (pathname: string) => router.pathname === pathname;


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Image src="/logo.png" alt="ARDH Logo" width={48} height={48} className="logo" />
        <div>
          <span className="brand">ARDH</span>
          <small>Assistance for Refugees</small>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/" legacyBehavior>
          <a className={isActive("/") ? "active" : ""}>Home</a>
        </Link>
        <Link href="/about" legacyBehavior>
          <a className={isActive("/about") ? "active" : ""}>About</a>
        </Link>
        <Link href="/services" legacyBehavior>
          <a className={isActive("/services") ? "active" : ""}>Services</a>
        </Link>
        <Link href="/contact" legacyBehavior>
          <a className={isActive("/contact") ? "active" : ""}>Contact</a>
        </Link>
      </div>
      <div className="navbar-right">
        <Link href="/login" legacyBehavior>
          <a className="nav-btn">Login</a>
        </Link>
        <Link href="/register" legacyBehavior>
          <a className="nav-btn">Register</a>
        </Link>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
