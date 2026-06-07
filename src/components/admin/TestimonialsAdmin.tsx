import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createTestimonial, deleteTestimonial, listTestimonials } from "@/lib/testimonials.functions";

const SOURCES = ["telegram", "instagram", "trustpilot", "whatsapp", "autre"] as const;

export function TestimonialsAdmin() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [source, setSource] = useState<typeof SOURCES[number]>("telegram");
  const [uploading, setUploading] = useState(false);

  const createFn = useServerFn(createTestimonial);
  const deleteFn = useServerFn(deleteTestimonial);

  const { data } = useQuery({ queryKey: ["testimonials"], queryFn: () => listTestimonials() });

  const createMut = useMutation({
    mutationFn: createFn,
    onSuccess: () => { toast.success("Témoignage ajouté"); setAlt(""); qc.invalidateQueries({ queryKey: ["testimonials"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => { toast.success("Supprimé"); qc.invalidateQueries({ queryKey: ["testimonials"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("marketing-assets").upload(path, file, { contentType: file.type });
        if (error) { toast.error(error.message); continue; }
        await createMut.mutateAsync({ data: { image_path: path, alt: alt || null, source } });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
        <h3 className="font-display text-xl font-bold">Ajouter des témoignages (captures d'écran)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Nom de l'élève (optionnel)</label>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value as any)} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none">
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-3.5 rounded-full bg-surface-2 border border-dashed border-border hover:border-gold inline-flex items-center justify-center gap-2 disabled:opacity-50">
          <Upload size={16} /> {uploading ? "Upload..." : "Téléverser une ou plusieurs captures"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((t) => (
          <div key={t.id} className="relative group rounded-2xl overflow-hidden border border-border bg-surface">
            <div className="aspect-[3/4] bg-surface-2">
              <img src={t.url} alt={t.alt ?? ""} className="w-full h-full object-cover" />
            </div>
            <div className="px-3 py-2 text-xs flex items-center justify-between">
              <span className="truncate">{t.alt ?? "—"}</span>
              <span className="text-gold">{t.source}</span>
            </div>
            <button onClick={() => { if (confirm("Supprimer ?")) deleteMut.mutate(t.id); }} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 text-destructive">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}