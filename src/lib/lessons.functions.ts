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

export const listLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LessonDTO[]> => {
    await assertAdmin(context);
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
    return (data ?? []) as unknown as LessonDTO[];
  });

export const listStudentLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LessonDTO[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("lessons" as any)
      .select("id,title,description,bunny_video_id,module,sort_order,access,duration_seconds,published")
      .eq("published", true)
      .order("module", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[listStudentLessons]", error);
      return [];
    }
    const rows = (data ?? []) as unknown as LessonDTO[];
    // Authorization: only admins (and, later, paying members) receive the
    // bunny_video_id for paid lessons. Free lessons keep their video id.
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleRow;
    return rows.map((l) =>
      l.access === "paid" && !isAdmin ? { ...l, bunny_video_id: "" } : l,
    );
  });

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
    return { ok: true as const, id: (row as unknown as { id: string }).id };
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

const bulkSchema = z.object({
  module: z.string().trim().max(200).default(""),
  access: z.enum(["free", "paid"]).default("paid"),
  published: z.boolean().default(true),
  start_sort_order: z.number().int().min(0).max(10_000).default(0),
  items: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(200),
        bunny_video_id: z.string().trim().min(1).max(200),
        description: z.string().trim().max(5000).default(""),
        duration_seconds: z.number().int().min(0).max(86_400).nullable().default(null),
      }),
    )
    .min(1)
    .max(500),
});

export const bulkInsertLessons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => bulkSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = data.items.map((it, i) => ({
      title: it.title,
      bunny_video_id: it.bunny_video_id,
      description: it.description,
      duration_seconds: it.duration_seconds,
      module: data.module,
      access: data.access,
      published: data.published,
      sort_order: data.start_sort_order + i,
    }));
    const { error, count } = await supabaseAdmin
      .from("lessons" as any)
      .insert(rows, { count: "exact" });
    if (error) throw new Error(error.message);
    return { ok: true as const, inserted: count ?? rows.length };
  });

const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sort_order: z.number().int().min(0).max(10_000),
        module: z.string().trim().max(200),
      }),
    )
    .min(1)
    .max(500),
});

export const reorderLessons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => reorderSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const it of data.items) {
      const { error } = await supabaseAdmin
        .from("lessons" as any)
        .update({ sort_order: it.sort_order, module: it.module })
        .eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });