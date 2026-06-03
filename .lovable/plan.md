## Objectif

Livrer la **landing page** complète de J Forex Academy (Phase 1 — marketing uniquement), avec design premium dark/doré, animations fluides, mobile-first, et un formulaire de capture de leads connecté à supabase. Tout le contenu sera en **placeholders réalistes** que vous pourrez éditer ensuite.

## Identité visuelle

- Fond noir profond `#0B0B0B`, surfaces gris anthracite `#161616`, texte blanc, accent doré `#D4AF37`
- Typo : Inter (corps) + Manrope (titres)
- Coins arrondis généreux, ombres douces, espaces aérés, animations subtiles au scroll/hover
- Responsive mobile-first, tokens définis dans `src/styles.css` (oklch)

## Sections de la landing

1. **Header** sticky transparent → solide au scroll (logo + nav ancres + CTA)
2. **Hero** — titre, sous-titre, 2 CTA, stats clés, badges réseaux sociaux, portrait mentor
3. **Le vrai problème** — 4 cartes (sur-trading, plan, risque, psychologie)
4. **Résultats des élèves** — slider témoignages + grille screenshots (placeholders)
5. **Le mentor** — bio, parcours, payouts prop firms, chiffres clés
6. **Dashboard de performances** — mock visuel (winrate, RR, trades, mini-graphe)
7. **Méthode J Forex** — timeline interactive 7 étapes
8. **Qualification** — comparatif "Pour qui / Pour qui pas"
9. **Offres** — cartes tarifaires avec mise en avant Coaching Premium à Vie
10. **Lead magnet** — capture email pour le PDF "10 erreurs"
11. **FAQ** — accordéon animé
12. **Footer** — mentions légales, CGV, confidentialité, disclaimer risques

## Backend (Lovable Cloud)

- Activation de Lovable Cloud
- Table `leads` (id, email, name, source, created_at) + RLS (insert public, select admin)
- Server function `submitLead` pour le formulaire lead magnet
- Pas d'auth ni de LMS dans cette phase (au scope explicite "landing uniquement")

## Détails techniques

- Stack template : TanStack Start + React + Tailwind v4 + shadcn
- Routes : `src/routes/index.tsx` (landing), `src/routes/mentions-legales.tsx`, `cgv.tsx`, `confidentialite.tsx` (placeholders)
- Composants découpés dans `src/components/landing/` (Hero, Problem, Results, Mentor, Dashboard, Method, Qualification, Offers, LeadMagnet, FAQ, Footer)
- Tokens design dans `src/styles.css` (dark par défaut)
- SEO : `head()` par route avec title/description/og adaptés
- Images : placeholders générés (portrait mentor, screenshots résultats) — remplaçables

## Hors scope (phases suivantes)

- Auth, dashboard élève, lecteur de cours, certificats
- Paiements (Wave / Flutterwave / crypto)
- Q&A, admin, Bunny Stream, emails Resend, quiz

Confirmez pour que je lance l'implémentation.