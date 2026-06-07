import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type TradeDTO = {
  id: string;
  pair: string;
  result: string;
  rr: number | null;
  executed_at: string;
  note: string | null;
};

export type TradingStatsDTO = {
  winrate_pct: number | null;
  avg_rr: number | null;
  cumulative_gain_label: string | null;
  period_label: string | null;
};

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Accès refusé.");
}

export const listTrades = createServerFn({ method: "GET" }).handler(
  async (): Promise<TradeDTO[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("trades")
      .select("id,pair,result,rr,executed_at,note")
      .eq("published", true)
      .order("executed_at", { ascending: false })
      .limit(20);
    return (data ?? []).map((d) => ({
      id: d.id,
      pair: d.pair,
      result: d.result,
      rr: d.rr !== null ? Number(d.rr) : null,
      executed_at: d.executed_at,
      note: d.note,
    }));
  },
);

export const getTradingStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<TradingStatsDTO | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("trading_stats")
      .select("winrate_pct,avg_rr,cumulative_gain_label,period_label")
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    return {
      winrate_pct: data.winrate_pct !== null ? Number(data.winrate_pct) : null,
      avg_rr: data.avg_rr !== null ? Number(data.avg_rr) : null,
      cumulative_gain_label: data.cumulative_gain_label,
      period_label: data.period_label,
    };
  },
);

const tradeSchema = z.object({
  pair: z.string().trim().min(1).max(30),
  result: z.string().trim().min(1).max(60),
  rr: z.number().optional().nullable(),
  executed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(500).optional().nullable(),
});

export const createTrade = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => tradeSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("trades").insert({
      pair: data.pair,
      result: data.result,
      rr: data.rr ?? null,
      executed_at: data.executed_at,
      note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteTrade = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("trades").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const statsSchema = z.object({
  winrate_pct: z.number().min(0).max(100).optional().nullable(),
  avg_rr: z.number().min(0).max(100).optional().nullable(),
  cumulative_gain_label: z.string().max(60).optional().nullable(),
  period_label: z.string().max(60).optional().nullable(),
});

export const upsertTradingStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => statsSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("trading_stats")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (existing) {
      const { error } = await supabaseAdmin
        .from("trading_stats")
        .update({
          winrate_pct: data.winrate_pct ?? null,
          avg_rr: data.avg_rr ?? null,
          cumulative_gain_label: data.cumulative_gain_label ?? null,
          period_label: data.period_label ?? null,
        })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("trading_stats").insert({
        winrate_pct: data.winrate_pct ?? null,
        avg_rr: data.avg_rr ?? null,
        cumulative_gain_label: data.cumulative_gain_label ?? null,
        period_label: data.period_label ?? null,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });