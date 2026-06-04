import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Upload, X, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  createFormation,
  deleteFormation,
  listFormations,
} from "@/lib/formations.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Administration — J Forex Academy" }],
  }),
  component: AdminPage,
});

type PendingImage = { path: string; previewUrl: string };

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("user_roles" as never)
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const createFn = useServerFn(createFormation);
  const deleteFn = useServerFn(deleteFormation);

  const { data: formations, isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: () => listFormations(),
  });

  const createMut = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      toast.success("Formation créée");
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      queryClient.invalidateQueries({ queryKey: ["formations"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Supprimée");
      queryClient.invalidateQueries({ queryKey: ["formations"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const uploaded: PendingImage[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from("formation-images")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`Échec upload : ${error.message}`);
          continue;
        }
        const { data: signed } = await supabase.storage
          .from("formation-images")
          .createSignedUrl(path, 3600);
        uploaded.push({ path, previewUrl: signed?.signedUrl ?? "" });
      }
      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = async (path: string) => {
    await supabase.storage.from("formation-images").remove([path]);
    setImages((prev) => prev.filter((i) => i.path !== path));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (!title.trim() || !description.trim() || Number.isNaN(priceNum)) {
      toast.error("Champs invalides");
      return;
    }
    createMut.mutate({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        imagePaths: images.map((i) => i.path),
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Chargement…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6 bg-background">
        <div className="max-w-md text-center p-8 rounded-3xl bg-surface border border-border">
          <h1 className="font-display text-2xl font-bold">Accès refusé</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Votre compte n'a pas les droits administrateur. Demandez à un admin
            d'ajouter votre user_id dans la table <code>user_roles</code> avec le
            rôle <code>admin</code>.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Link to="/" className="px-4 py-2 rounded-full bg-surface-2 border border-border text-sm">Accueil</Link>
            <button onClick={signOut} className="px-4 py-2 rounded-full bg-surface-2 border border-border text-sm">Se déconnecter</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold">
            J Forex <span className="text-gold">Admin</span>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3">
          <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-gold" /> Nouvelle formation
          </h1>
          <form onSubmit={onSubmit} className="space-y-5 p-6 rounded-3xl bg-surface border border-border shadow-soft">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Titre</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={5000}
                required
                rows={6}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none resize-y"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Images</label>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div key={img.path} className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 border border-border group">
                    {img.previewUrl && (
                      <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.path)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-gold flex flex-col items-center justify-center text-muted-foreground hover:text-gold transition disabled:opacity-50"
                >
                  <Upload size={20} />
                  <span className="text-xs mt-1">{uploading ? "..." : "Ajouter"}</span>
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="w-full py-3.5 rounded-full gradient-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-50"
            >
              {createMut.isPending ? "Création..." : "Créer la formation"}
            </button>
          </form>
        </section>

        <section className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold mb-6">Formations</h2>
          <div className="space-y-3">
            {isLoading && <p className="text-muted-foreground text-sm">Chargement…</p>}
            {!isLoading && (!formations || formations.length === 0) && (
              <p className="text-muted-foreground text-sm">Aucune formation.</p>
            )}
            {formations?.map((f) => (
              <div key={f.id} className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3">
                {f.images[0] && (
                  <img src={f.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.price}€</div>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Supprimer cette formation ?")) deleteMut.mutate(f.id);
                  }}
                  className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}