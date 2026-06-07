import { Link } from "@tanstack/react-router";
import { Instagram, Send, TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl gradient-gold grid place-items-center text-primary-foreground font-bold">
                J
              </span>
              <span className="font-display font-bold">
                JEFE <span className="text-gold">Forex</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">
              L'académie de référence pour les traders qui veulent construire
              une méthode disciplinée, durable et rentable.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Send, TrendingUp].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-surface border border-border grid place-items-center text-muted-foreground hover:text-gold hover:border-gold/40 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-display font-bold text-sm mb-4">Académie</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#methode" className="hover:text-foreground">Méthode</a></li>
              <li><a href="#offres" className="hover:text-foreground">Offres</a></li>
              <li><a href="#resultats" className="hover:text-foreground">Résultats</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="font-display font-bold text-sm mb-4">Légal</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/mentions-legales" className="hover:text-foreground">Mentions légales</Link></li>
              <li><Link to="/cgv" className="hover:text-foreground">CGV</Link></li>
              <li><Link to="/confidentialite" className="hover:text-foreground">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">Avertissement sur les risques :</strong>{" "}
            Le trading sur le marché des changes (Forex) comporte un niveau de
            risque élevé et peut ne pas convenir à tous les investisseurs. Les
            performances passées ne préjugent pas des performances futures. Vous
            pouvez perdre tout ou partie de votre capital investi.
          </p>
          <p>© {new Date().getFullYear()} JEFE Forex — Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}