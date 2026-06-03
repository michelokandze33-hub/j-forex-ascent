import { AlertTriangle, Brain, Compass, Shield } from "lucide-react";

const items = [
  {
    icon: AlertTriangle,
    title: "Sur-trading compulsif",
    desc: "Multiplier les positions sans setup valide brûle votre capital plus vite que vous ne le pensez.",
  },
  {
    icon: Compass,
    title: "Absence de plan",
    desc: "Trader sans biais, sans niveaux, sans scénario : la recette parfaite pour suivre vos émotions.",
  },
  {
    icon: Shield,
    title: "Mauvaise gestion du risque",
    desc: "Sizing aléatoire, stops déplacés, doublement sur perte. Vous ne pouvez pas survivre à ça.",
  },
  {
    icon: Brain,
    title: "Manque de psychologie",
    desc: "FOMO, revenge trading, sur-confiance. Sans cadre mental, aucune méthode ne tient.",
  },
];

export function Problem() {
  return (
    <section id="probleme" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Le vrai problème
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            90% des traders échouent.{" "}
            <span className="text-muted-foreground">
              Et c'est rarement à cause du marché.
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-7 rounded-2xl bg-surface border border-border hover:border-gold/40 transition-all hover:-translate-y-1 shadow-soft"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-soft grid place-items-center text-gold mb-5 group-hover:scale-110 transition">
                <Icon size={22} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}