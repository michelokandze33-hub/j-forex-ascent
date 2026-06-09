import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, PlayCircle, Lock, Clock, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listStudentLessons, type LessonDTO } from "@/lib/lessons.functions";

export const Route = createFileRoute("/_authenticated/espace-eleve")({
  head: () => ({ meta: [{ title: "Espace élève — JEFE Forex" }] }),
  component: StudentSpace,
});

const LIB_KEY = "jefe.bunny.libraryId";

function StudentSpace() {
  const navigate = useNavigate();
  const fetchLessons = useServerFn(listStudentLessons);
  const { data, isLoading } = useQuery({ queryKey: ["student-lessons"], queryFn: () => fetchLessons() });
  const [libraryId, setLibraryId] = useState("");
  const [active, setActive] = useState<LessonDTO | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setLibraryId(localStorage.getItem(LIB_KEY) ?? "");
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, LessonDTO[]>();
    for (const l of data ?? []) {
      const key = l.module || "Autres";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(l);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.sort_order - b.sort_order);
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  useEffect(() => {
    if (!active && data && data.length) setActive(data[0]);
  }, [data, active]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const playerSrc = libraryId && active
    ? `https://iframe.mediadelivery.net/embed/${libraryId.trim()}/${active.bunny_video_id.trim()}?autoplay=false`
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/90 backdrop-blur z-40">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold inline-flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl gradient-gold grid place-items-center text-primary-foreground font-bold shadow-gold">J</span>
            JEFE <span className="text-gold">Forex</span> · Espace élève
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 space-y-4">
          <div className="aspect-video rounded-3xl bg-black border border-border overflow-hidden grid place-items-center">
            {playerSrc ? (
              <iframe
                key={active?.id}
                src={playerSrc}
                loading="lazy"
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="text-center px-6 py-12 text-muted-foreground text-sm">
                {active ? "Configuration vidéo manquante (Library ID)." : "Sélectionnez une leçon pour démarrer."}
              </div>
            )}
          </div>
          {active && (
            <div className="p-6 rounded-3xl bg-surface border border-border">
              <div className="text-xs uppercase tracking-widest text-gold">{active.module || "Leçon"}</div>
              <h1 className="mt-1 font-display text-2xl font-bold">{active.title}</h1>
              {active.description && (
                <p className="mt-3 text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{active.description}</p>
              )}
              {active.duration_seconds ? (
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} /> {Math.round(active.duration_seconds / 60)} min
                </div>
              ) : null}
            </div>
          )}
        </section>

        <aside className="lg:col-span-2 space-y-6">
          <div className="p-4 rounded-2xl bg-surface border border-border">
            <label className="text-xs uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5">
              <BookOpen size={12} /> Bunny Library ID
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={libraryId}
                onChange={(e) => setLibraryId(e.target.value)}
                placeholder="ex. 123456"
                className="flex-1 px-3 py-2 rounded-lg bg-surface-2 border border-border outline-none focus:border-gold text-sm"
              />
              <button
                type="button"
                onClick={() => { localStorage.setItem(LIB_KEY, libraryId.trim()); }}
                className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-sm"
              >
                OK
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Temporaire — sera remplacé par la lecture signée côté serveur.</p>
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!isLoading && !groups.length && (
            <p className="text-sm text-muted-foreground">Aucune leçon disponible pour le moment.</p>
          )}

          <div className="space-y-6">
            {groups.map(([module, items]) => (
              <div key={module}>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{module}</h3>
                <ul className="space-y-2">
                  {items.map((l) => {
                    const isActive = active?.id === l.id;
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => setActive(l)}
                          className={`w-full text-left p-3 rounded-2xl border flex items-start gap-3 transition ${
                            isActive
                              ? "bg-surface-2 border-gold/60"
                              : "bg-surface border-border hover:border-gold/30"
                          }`}
                        >
                          <span className={`mt-0.5 ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                            {l.access === "paid" ? <Lock size={16} /> : <PlayCircle size={16} />}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium truncate">{l.title}</span>
                            <span className="block text-[11px] text-muted-foreground">
                              {l.access === "free" ? "Gratuit" : "Membre"}
                              {l.duration_seconds ? ` · ${Math.round(l.duration_seconds / 60)} min` : ""}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}