import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "CGV — J Forex Academy" },
      { name: "description", content: "Conditions générales de vente de J Forex Academy." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">← Retour</Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-8">Conditions générales de vente</h1>
        <p className="text-muted-foreground">Contenu à compléter : objet, prix, modalités de paiement, droit de rétractation, garanties, litiges.</p>
      </div>
    </div>
  );
}