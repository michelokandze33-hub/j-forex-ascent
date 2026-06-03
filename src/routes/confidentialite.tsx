import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité — J Forex Academy" },
      { name: "description", content: "Politique de confidentialité de J Forex Academy." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">← Retour</Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-8">Politique de confidentialité</h1>
        <p className="text-muted-foreground">Contenu à compléter : données collectées, finalités, durée de conservation, droits RGPD, contact DPO.</p>
      </div>
    </div>
  );
}