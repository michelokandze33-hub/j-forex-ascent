import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createTrade, deleteTrade, getTradingStats, listTrades, upsertTradingStats } from "@/lib/trading.functions";

export function TradingAdmin() {
  const qc = useQueryClient();
  const createFn = useServerFn(createTrade);
  const deleteFn = useServerFn(deleteTrade);
  const upsertStatsFn = useServerFn(upsertTradingStats);

  const { data: trades } = useQuery({ queryKey: ["trades"], queryFn: () => listTrades() });
  const { data: stats } = useQuery({ queryKey: ["trading-stats"], queryFn: () => getTradingStats() });

  const [pair, setPair] = useState("");
  const [result, setResult] = useState("");
  const [rr, setRr] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [winrate, setWinrate] = useState("");
  const [avgRr, setAvgRr] = useState("");
  const [gain, setGain] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    if (stats) {
      setWinrate(stats.winrate_pct?.toString() ?? "");
      setAvgRr(stats.avg_rr?.toString() ?? "");
      setGain(stats.cumulative_gain_label ?? "");
      setPeriod(stats.period_label ?? "");
    }
  }, [stats]);

  const createMut = useMutation({
    mutationFn: createFn,
    onSuccess: () => { toast.success("Trade ajouté"); setPair(""); setResult(""); setRr(""); qc.invalidateQueries({ queryKey: ["trades"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trades"] }),
  });
  const statsMut = useMutation({
    mutationFn: upsertStatsFn,
    onSuccess: () => { toast.success("Statistiques enregistrées"); qc.invalidateQueries({ queryKey: ["trading-stats"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const submitTrade = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate({ data: { pair: pair.trim(), result: result.trim(), rr: rr ? Number(rr) : null, executed_at: date, note: null } });
  };

  const submitStats = (e: React.FormEvent) => {
    e.preventDefault();
    statsMut.mutate({ data: { winrate_pct: winrate ? Number(winrate) : null, avg_rr: avgRr ? Number(avgRr) : null, cumulative_gain_label: gain || null, period_label: period || null } });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={submitTrade} className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <h3 className="font-display text-xl font-bold">Ajouter un trade</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Paire (EURUSD)" value={pair} onChange={(e) => setPair(e.target.value)} required maxLength={30} className="px-4 py-3 rounded-xl bg-surface-2 border border-border" />
            <input placeholder="Résultat (WIN +4R)" value={result} onChange={(e) => setResult(e.target.value)} required maxLength={60} className="px-4 py-3 rounded-xl bg-surface-2 border border-border" />
            <input type="number" step="0.1" placeholder="RR (4)" value={rr} onChange={(e) => setRr(e.target.value)} className="px-4 py-3 rounded-xl bg-surface-2 border border-border" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-3 rounded-xl bg-surface-2 border border-border" />
          </div>
          <button type="submit" disabled={createMut.isPending} className="w-full py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50">Ajouter</button>
        </form>

        <div className="p-4 rounded-3xl bg-surface border border-border">
          <h4 className="font-semibold mb-3">Derniers trades</h4>
          <ul className="divide-y divide-border">
            {(trades ?? []).map((t) => (
              <li key={t.id} className="py-2 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-semibold">{t.pair} <span className="text-gold">{t.result}</span></div>
                  <div className="text-xs text-muted-foreground">{new Date(t.executed_at).toLocaleDateString("fr-FR")} {t.rr ? `· RR ${t.rr}` : ""}</div>
                </div>
                <button onClick={() => deleteMut.mutate(t.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={submitStats} className="p-6 rounded-3xl bg-surface border border-border space-y-4 h-fit">
        <h3 className="font-display text-xl font-bold">Statistiques globales</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Winrate (%)</label>
            <input type="number" step="0.1" min="0" max="100" value={winrate} onChange={(e) => setWinrate(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">RR moyen</label>
            <input type="number" step="0.1" min="0" value={avgRr} onChange={(e) => setAvgRr(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border" />
          </div>
          <div className="col-span-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Gains cumulés (libellé)</label>
            <input value={gain} onChange={(e) => setGain(e.target.value)} maxLength={60} placeholder="+27,4% sur 3 mois" className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border" />
          </div>
          <div className="col-span-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Période affichée</label>
            <input value={period} onChange={(e) => setPeriod(e.target.value)} maxLength={60} placeholder="3 derniers mois" className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border" />
          </div>
        </div>
        <button type="submit" disabled={statsMut.isPending} className="w-full py-3 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50">Enregistrer</button>
      </form>
    </div>
  );
}