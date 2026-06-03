import { Award, BadgeCheck, Briefcase, Trophy } from "lucide-react";
import mentorImg from "@/assets/mentor.jpg";

const facts = [
  { icon: Briefcase, label: "7 ans de trading actif" },
  { icon: Trophy, label: "12 payouts prop firms vérifiés" },
  { icon: Award, label: "Certifié SMC & ICT advanced" },
  { icon: BadgeCheck, label: "+2 500 élèves accompagnés" },
];

export function Mentor() {
  return (
    <section id="mentor" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gold/10 blur-3xl" />
          <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-border shadow-soft">
            <img
              src={mentorImg}
              alt="Portrait du mentor"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-7">
          <div className="text-sm uppercase tracking-widest text-gold">
            Le mentor
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Une méthode forgée sur le marché, pas en théorie.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Après plusieurs comptes brûlés et des années à chercher la bonne
            approche, Jérémie a construit un cadre simple, strict et
            reproductible. Aujourd'hui, il accompagne des centaines d'élèves
            vers la consistance — sans gourou, sans promesses.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border"
              >
                <span className="w-9 h-9 rounded-lg bg-gold-soft text-gold grid place-items-center">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}