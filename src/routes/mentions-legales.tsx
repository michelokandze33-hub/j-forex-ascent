import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — J Forex Academy" },
      { name: "description", content: "Mentions légales de J Forex Academy." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">← Retour</Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-8">Mentions légales</h1>
        <p className="text-muted-foreground">Contenu à compléter : éditeur du site, hébergeur, directeur de publication, contact.</p>
      </div>
    </div>
  );
}