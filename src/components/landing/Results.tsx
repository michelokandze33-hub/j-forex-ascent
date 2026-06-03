import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Karim B.",
    role: "Élève — 8 mois",
    text: "Première fois que j'ai un vrai cadre d'exécution. J'ai validé mon premier payout 10k FTMO en 4 mois.",
    pnl: "+18.4%",
  },
  {
    name: "Aïcha S.",
    role: "Élève — 1 an",
    text: "J'ai arrêté le sur-trading dès le premier mois. La psychologie du programme a tout changé.",
    pnl: "+24.1%",
  },
  {
    name: "Yann M.",
    role: "Élève — 6 mois",
    text: "Le coaching live vaut largement le prix. Réponses claires, méthode carrée, communauté solide.",
    pnl: "+11.7%",
  },
];

export function Results() {
  return (
    <section id="resultats" className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Résultats des élèves
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Des progressions réelles, pas des promesses.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-7 rounded-2xl bg-surface border border-border shadow-soft flex flex-col"
            >
              <Quote className="text-gold mb-4" size={28} />
              <p className="text-foreground/90 leading-relaxed flex-1">
                {t.text}
              </p>
              <div className="flex items-center gap-1 mt-5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-gold-soft text-gold text-sm font-semibold">
                  {t.pnl}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Telegram",
            "Instagram",
            "Discord",
            "WhatsApp",
          ].map((label) => (
            <div
              key={label}
              className="aspect-[4/3] rounded-2xl bg-surface border border-dashed border-border grid place-items-center text-muted-foreground text-sm"
            >
              Screenshot {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}