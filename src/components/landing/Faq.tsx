import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    q: "Combien de temps faut-il pour suivre la formation ?",
    a: "Comptez 4 à 8 semaines pour absorber les modules. L'accès est à vie, vous pouvez avancer à votre rythme.",
  },
  {
    q: "Faut-il déjà connaître le trading ?",
    a: "Non. La formation est structurée pour démarrer de zéro et amener un débutant jusqu'à une exécution disciplinée.",
  },
  {
    q: "Quelle est la différence entre Pro et Premium ?",
    a: "Premium inclut le coaching live, la revue de trades personnalisée et un accès direct au mentor. Pro reste autonome.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Wave, Visa, Mastercard et crypto (USDT TRC20/BEP20, BTC, ETH). Paiement sécurisé en une fois ou en plusieurs fois.",
  },
  {
    q: "Y a-t-il une garantie ?",
    a: "Oui — 14 jours satisfait ou remboursé sur l'offre Premium, sans justification.",
  },
  {
    q: "Promettez-vous des résultats ?",
    a: "Non. Le trading reste risqué. Nous garantissons une méthode claire et un cadre — le travail dépend de vous.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <div className="text-sm uppercase tracking-widest text-gold mb-4">
            FAQ
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Vos questions, nos réponses.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="rounded-2xl bg-surface border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left font-medium hover:bg-surface-2 transition"
                >
                  <span>{f.q}</span>
                  <span className="w-8 h-8 rounded-full bg-gold-soft text-gold grid place-items-center shrink-0">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}