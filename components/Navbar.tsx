import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.jpeg" alt="ARDH Logo" className="logo" />
        <div>
          <span className="brand">ARDH</span>
          <small>Assistance for Refugees</small>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <div className="navbar-right">
        <Link href="/login" className="nav-btn">Login</Link>
        <Link href="/register" className="nav-btn">Register</Link>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
