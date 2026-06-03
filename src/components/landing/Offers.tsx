import { Check, Sparkles } from "lucide-react";

const offers = [
  {
    name: "Starter",
    price: "297€",
    desc: "Pour poser des bases solides.",
    features: [
      "Fondamentaux + structure de marché",
      "Accès aux modules d'introduction",
      "Communauté Discord",
      "Mises à jour à vie",
    ],
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Coaching Premium à vie",
    price: "1 497€",
    desc: "L'accompagnement complet avec mentorat direct.",
    features: [
      "Tous les modules — accès illimité à vie",
      "Coaching live hebdomadaire",
      "Revue de trades personnalisée",
      "Accès prioritaire au mentor",
      "Templates, watchlists, journal pro",
      "Garantie satisfait ou remboursé 14 jours",
    ],
    cta: "Rejoindre Premium",
    highlight: true,
  },
  {
    name: "Pro",
    price: "697€",
    desc: "Pour passer à l'exécution sérieuse.",
    features: [
      "Tous les modules SMC + ICT",
      "Backtesting et journal de trading",
      "Gestion de risque institutionnelle",
      "Communauté Discord",
    ],
    cta: "Choisir Pro",
    highlight: false,
  },
];

export function Offers() {
  return (
    <section id="offres" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Nos offres
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Investissez dans votre éducation, pas dans l'espoir.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:items-stretch">
          {offers.map((o) => (
            <div
              key={o.name}
              className={`relative p-8 rounded-3xl border flex flex-col ${
                o.highlight
                  ? "bg-surface border-gold/50 shadow-gold lg:scale-105 lg:-my-2"
                  : "bg-surface border-border shadow-soft"
              }`}
            >
              {o.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-gold text-primary-foreground text-xs font-bold flex items-center gap-1.5">
                  <Sparkles size={12} />
                  Le plus populaire
                </div>
              )}
              <div className="font-display font-bold text-lg">{o.name}</div>
              <p className="text-sm text-muted-foreground mt-1">{o.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{o.price}</span>
                <span className="text-muted-foreground text-sm">à vie</span>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {o.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <Check size={18} className="text-gold shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-3.5 rounded-full font-semibold transition ${
                  o.highlight
                    ? "gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
                    : "bg-surface-2 border border-border hover:bg-surface-2/70"
                }`}
              >
                {o.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}