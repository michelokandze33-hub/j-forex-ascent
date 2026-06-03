import { Check, X } from "lucide-react";

const forYou = [
  "Vous voulez bâtir une carrière de trader sérieuse",
  "Vous êtes prêt à travailler avec discipline et constance",
  "Vous cherchez un cadre, pas des signaux",
  "Vous acceptez que le trading prenne du temps",
];

const notForYou = [
  "Vous cherchez à devenir riche en 30 jours",
  "Vous refusez de tenir un journal de trading",
  "Vous voulez copier des trades sans comprendre",
  "Vous n'êtes pas prêt à respecter un plan",
];

export function Qualification() {
  return (
    <section className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Qualification
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Cette formation est-elle faite pour vous ?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-surface border border-gold/30 shadow-soft">
            <div className="text-gold font-display font-bold text-xl mb-6">
              Pour vous si...
            </div>
            <ul className="space-y-4">
              {forYou.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-gold-soft text-gold grid place-items-center shrink-0">
                    <Check size={14} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="text-muted-foreground font-display font-bold text-xl mb-6">
              Pas pour vous si...
            </div>
            <ul className="space-y-4 text-muted-foreground">
              {notForYou.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-destructive/10 text-destructive grid place-items-center shrink-0">
                    <X size={14} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}