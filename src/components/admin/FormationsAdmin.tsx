import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createFormation, deleteFormation, listFormations } from "@/lib/formations.functions";
import { formatFCFA } from "@/lib/format";

type PendingImage = { path: string; previewUrl: string };

export function FormationsAdmin() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const createFn = useServerFn(createFormation);
  const deleteFn = useServerFn(deleteFormation);

  const { data, isLoading } = useQuery({ queryKey: ["formations"], queryFn: () => listFormations() });

  const createMut = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      toast.success("Formation créée");
      setTitle(""); setDescription(""); setPrice(""); setImages([]);
      qc.invalidateQueries({ queryKey: ["formations"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => { toast.success("Supprimée"); qc.invalidateQueries({ queryKey: ["formations"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: PendingImage[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("formation-images").upload(path, file, { contentType: file.type });
        if (error) { toast.error(error.message); continue; }
        const { data: s } = await supabase.storage.from("formation-images").createSignedUrl(path, 3600);
        uploaded.push({ path, previewUrl: s?.signedUrl ?? "" });
      }
      setImages((p) => [...p, ...uploaded]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = async (path: string) => {
    await supabase.storage.from("formation-images").remove([path]);
    setImages((p) => p.filter((i) => i.path !== path));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(price, 10);
    if (!title.trim() || !description.trim() || Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Champs invalides"); return;
    }
    createMut.mutate({ data: { title: title.trim(), description: description.trim(), price: priceNum, imagePaths: images.map((i) => i.path) } });
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <section className="lg:col-span-3">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2"><Plus className="text-gold" /> Nouvelle formation</h2>
        <form onSubmit={onSubmit} className="space-y-5 p-6 rounded-3xl bg-surface border border-border shadow-soft">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Titre</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} required rows={6} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none resize-y" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Prix (FCFA, entier — 0 pour gratuit)</label>
            <input type="number" step="1" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Images</label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.path} className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 border border-border group">
                  {img.previewUrl && <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />}
                  <button type="button" onClick={() => removeImage(img.path)} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition"><X size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-gold flex flex-col items-center justify-center text-muted-foreground hover:text-gold transition disabled:opacity-50">
                <Upload size={20} />
                <span className="text-xs mt-1">{uploading ? "..." : "Ajouter"}</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
          </div>
          <button type="submit" disabled={createMut.isPending} className="w-full py-3.5 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50">
            {createMut.isPending ? "Création..." : "Créer la formation"}
          </button>
        </form>
      </section>

      <section className="lg:col-span-2">
        <h3 className="font-display text-xl font-bold mb-6">Formations existantes</h3>
        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground text-sm">Chargement…</p>}
          {!isLoading && !data?.length && <p className="text-muted-foreground text-sm">Aucune formation.</p>}
          {data?.map((f) => (
            <div key={f.id} className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3">
              {f.images[0] && <img src={f.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.price === 0 ? "Gratuit" : formatFCFA(f.price)}</div>
              </div>
              <button onClick={() => { if (confirm("Supprimer ?")) deleteMut.mutate(f.id); }} className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}