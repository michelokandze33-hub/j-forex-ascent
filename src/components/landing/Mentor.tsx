import mentorAsset from "@/assets/mentor.png.asset.json";

export function Mentor() {
  return (
    <section id="mentor" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gold/10 blur-3xl" />
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border shadow-soft bg-surface-2">
            <img
              src={mentorAsset.url}
              alt="Portrait du mentor"
              loading="lazy"
              width={1024}
              height={1280}
              className="w-full h-full object-cover object-top"
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
        </div>
      </div>
    </section>
  );
}