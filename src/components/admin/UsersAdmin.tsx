import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shield, ShieldOff, Search } from "lucide-react";
import { toast } from "sonner";
import { listUsers, setUserAdmin } from "@/lib/users.functions";

export function UsersAdmin() {
  const qc = useQueryClient();
  const fetchUsers = useServerFn(listUsers);
  const setAdminFn = useServerFn(setUserAdmin);
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => fetchUsers() });

  const mut = useMutation({
    mutationFn: (vars: { user_id: string; is_admin: boolean }) => setAdminFn({ data: vars }),
    onSuccess: () => {
      toast.success("Rôle mis à jour");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((u) => (u.email ?? "").toLowerCase().includes(s));
  }, [data, q]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display text-2xl font-bold">Élèves & Admins</h2>
        <p className="text-sm text-muted-foreground mt-1">Promouvez un élève en administrateur ou retirez ses droits.</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un email…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border focus:border-gold outline-none text-sm"
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      {!isLoading && !filtered.length && <p className="text-sm text-muted-foreground">Aucun utilisateur.</p>}

      <ul className="space-y-2">
        {filtered.map((u) => (
          <li key={u.id} className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-sm">{u.email ?? "—"}</div>
              <div className="text-[11px] text-muted-foreground">
                Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}
                {u.last_sign_in_at ? ` · Dernière connexion ${new Date(u.last_sign_in_at).toLocaleDateString("fr-FR")}` : ""}
              </div>
            </div>
            {u.is_admin ? (
              <>
                <span className="px-2 py-0.5 rounded-full border border-gold/40 text-gold text-[11px]">Admin</span>
                <button
                  onClick={() => { if (confirm("Retirer les droits admin ?")) mut.mutate({ user_id: u.id, is_admin: false }); }}
                  disabled={mut.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs hover:text-destructive"
                >
                  <ShieldOff size={12} /> Retirer
                </button>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded-full border border-border text-muted-foreground text-[11px]">Élève</span>
                <button
                  onClick={() => mut.mutate({ user_id: u.id, is_admin: true })}
                  disabled={mut.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-gold text-primary-foreground text-xs font-semibold shadow-gold"
                >
                  <Shield size={12} /> Promouvoir admin
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}