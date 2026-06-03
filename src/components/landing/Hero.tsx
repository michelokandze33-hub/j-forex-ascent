import { ArrowRight, Instagram, Send, TrendingUp } from "lucide-react";
import mentorImg from "@/assets/mentor.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "+2 500", label: "Élèves formés" },
  { value: "76%", label: "Winrate moyen" },
  { value: "1:3.2", label: "Risk / Reward" },
  { value: "+12", label: "Payouts prop firms" },
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/90 to-background" />
      <div className="absolute top-1/3 left-1/4 -z-10 w-[600px] h-[600px] rounded-full bg-gold/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Nouvelle promotion ouverte
          </span>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
            Devenez un trader{" "}
            <span className="text-gradient-gold">discipliné</span> et
            constamment rentable.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Une méthodologie éprouvée inspirée du SMC, de l'ICT et de la
            gestion de risque institutionnelle. Pour construire une carrière
            de trader, pas un coup de chance.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#offres"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              Rejoindre l'académie
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </a>
            <a
              href="#methode"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-surface border border-border font-semibold hover:bg-surface-2 transition"
            >
              Découvrir la méthode
            </a>
          </div>

          <div className="flex items-center gap-5 pt-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-widest">Suivez</span>
            <a href="#" aria-label="Instagram" className="hover:text-gold transition">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Telegram" className="hover:text-gold transition">
              <Send size={18} />
            </a>
            <a href="#" aria-label="TradingView" className="hover:text-gold transition">
              <TrendingUp size={18} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-display font-bold text-gold">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gold/20 blur-3xl" />
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border shadow-soft">
            <img
              src={mentorImg}
              alt="Mentor J Forex Academy"
              width={1024}
              height={1280}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-surface/80 backdrop-blur-xl border border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                Votre mentor
              </div>
              <div className="font-display text-xl font-bold mt-1">
                Jérémie — Fondateur J Forex
              </div>
              <div className="text-sm text-muted-foreground">
                7 ans de trading · Payouts prop firms vérifiés
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}