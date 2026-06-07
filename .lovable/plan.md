## Audit du site actuel vs cahier des charges

| Section du cahier | Présent ? | À faire |
|---|---|---|
| Hero (accroche + stats + réseaux) | Partiel | Renommer "JEFE Forex", garder accroche, retirer "promotion ouverte" si fausse, brancher vrais liens IG/TikTok/YouTube |
| Section Problème | OK | — |
| Preuve sociale (carrousel captures) | **Manquant** | À créer + admin |
| Présentation Mentor + payouts | Partiel | Ajouter carrousel payouts géré en admin |
| Journal de trading + stats | **Manquant** | À créer + admin |
| Méthode | OK | — |
| Qualification (filtre client ✓/✕) | OK | — |
| Grille tarifaire FCFA | Partiel | Passer prix en FCFA, formater "150 000 FCFA" |
| FAQ | OK | — |
| Footer / mentions / disclaimer | OK | Vérifier disclaimer risques |
| LMS, paiements, Q&A | Hors périmètre | Étapes suivantes |

## Périmètre de cette livraison (landing uniquement)

L'utilisateur a choisi : compléter la landing d'abord. Paiements (Paystack/Flutterwave/Wave), vidéos (Bunny.net) et LMS seront livrés ensuite. Devise FCFA, marque "JEFE Forex".

## Changements à implémenter

### 1. Renommage marque
- Remplacer "J Forex Academy" / "J Forex" par "JEFE Forex" partout (Header logo, Hero, Footer, titres `<head>`, pages CGV/mentions/confidentialité, page auth, page admin).

### 2. Devise FCFA
- `Formations.tsx` : afficher `{price.toLocaleString("fr-FR")} FCFA` au lieu de `€`.
- Admin (`_authenticated/admin.tsx`) : label "Prix (FCFA)", suppression du step décimal, affichage liste en FCFA.
- Migration DB : modifier la colonne `price` `numeric` → `bigint` (entiers FCFA) — optionnel mais propre.

### 3. Hero — réseaux sociaux
- Ajouter un champ admin (settings simples) OU paramétrer en dur les vrais liens Instagram / TikTok / YouTube fournis par l'utilisateur (à demander à la prochaine itération).
- Remplacer icône Telegram/TradingView par TikTok + YouTube (lucide n'a pas TikTok → SVG inline).
- Retirer le badge "Nouvelle promotion ouverte" tant qu'aucune vraie promo n'est pilotable.

### 4. Section Preuve Sociale (nouvelle)
- Table `testimonials` (id, image_url storage path, alt, source enum: telegram/instagram/trustpilot, sort_order, published).
- Bucket privé `testimonials` + signed URLs serveur (même pattern que formations).
- RLS : lecture publique des `published=true`, écriture admin.
- Server fns : `listTestimonials`, `createTestimonial`, `deleteTestimonial`.
- Composant `<Testimonials />` : carrousel horizontal scrollable (snap-x) avec captures d'écran réelles ; badge source.
- Onglet "Témoignages" dans `/admin`.

### 5. Section Mentor — Payouts (carrousel)
- Table `payouts` (id, image_url, amount_label TEXT optionnel, prop_firm TEXT optionnel, sort_order, published).
- Mêmes RLS + server fns + UI admin que témoignages.
- Composant `<Payouts />` carrousel ajouté sous `<Mentor />` ou intégré dedans.

### 6. Section Journal de trading + stats (nouvelle)
- Table `trades` (id, pair TEXT, result TEXT ex "WIN +4R", rr NUMERIC, executed_at DATE, note TEXT, sort_order, published).
- Table `trading_stats` ligne unique (winrate_pct, avg_rr, cumulative_gain_label, period_label) éditable par admin.
- RLS lecture publique published / écriture admin.
- Server fns + onglets admin (`Trades` et `Stats`).
- Composant `<TradingJournal />` : liste des derniers setups + carte stats 3 mois.

### 7. Page `/admin` réorganisée
- Sidebar / onglets : Formations | Témoignages | Payouts | Journal | Stats.
- Réutiliser le pattern d'upload images existant (storage signed URL).

### 8. Footer
- Vérifier la présence d'un disclaimer "Le trading comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures." (ajouter si absent).

## Hors périmètre (étapes suivantes — préparer mais ne pas livrer)
- **LMS** : modules / chapitres / vidéos Bunny.net Stream / progression / Q&A — itération 2.
- **Paiements** Paystack/Flutterwave + NOWPayments + webhooks → itération 3 ; l'admin débloquera manuellement les accès en attendant.
- **Auth** : déjà en place, sera étendue (rôle "student" + table `enrollments`) à l'itération LMS.

## Détails techniques

- **DB** : une seule migration regroupant `testimonials`, `payouts`, `trades`, `trading_stats` (+ GRANTS + RLS via `has_role('admin')` + lecture anon des `published=true`).
- **Storage** : un bucket privé supplémentaire `marketing-assets` (témoignages + payouts) ; signed URLs 5 ans côté serveur comme pour `formation-images`.
- **Server fns** : `src/lib/testimonials.functions.ts`, `payouts.functions.ts`, `trading.functions.ts` — mêmes garde-fous (`requireSupabaseAuth` + check rôle admin pour écriture, lecture publique via `supabaseAdmin` + filtre `published`).
- **Admin UI** : refactor `_authenticated/admin.tsx` en layout avec onglets (Tabs shadcn) ; chaque onglet = sous-composant.
- **Composants landing** : `Testimonials.tsx`, `Payouts.tsx` (intégré dans `Mentor.tsx`), `TradingJournal.tsx` ajoutés à `src/routes/index.tsx` dans l'ordre du cahier (Hero → Problème → Preuve sociale → Mentor+Payouts → Journal → Méthode → Qualification → Formations → FAQ).
- **i18n prix** : utilitaire `formatFCFA(n)` partagé.

## Questions ouvertes (à confirmer après ce plan)
- Liens réels Instagram / TikTok / YouTube de JEFE Forex.
- Souhaitez-vous des données de démo pré-remplies, ou tout vide pour que vous saisissiez via `/admin` ?
