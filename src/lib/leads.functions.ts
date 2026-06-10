import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leadSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  name: z.string().trim().min(1).max(100).optional().or(z.literal("")),
  source: z.literal("lead-magnet").default("lead-magnet"),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin.from as any)("leads").insert({
      email: data.email,
      name: data.name || null,
      source: data.source,
    });
    if (error) {
      console.error("[submitLead]", error);
      return { ok: false as const, error: "Impossible d'enregistrer votre email pour le moment." };
    }
    return { ok: true as const };
  });