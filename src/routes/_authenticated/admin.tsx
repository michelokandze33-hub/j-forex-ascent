import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormationsAdmin } from "@/components/admin/FormationsAdmin";
import { TestimonialsAdmin } from "@/components/admin/TestimonialsAdmin";
import { PayoutsAdmin } from "@/components/admin/PayoutsAdmin";
import { TradingAdmin } from "@/components/admin/TradingAdmin";
import { LessonsAdmin } from "@/components/admin/LessonsAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";
import { checkIsAdmin } from "@/lib/users.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administration — JEFE Forex" }] }),
  beforeLoad: async () => {
    try {
      const result = await checkIsAdmin();
      if (!result.isAdmin) throw redirect({ to: "/espace-eleve" });
    } catch (err) {
      if (err && typeof err === "object" && "to" in (err as Record<string, unknown>)) throw err;
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminPage,
});

const TABS = [
  { id: "formations", label: "Formations", Component: FormationsAdmin },
  { id: "lessons", label: "Leçons", Component: LessonsAdmin },
  { id: "users", label: "Utilisateurs", Component: UsersAdmin },
  { id: "testimonials", label: "Témoignages", Component: TestimonialsAdmin },
  { id: "payouts", label: "Payouts", Component: PayoutsAdmin },
  { id: "trading", label: "Journal & Stats", Component: TradingAdmin },
] as const;

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("formations");

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

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