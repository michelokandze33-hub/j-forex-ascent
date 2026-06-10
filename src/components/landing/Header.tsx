import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, GraduationCap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { href: "#probleme", label: "Le problème" },
  { href: "#mentor", label: "Mentor" },
  { href: "#methode", label: "Méthode" },
  { href: "#formations", label: "Formations" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-gold/15 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-xl gradient-gold grid place-items-center text-primary-foreground font-bold shadow-gold">
            J
          </span>
          <span className="font-display font-bold tracking-tight">
            JEFE <span className="text-gold">Forex</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface border border-border text-sm font-medium hover:bg-surface-2 transition"
            >
              <LayoutDashboard size={14} /> Admin
            </Link>
          )}
          {user && (
            <Link
              to="/espace-eleve"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface border border-border text-sm font-medium hover:bg-surface-2 transition"
            >
              <GraduationCap size={14} /> Espace élève
            </Link>
          )}
          {!user && (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Connexion
            </Link>
          )}
          <a
            href="#formations"
            className="px-5 py-2 rounded-full gradient-gold text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-gold"
          >
            Rejoindre
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-6 py-6 flex flex-col gap-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                Admin
              </Link>
            )}
            {user && (
              <Link to="/espace-eleve" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                Espace élève
              </Link>
            )}
            {!user && (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                Connexion
              </Link>
            )}
            <a
              href="#formations"
              onClick={() => setOpen(false)}
              className="mt-2 px-5 py-3 rounded-full gradient-gold text-primary-foreground text-center font-semibold"
            >
              Rejoindre
            </a>
          </div>
        </div>
      )}
    </header>
  );
}