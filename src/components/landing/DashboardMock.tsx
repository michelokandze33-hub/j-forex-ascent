import { Activity, ArrowDownRight, ArrowUpRight, Target } from "lucide-react";

const kpis = [
  { label: "Winrate", value: "76%", trend: "+4.2%", up: true, icon: Target },
  { label: "Risk / Reward", value: "1:3.2", trend: "+0.4", up: true, icon: Activity },
  { label: "Trades gagnants", value: "184", trend: "+22", up: true, icon: ArrowUpRight },
  { label: "Trades perdants", value: "57", trend: "-6", up: false, icon: ArrowDownRight },
];

const bars = [40, 65, 50, 80, 70, 90, 60, 95, 75, 110, 85, 120];

export function DashboardMock() {
  const max = Math.max(...bars);
  return (
    <section className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Transparence
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Le dashboard de performance.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Journal de trading public, à jour, sans filtre.
          </p>
        </div>

        <div className="rounded-3xl bg-surface border border-border shadow-soft p-6 lg:p-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map(({ label, value, trend, up, icon: Icon }) => (
              <div
                key={label}
                className="p-5 rounded-2xl bg-surface-2 border border-border"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs uppercase tracking-widest">
                    {label}
                  </span>
                  <Icon size={16} className={up ? "text-gold" : "text-destructive"} />
                </div>
                <div className="mt-3 font-display text-3xl font-bold">
                  {value}
                </div>
                <div
                  className={`text-xs mt-1 ${up ? "text-gold" : "text-destructive"}`}
                >
                  {trend} ce mois
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-surface-2 border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Performance mensuelle
                </div>
                <div className="font-display text-xl font-bold mt-1">
                  +42.8% YTD
                </div>
              </div>
              <div className="flex gap-2">
                {["1M", "3M", "6M", "YTD"].map((p, i) => (
                  <button
                    key={p}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      i === 3
                        ? "bg-gold text-primary-foreground"
                        : "bg-surface text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {bars.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md gradient-gold opacity-90 hover:opacity-100 transition"
                  style={{ height: `${(v / max) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}