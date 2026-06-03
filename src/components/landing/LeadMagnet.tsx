import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/leads.functions";

export function LeadMagnet() {
  const submit = useServerFn(submitLead);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await submit({
        data: { email, name, source: "lead-magnet-pdf" },
      });
      if (res.ok) {
        setState("ok");
        setMessage("Parfait ! Votre guide arrive dans votre boîte mail.");
        setEmail("");
        setName("");
      } else {
        setState("error");
        setMessage(res.error);
      }
    } catch {
      setState("error");
      setMessage("Une erreur est survenue. Réessayez dans un instant.");
    }
  }

  return (
    <section className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-surface p-8 lg:p-14 shadow-soft">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-soft text-gold text-xs font-semibold">
                <FileText size={14} />
                Guide PDF gratuit
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-5 leading-tight">
                Les 10 erreurs qui empêchent les traders d'être rentables.
              </h2>
              <p className="text-muted-foreground mt-4">
                Recevez immédiatement le guide complet par email. Sans spam,
                sans bullshit.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre prénom (optionnel)"
                maxLength={100}
                className="w-full px-5 py-3.5 rounded-xl bg-background border border-border focus:border-gold/60 focus:outline-none transition"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                maxLength={255}
                className="w-full px-5 py-3.5 rounded-xl bg-background border border-border focus:border-gold/60 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full py-3.5 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-95 disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {state === "loading" && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Recevoir le guide
              </button>
              {message && (
                <p
                  className={`text-sm pt-1 ${
                    state === "ok" ? "text-gold" : "text-destructive"
                  }`}
                >
                  {message}
                </p>
              )}
              <p className="text-xs text-muted-foreground pt-1">
                En soumettant ce formulaire, vous acceptez de recevoir nos
                emails. Désinscription en 1 clic.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}