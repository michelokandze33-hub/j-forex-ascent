import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Plus, Pencil, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { listLessons, upsertLesson, deleteLesson, type LessonDTO } from "@/lib/lessons.functions";

type FormState = {
  id?: string;
  title: string;
  description: string;
  bunny_video_id: string;
  module: string;
  sort_order: number;
  access: "free" | "paid";
  duration_seconds: number | null;
  published: boolean;
};

const EMPTY: FormState = {
  title: "",
  description: "",
  bunny_video_id: "",
  module: "",
  sort_order: 0,
  access: "paid",
  duration_seconds: null,
  published: true,
};

const LIB_KEY = "jefe.bunny.libraryId";

export function LessonsAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [libraryId, setLibraryId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setLibraryId(localStorage.getItem(LIB_KEY) ?? "");
  }, []);

  const upsertFn = useServerFn(upsertLesson);
  const deleteFn = useServerFn(deleteLesson);

  const { data, isLoading } = useQuery({ queryKey: ["lessons"], queryFn: () => listLessons() });

  const upsertMut = useMutation({
    mutationFn: upsertFn,
    onSuccess: () => {
      toast.success(form.id ? "Leçon mise à jour" : "Leçon créée");
      setForm(EMPTY);
      qc.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => { toast.success("Supprimée"); qc.invalidateQueries({ queryKey: ["lessons"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const onEdit = (l: LessonDTO) => {
    setForm({
      id: l.id,
      title: l.title,
      description: l.description,
      bunny_video_id: l.bunny_video_id,
      module: l.module,
      sort_order: l.sort_order,
      access: l.access,
      duration_seconds: l.duration_seconds,
      published: l.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.bunny_video_id.trim()) {
      toast.error("Titre et Bunny Video ID requis"); return;
    }
    upsertMut.mutate({ data: { ...form, title: form.title.trim(), bunny_video_id: form.bunny_video_id.trim() } });
  };

  const saveLibrary = () => {
    localStorage.setItem(LIB_KEY, libraryId.trim());
    toast.success("Library ID enregistré (local)");
  };

  const previewSrc = libraryId && form.bunny_video_id
    ? `https://iframe.mediadelivery.net/embed/${libraryId.trim()}/${form.bunny_video_id.trim()}?autoplay=false`
    : "";

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <section className="lg:col-span-3 space-y-6">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Bunny Library ID (aperçu)</label>
          <div className="mt-2 flex gap-2">
            <input value={libraryId} onChange={(e) => setLibraryId(e.target.value)} placeholder="ex. 123456" className="flex-1 px-3 py-2 rounded-lg bg-surface-2 border border-border outline-none focus:border-gold text-sm" />
            <button type="button" onClick={saveLibrary} className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-sm">Enregistrer</button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Stocké localement pour la prévisualisation. La sécurisation (token signé + restrictions de domaine) sera branchée côté serveur une fois les secrets Bunny configurés.</p>
        </div>

        <form onSubmit={onSubmit} className="p-6 rounded-3xl bg-surface border border-border shadow-soft space-y-5">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            {form.id ? <><Pencil className="text-gold" size={20} /> Modifier la leçon</> : <><Plus className="text-gold" /> Nouvelle leçon</>}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Titre</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} required className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Bunny Video ID</label>
              <input value={form.bunny_video_id} onChange={(e) => setForm({ ...form, bunny_video_id: e.target.value })} maxLength={200} required placeholder="ex. 9f8a7c12-..." className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none font-mono text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Module</label>
              <input value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })} maxLength={200} placeholder="ex. Module 1 — Bases" className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Ordre</label>
              <input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value || "0", 10) })} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Accès</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(["free", "paid"] as const).map((a) => (
                  <button key={a} type="button" onClick={() => setForm({ ...form, access: a })}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${form.access === a ? "bg-gold text-primary-foreground border-gold" : "bg-surface-2 border-border text-muted-foreground hover:text-foreground"}`}>
                    {a === "free" ? "Gratuit" : "Payant"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Durée (secondes)</label>
              <input type="number" min={0} value={form.duration_seconds ?? ""} onChange={(e) => setForm({ ...form, duration_seconds: e.target.value === "" ? null : parseInt(e.target.value, 10) })} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={5000} rows={4} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none resize-y" />
            </div>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Publiée (visible des élèves)
            </label>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Aperçu</label>
            <div className="mt-2 aspect-video rounded-xl bg-black/60 border border-border overflow-hidden grid place-items-center">
              {previewSrc ? (
                <iframe src={previewSrc} loading="lazy" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" allowFullScreen className="w-full h-full" />
              ) : (
                <p className="text-xs text-muted-foreground text-center px-4">Renseignez le Library ID et un Bunny Video ID pour prévisualiser la leçon.</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={upsertMut.isPending} className="flex-1 py-3.5 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50">
              {upsertMut.isPending ? "Enregistrement..." : form.id ? "Mettre à jour" : "Créer la leçon"}
            </button>
            {form.id && (
              <button type="button" onClick={() => setForm(EMPTY)} className="px-5 rounded-full bg-surface-2 border border-border text-sm inline-flex items-center gap-2">
                <X size={14} /> Annuler
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="lg:col-span-2">
        <h3 className="font-display text-xl font-bold mb-6">Leçons existantes</h3>
        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground text-sm">Chargement…</p>}
          {!isLoading && !data?.length && <p className="text-muted-foreground text-sm">Aucune leçon.</p>}
          {data?.map((l) => (
            <div key={l.id} className="p-4 rounded-2xl bg-surface border border-border">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {l.module || "—"} · #{l.sort_order}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full border ${l.access === "free" ? "border-emerald-500/40 text-emerald-400" : "border-gold/40 text-gold"}`}>
                      {l.access === "free" ? "Gratuit" : "Payant"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      {l.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {l.published ? "Publiée" : "Masquée"}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-muted-foreground/70 truncate">{l.bunny_video_id}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => onEdit(l)} className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => { if (confirm("Supprimer cette leçon ?")) deleteMut.mutate(l.id); }} className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}