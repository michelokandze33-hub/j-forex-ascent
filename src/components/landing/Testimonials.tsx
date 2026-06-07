import { useQuery } from "@tanstack/react-query";
import { listTestimonials } from "@/lib/testimonials.functions";

const sourceLabel: Record<string, string> = {
  telegram: "Telegram",
  instagram: "Instagram",
  trustpilot: "Trustpilot",
  whatsapp: "WhatsApp",
  autre: "Témoignage",
};

export function Testimonials() {
  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => listTestimonials(),
  });

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section id="temoignages" className="py-24 lg:py-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Preuve sociale
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Ce que disent les élèves de JEFE Forex.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Captures d'écran authentiques de retours d'élèves — non retouchées.
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 scrollbar-thin">
          {(data ?? []).map((t) => (
            <figure
              key={t.id}
              className="snap-start shrink-0 w-[280px] md:w-[340px] rounded-2xl bg-surface border border-border overflow-hidden shadow-soft"
            >
              <div className="aspect-[3/4] bg-surface-2 overflow-hidden">
                <img
                  src={t.url}
                  alt={t.alt ?? "Témoignage d'élève"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-4 py-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.alt ?? "Élève"}</span>
                <span className="px-2 py-1 rounded-full bg-gold/10 text-gold font-medium">
                  {sourceLabel[t.source] ?? t.source}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}