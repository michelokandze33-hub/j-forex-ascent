import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SIGN_TTL = 60 * 60 * 24 * 365 * 5;

export type TestimonialDTO = {
  id: string;
  url: string;
  alt: string | null;
  source: string;
};

async function signPaths(paths: string[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const map = new Map<string, string>();
  if (!paths.length) return map;
  const { data } = await supabaseAdmin.storage
    .from("marketing-assets")
    .createSignedUrls(paths, SIGN_TTL);
  (data ?? []).forEach((s) => {
    if (s.path && s.signedUrl) map.set(s.path, s.signedUrl);
  });
  return map;
}

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Accès refusé : droits administrateur requis.");
}

export const listTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<TestimonialDTO[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .select("id,image_path,alt,source,sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    const signed = await signPaths(data.map((d) => d.image_path));
    return data.map((d) => ({
      id: d.id,
      url: signed.get(d.image_path) ?? "",
      alt: d.alt,
      source: d.source,
    }));
  },
);

const createSchema = z.object({
  image_path: z.string().min(1).max(500),
  alt: z.string().max(200).optional().nullable(),
  source: z.enum(["telegram", "instagram", "trustpilot", "whatsapp", "autre"]).default("telegram"),
});

export const createTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => createSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("testimonials").insert({
      image_path: data.image_path,
      alt: data.alt ?? null,
      source: data.source,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("testimonials")
      .select("image_path")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    if (row?.image_path) {
      await supabaseAdmin.storage.from("marketing-assets").remove([row.image_path]);
    }
    return { ok: true as const };
  });