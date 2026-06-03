const steps = [
  { n: "01", title: "Fondamentaux", desc: "Comprendre le marché, les paires, la liquidité, la mécanique des sessions." },
  { n: "02", title: "Structure de marché", desc: "Lire l'intention du prix : BOS, CHoCH, ranges et tendances." },
  { n: "03", title: "Smart Money Concepts", desc: "Order blocks, FVG, liquidity grabs, mitigations." },
  { n: "04", title: "Approche ICT", desc: "Killzones, kill levels, modèles d'entrée institutionnels." },
  { n: "05", title: "Backtesting", desc: "Méthodologie de backtest, journal, statistiques de votre edge." },
  { n: "06", title: "Psychologie", desc: "Routines, gestion émotionnelle, plans de session." },
  { n: "07", title: "Gestion du risque", desc: "Sizing, drawdown, money management institutionnel." },
];

export function Method() {
  return (
    <section id="methode" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            La méthode J Forex
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            7 piliers. Un seul cadre cohérent.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${
                  i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div
                  className={`pl-16 md:pl-0 ${
                    i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="text-gold font-display font-bold text-3xl">
                    {s.n}
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-2">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="hidden md:block" />
                <span className="absolute left-6 md:left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full gradient-gold ring-4 ring-background" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}