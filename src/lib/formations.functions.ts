import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SIGN_TTL = 60 * 60 * 24 * 365 * 5;

export type FormationDTO = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
};

export const listFormations = createServerFn({ method: "GET" }).handler(
  async (): Promise<FormationDTO[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: formations, error } = await supabaseAdmin
      .from("formations")
      .select("id,title,description,price,formation_images(url,sort_order)")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[listFormations]", error);
      return [];
    }
    const rows = (formations ?? []) as Array<{
      id: string;
      title: string;
      description: string;
      price: number | string;
      formation_images: { url: string; sort_order: number }[];
    }>;

    const paths = Array.from(
      new Set(rows.flatMap((r) => r.formation_images.map((i) => i.url))),
    );
    const signedMap = new Map<string, string>();
    if (paths.length) {
      const { data: signed } = await supabaseAdmin.storage
        .from("formation-images")
        .createSignedUrls(paths, SIGN_TTL);
      (signed ?? []).forEach((s) => {
        if (s.path && s.signedUrl) signedMap.set(s.path, s.signedUrl);
      });
    }

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      price: Number(r.price),
      images: r.formation_images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => signedMap.get(i.url) ?? i.url),
    }));
  },
);

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  price: z.number().min(0).max(1_000_000),
  imagePaths: z.array(z.string().min(1).max(500)).max(20).default([]),
});

export const createFormation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Accès refusé : droits administrateur requis.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: f, error } = await supabaseAdmin
      .from("formations")
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
      })
      .select("id")
      .single();
    if (error || !f) throw new Error(error?.message ?? "Erreur création");

    if (data.imagePaths.length) {
      const rows = data.imagePaths.map((url, i) => ({
        formation_id: (f as { id: string }).id,
        url,
        sort_order: i,
      }));
      const { error: imgErr } = await supabaseAdmin
        .from("formation_images")
        .insert(rows);
      if (imgErr) throw new Error(imgErr.message);
    }
    return { ok: true as const, id: (f as { id: string }).id };
  });

export const deleteFormation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Accès refusé.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("formations")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });