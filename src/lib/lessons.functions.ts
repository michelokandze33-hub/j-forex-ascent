import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LessonDTO = {
  id: string;
  title: string;
  description: string;
  bunny_video_id: string;
  module: string;
  sort_order: number;
  access: "free" | "paid";
  duration_seconds: number | null;
  published: boolean;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Accès refusé : droits administrateur requis.");
}

export const listLessons = createServerFn({ method: "GET" }).handler(
  async (): Promise<LessonDTO[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("lessons" as any)
      .select("id,title,description,bunny_video_id,module,sort_order,access,duration_seconds,published")
      .order("module", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[listLessons]", error);
      return [];
    }
    return (data ?? []) as LessonDTO[];
  },
);

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).default(""),
  bunny_video_id: z.string().trim().min(1).max(200),
  module: z.string().trim().max(200).default(""),
  sort_order: z.number().int().min(0).max(10_000).default(0),
  access: z.enum(["free", "paid"]).default("paid"),
  duration_seconds: z.number().int().min(0).max(86_400).nullable().default(null),
  published: z.boolean().default(true),
});

export const upsertLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("lessons" as any).update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true as const, id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("lessons" as any)
      .insert(rest)
      .select("id")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Erreur création");
    return { ok: true as const, id: (row as { id: string }).id };
  });

export const deleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("lessons" as any).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });