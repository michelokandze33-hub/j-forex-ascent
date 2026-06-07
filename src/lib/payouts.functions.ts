import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SIGN_TTL = 60 * 60 * 24 * 365 * 5;

export type PayoutDTO = {
  id: string;
  url: string;
  amount_label: string | null;
  prop_firm: string | null;
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

export const listPayouts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PayoutDTO[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select("id,image_path,amount_label,prop_firm,sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    const paths = data.map((d) => d.image_path);
    const signedMap = new Map<string, string>();
    if (paths.length) {
      const { data: signed } = await supabaseAdmin.storage
        .from("marketing-assets")
        .createSignedUrls(paths, SIGN_TTL);
      (signed ?? []).forEach((s) => {
        if (s.path && s.signedUrl) signedMap.set(s.path, s.signedUrl);
      });
    }
    return data.map((d) => ({
      id: d.id,
      url: signedMap.get(d.image_path) ?? "",
      amount_label: d.amount_label,
      prop_firm: d.prop_firm,
    }));
  },
);

const createSchema = z.object({
  image_path: z.string().min(1).max(500),
  amount_label: z.string().max(60).optional().nullable(),
  prop_firm: z.string().max(60).optional().nullable(),
});

export const createPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => createSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payouts").insert({
      image_path: data.image_path,
      amount_label: data.amount_label ?? null,
      prop_firm: data.prop_firm ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deletePayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("payouts")
      .select("image_path")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await supabaseAdmin.from("payouts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    if (row?.image_path) {
      await supabaseAdmin.storage.from("marketing-assets").remove([row.image_path]);
    }
    return { ok: true as const };
  });