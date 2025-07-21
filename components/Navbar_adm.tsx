import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Vérifie à l'initialisation si connecté
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogged(
        !!localStorage.getItem("token") && localStorage.getItem("role") === "admin"
      );
      setRole(localStorage.getItem("role"));
    }
  }, []);

  // Rafraîchit quand le localStorage change (multi-onglets)
  useEffect(() => {
    const onStorage = () => {
      setLogged(
        !!localStorage.getItem("token") && localStorage.getItem("role") === "admin"
      );
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Rafraîchit lors des changements de page (optionnel mais recommandé)
  useEffect(() => {
    const handleRouteChange = () => {
      setLogged(
        !!localStorage.getItem("token") && localStorage.getItem("role") === "admin"
      );
      setRole(localStorage.getItem("role"));
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  const isActive = (pathname: string) => router.pathname === pathname;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }
    setLogged(false);
    router.push("/login");
  };

  return (
    <nav
      style={{
        background: "#0a2339",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        height: 66,
        boxShadow: "0 4px 16px #00293b14",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Image src="/logo.png" alt="ARDH" width={44} height={44} />
        <span
          style={{
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 1,
            color: "#fff",
          }}
        >
          ARDH Admin
        </span>
        {role === "admin" && (
          <span
            style={{
              background: "#13b17c",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 8,
              padding: "2px 10px",
              fontSize: 13,
              marginLeft: 10,
            }}
          >
            Admin
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="/admin-help-requests" legacyBehavior>
          <a style={navLinkStyle(isActive("/admin-help-requests"))}>
            Aide & Demandes
          </a>
        </Link>
        <Link href="/HumanitarianProject" legacyBehavior>
          <a style={navLinkStyle(isActive("/HumanitarianProject"))}>
            Projets Humanitaires
          </a>
        </Link>
        <Link href="/contact-professionnel" legacyBehavior>
          <a style={navLinkStyle(isActive("/contact-professionnel"))}>
            Contacts Pros
          </a>
        </Link>
        <Link href="/resources" legacyBehavior>
          <a style={navLinkStyle(isActive("/resources"))}>Ressources</a>
        </Link>
      </div>
      <div>
        {logged ? (
          <button
            onClick={handleLogout}
            style={{
              background: "#e64646",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              boxShadow: "0 2px 8px #d72a2a29",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Déconnexion
          </button>
        ) : (
          <Link href="/login" legacyBehavior>
            <a
              style={{
                background: "#145a7e",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontSize: 15,
                boxShadow: "0 2px 8px #145a7e22",
              }}
            >
              Se connecter
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
}

// Style utilitaire pour liens actifs/inactifs
function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    color: active ? "#13b17c" : "#fff",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 16,
    background: active ? "#eaf7f1" : "transparent",
    borderRadius: 7,
    padding: "6px 14px",
    transition: "all .14s",
  };
}
