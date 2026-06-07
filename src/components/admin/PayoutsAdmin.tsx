import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createPayout, deletePayout, listPayouts } from "@/lib/payouts.functions";

export function PayoutsAdmin() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState("");
  const [firm, setFirm] = useState("");
  const [uploading, setUploading] = useState(false);

  const createFn = useServerFn(createPayout);
  const deleteFn = useServerFn(deletePayout);
  const { data } = useQuery({ queryKey: ["payouts"], queryFn: () => listPayouts() });

  const createMut = useMutation({
    mutationFn: createFn,
    onSuccess: () => { toast.success("Payout ajouté"); setAmount(""); setFirm(""); qc.invalidateQueries({ queryKey: ["payouts"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => { toast.success("Supprimé"); qc.invalidateQueries({ queryKey: ["payouts"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `payouts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("marketing-assets").upload(path, file, { contentType: file.type });
        if (error) { toast.error(error.message); continue; }
        await createMut.mutateAsync({ data: { image_path: path, amount_label: amount || null, prop_firm: firm || null } });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
        <h3 className="font-display text-xl font-bold">Ajouter une preuve de retrait (Payout)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Montant (ex : $4 250)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} maxLength={60} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Prop firm (ex : FTMO)</label>
            <input value={firm} onChange={(e) => setFirm(e.target.value)} maxLength={60} className="mt-1 w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold outline-none" />
          </div>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-3.5 rounded-full bg-surface-2 border border-dashed border-border hover:border-gold inline-flex items-center justify-center gap-2 disabled:opacity-50">
          <Upload size={16} /> {uploading ? "Upload..." : "Téléverser le payout"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data?.map((p) => (
          <div key={p.id} className="relative group rounded-2xl overflow-hidden border border-border bg-surface">
            <div className="aspect-video bg-surface-2"><img src={p.url} alt="" className="w-full h-full object-cover" /></div>
            <div className="px-3 py-2 text-xs flex items-center justify-between">
              <span className="text-gold font-semibold">{p.amount_label ?? "—"}</span>
              <span className="text-muted-foreground">{p.prop_firm ?? ""}</span>
            </div>
            <button onClick={() => { if (confirm("Supprimer ?")) deleteMut.mutate(p.id); }} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 text-destructive"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}