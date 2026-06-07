import { useQuery } from "@tanstack/react-query";
import { Check, Sparkles } from "lucide-react";
import { listFormations } from "@/lib/formations.functions";
import { formatFCFA } from "@/lib/format";

export function Formations() {
  const { data, isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: () => listFormations(),
  });

  return (
    <section id="formations" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Nos formations
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Investissez dans votre éducation, pas dans l'espoir.
          </h2>
        </div>

        {isLoading && (
          <div className="grid lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-surface border border-border animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <div className="text-center py-16 rounded-3xl bg-surface border border-dashed border-border">
            <Sparkles className="mx-auto text-gold mb-4" />
            <p className="text-muted-foreground">
              Les formations seront bientôt disponibles.
            </p>
          </div>
        )}

        {!isLoading && data && data.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((f) => (
              <article
                key={f.id}
                className="group rounded-3xl bg-surface border border-border shadow-soft overflow-hidden flex flex-col hover:border-gold/40 transition"
              >
                {f.images[0] && (
                  <div className="aspect-[16/10] overflow-hidden bg-surface-2">
                    <img
                      src={f.images[0]}
                      alt={f.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-xl">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-4 whitespace-pre-line flex-1">
                    {f.description}
                  </p>
                  {f.images.length > 1 && (
                    <div className="flex gap-2 mt-4">
                      {f.images.slice(1, 5).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold text-gold">
                      {f.price === 0 ? "Gratuit" : formatFCFA(f.price)}
                    </span>
                  </div>
                  <button className="mt-6 w-full py-3.5 rounded-full gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition shadow-gold inline-flex items-center justify-center gap-2">
                    <Check size={16} /> Rejoindre
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}