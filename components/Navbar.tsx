import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const router = useRouter();
  const [logged, setLogged] = useState(false);

  // Vérifie la connexion au chargement (token, userId, ou role)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogged(
        !!localStorage.getItem("token") ||
        !!localStorage.getItem("userId") ||
        !!localStorage.getItem("role")
      );
    }
  }, []);

  // Pour rafraîchir le navbar après login/logout
  useEffect(() => {
    const onStorage = () => {
      setLogged(
        !!localStorage.getItem("token") ||
        !!localStorage.getItem("userId") ||
        !!localStorage.getItem("role")
      );
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Fonction utilitaire pour appliquer "active" sur le bon lien
  const isActive = (pathname: string) => router.pathname === pathname;

  // Déconnexion complète
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }
    setLogged(false);
    router.push("/"); // Redirige vers l'accueil
  };

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
        <Link href="/#services" scroll={false} legacyBehavior>
          <a className={isActive("/services") ? "active" : ""}>Services</a>
        </Link>
        <Link href="/contact" legacyBehavior>
          <a className={isActive("/contact") ? "active" : ""}>Contact</a>
        </Link>
        {/* Lien REQUEST visible seulement connecté */}
        {logged && (
          <Link href="/help-request" legacyBehavior>
            <a className={isActive("/help-request") ? "active" : ""}>Request</a>
          </Link>
        )}
      </div>
      <div className="navbar-right">
        {/* Si connecté, afficher Log out */}
        {logged ? (
          <button
            onClick={handleLogout}
            className="nav-btn"
            style={{ background: "#e64646", color: "#fff" }}
          >
            Log out
          </button>
        ) : (
          // Si pas connecté, afficher Login/Register
          <>
            <Link href="/login" legacyBehavior>
              <a className="nav-btn">Login</a>
            </Link>
            <Link href="/register" legacyBehavior>
              <a className="nav-btn">Register</a>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
