import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormationsAdmin } from "@/components/admin/FormationsAdmin";
import { TestimonialsAdmin } from "@/components/admin/TestimonialsAdmin";
import { PayoutsAdmin } from "@/components/admin/PayoutsAdmin";
import { TradingAdmin } from "@/components/admin/TradingAdmin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administration — JEFE Forex" }] }),
  component: AdminPage,
});

const TABS = [
  { id: "formations", label: "Formations", Component: FormationsAdmin },
  { id: "testimonials", label: "Témoignages", Component: TestimonialsAdmin },
  { id: "payouts", label: "Payouts", Component: PayoutsAdmin },
  { id: "trading", label: "Journal & Stats", Component: TradingAdmin },
] as const;

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("formations");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Chargement…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6 bg-background">
        <div className="max-w-md text-center p-8 rounded-3xl bg-surface border border-border">
          <h1 className="font-display text-2xl font-bold">Accès refusé</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Votre compte n'a pas les droits administrateur. Demandez à un admin
            d'ajouter votre user_id dans la table <code>user_roles</code> avec le rôle <code>admin</code>.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Link to="/" className="px-4 py-2 rounded-full bg-surface-2 border border-border text-sm">Accueil</Link>
            <button onClick={signOut} className="px-4 py-2 rounded-full bg-surface-2 border border-border text-sm">Se déconnecter</button>
          </div>
        </div>
      </div>
    );
  }

  const Active = TABS.find((t) => t.id === tab)!.Component;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/90 backdrop-blur z-40">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold">
            JEFE <span className="text-gold">Forex</span> Admin
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
        <nav className="mx-auto max-w-7xl px-6 pb-3 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                tab === t.id
                  ? "bg-gold text-primary-foreground shadow-gold"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Active />
      </main>
    </div>
  );
}