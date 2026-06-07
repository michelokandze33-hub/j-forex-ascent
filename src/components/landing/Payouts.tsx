import { useQuery } from "@tanstack/react-query";
import { listPayouts } from "@/lib/payouts.functions";

export function Payouts() {
  const { data, isLoading } = useQuery({
    queryKey: ["payouts"],
    queryFn: () => listPayouts(),
  });

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section id="payouts" className="pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-10">
          <div className="text-sm uppercase tracking-widest text-gold mb-3">
            Preuves de retraits
          </div>
          <h3 className="font-display text-3xl md:text-4xl font-bold">
            Payouts validés sur des Prop Firms reconnues.
          </h3>
        </div>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6">
          {(data ?? []).map((p) => (
            <figure
              key={p.id}
              className="snap-start shrink-0 w-[300px] md:w-[380px] rounded-2xl bg-surface border border-border overflow-hidden shadow-soft"
            >
              <div className="aspect-video bg-surface-2 overflow-hidden">
                <img src={p.url} alt={p.amount_label ?? "Payout"} className="w-full h-full object-cover" loading="lazy" />
              </div>
              {(p.amount_label || p.prop_firm) && (
                <figcaption className="px-4 py-3 flex items-center justify-between text-sm">
                  <span className="font-display font-bold text-gold">{p.amount_label ?? ""}</span>
                  <span className="text-xs text-muted-foreground">{p.prop_firm ?? ""}</span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}