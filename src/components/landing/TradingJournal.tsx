import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { listTrades, getTradingStats } from "@/lib/trading.functions";

function isWin(result: string) {
  return /win|\+/i.test(result) && !/loss|-/.test(result);
}

export function TradingJournal() {
  const { data: trades } = useQuery({ queryKey: ["trades"], queryFn: () => listTrades() });
  const { data: stats } = useQuery({ queryKey: ["trading-stats"], queryFn: () => getTradingStats() });

  const hasTrades = trades && trades.length > 0;
  const hasStats = stats && (stats.winrate_pct !== null || stats.avg_rr !== null || stats.cumulative_gain_label);

  if (!hasTrades && !hasStats) return null;

  return (
    <section id="journal" className="py-24 lg:py-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            Journal de trading
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Des setups exécutés, pas des promesses.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {hasTrades && (
            <div className="lg:col-span-2 rounded-3xl bg-surface border border-border shadow-soft p-6">
              <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Derniers setups
              </div>
              <ul className="divide-y divide-border">
                {trades!.map((t) => {
                  const win = isWin(t.result);
                  return (
                    <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${win ? "bg-gold/15 text-gold" : "bg-destructive/15 text-destructive"}`}>
                          {win ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{t.pair}</div>
                          <div className="text-xs text-muted-foreground">{new Date(t.executed_at).toLocaleDateString("fr-FR")}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-display font-bold ${win ? "text-gold" : "text-destructive"}`}>{t.result}</div>
                        {t.rr !== null && (
                          <div className="text-xs text-muted-foreground">RR {t.rr}</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {hasStats && (
            <div className="rounded-3xl bg-surface border border-border shadow-soft p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
                <Activity size={14} /> {stats!.period_label ?? "Performances"}
              </div>
              {stats!.winrate_pct !== null && (
                <div>
                  <div className="text-xs text-muted-foreground">Winrate</div>
                  <div className="font-display text-4xl font-bold text-gold">{stats!.winrate_pct}%</div>
                </div>
              )}
              {stats!.avg_rr !== null && (
                <div>
                  <div className="text-xs text-muted-foreground">Risk / Reward moyen</div>
                  <div className="font-display text-4xl font-bold">{stats!.avg_rr}R</div>
                </div>
              )}
              {stats!.cumulative_gain_label && (
                <div>
                  <div className="text-xs text-muted-foreground">Gains cumulés</div>
                  <div className="font-display text-3xl font-bold text-gold">{stats!.cumulative_gain_label}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}