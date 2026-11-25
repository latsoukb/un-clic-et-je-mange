// ─────────────────────────────────────────────────────────────
// SEED — données de départ de Lat (brief). Tout halal, sans riz, sans poisson,
// légumes : tomate et concombre seulement. Quantités pour 1 personne.
// `approx: true` = quantité NON fournie par le brief, estimée raisonnablement
// (elle est signalée « estimée » dans l'app). Modifiable ici.
// ─────────────────────────────────────────────────────────────

export const RAYONS = [
  { id: 'viande', label: 'Boucherie halal' },
  { id: 'frais', label: 'Crèmerie & frais' },
  { id: 'legumes', label: 'Légumes' },
  { id: 'epicerie', label: 'Épicerie' },
  { id: 'pains', label: 'Pains & tortillas' },
  { id: 'surgeles', label: 'Surgelés' },
  { id: 'petitdej', label: 'Petit-déjeuner' }
]

// unit: g | ml | pc (pièce) | tr (tranche) | cs (c. à soupe) | noix
export const INGREDIENTS = {
  poulet: { name: 'Blanc de poulet', unit: 'g', rayon: 'viande' },
  cuisses: { name: 'Cuisses de poulet', unit: 'pc', rayon: 'viande' },
  boeuf: { name: 'Bœuf haché halal', unit: 'g', rayon: 'viande' },
  dinde: { name: 'Dinde fumée halal', unit: 'tr', rayon: 'viande' },
  crevettes: { name: 'Crevettes', unit: 'g', rayon: 'surgeles' },
  frites: { name: 'Frites (surgelées, air fryer)', unit: 'g', rayon: 'surgeles' },
  creme: { name: 'Crème fraîche 35 %', unit: 'ml', rayon: 'frais' },
  lait: { name: 'Lait', unit: 'ml', rayon: 'frais' },
  oeufs: { name: 'Œufs', unit: 'pc', rayon: 'frais' },
  cheddar: { name: 'Cheddar (tranches)', unit: 'tr', rayon: 'frais' },
  rape: { name: 'Fromage râpé', unit: 'g', rayon: 'frais' },
  beurre: { name: 'Beurre', unit: 'noix', rayon: 'frais' },
  sauceblanche: { name: 'Sauce blanche', unit: 'cs', rayon: 'frais' },
  tomate: { name: 'Tomate', unit: 'pc', rayon: 'legumes' },
  concombre: { name: 'Concombre', unit: 'pc', rayon: 'legumes' },
  patates: { name: 'Pommes de terre', unit: 'g', rayon: 'legumes' },
  pates: { name: 'Pâtes', unit: 'g', rayon: 'epicerie' },
  gnocchi: { name: 'Gnocchi', unit: 'g', rayon: 'epicerie', pack: { size: 500, label: 'paquet' } },
  sautomate: { name: 'Sauce tomate', unit: 'ml', rayon: 'epicerie' },
  chapelure: { name: 'Chapelure', unit: 'g', rayon: 'epicerie' },
  farine: { name: 'Farine', unit: 'cs', rayon: 'epicerie' },
  ketchupmayo: { name: 'Ketchup / mayo', unit: 'cs', rayon: 'epicerie' },
  tortillas: { name: 'Tortillas', unit: 'pc', rayon: 'pains' },
  painburger: { name: 'Pain burger', unit: 'pc', rayon: 'pains' },
  paindemie: { name: 'Pain de mie (tranches)', unit: 'tr', rayon: 'pains' },
  pain: { name: 'Pain (tranches)', unit: 'tr', rayon: 'petitdej' },
  cereales: { name: 'Céréales', unit: 'g', rayon: 'petitdej' },
  pb: { name: 'Beurre de cacahuète', unit: 'cs', rayon: 'petitdej' },
  confiture: { name: 'Confiture', unit: 'cs', rayon: 'petitdej' }
}

// Produits de base supposés déjà à la maison : affichés dans la recette, pas dans les courses.
export const STAPLES = ['Sel', 'Poivre', 'Paprika', 'Huile']

// i = ingredient id, q = quantité (1 personne), r = texte si fourchette, approx = estimée
const I = (i, q, extra = {}) => ({ i, q, ...extra })

export const RECIPES = [
  {
    id: 'tacos', name: 'Tacos poulet crème fraîche + frites', emoji: '🌮', hue: '#f6d9b8',
    prep: 10, cook: '12-15', cookMin: 14,
    ing: [I('poulet', 225, { r: '200-250 g' }), I('tortillas', 5), I('creme', 60, { approx: true }), I('frites', 200)],
    staples: ['Sel', 'Poivre', 'Paprika'],
    steps: [
      { t: 'Coupe le poulet en lamelles. Sel, poivre, paprika.' },
      { t: 'Cuis le poulet.', af: 'Air fryer 190 °C, 12 min.', alt: 'À la poêle, 8 min.' },
      { t: 'Cuis les frites.', af: 'Air fryer 200 °C, 12-15 min.', alt: 'Au four 220 °C, 20-25 min.' },
      { t: 'Passe les tortillas 30 s à la poêle.' },
      { t: 'Garnis de poulet + crème fraîche, roule.' }
    ]
  },
  {
    id: 'crevettes', name: 'Pâtes crevettes crème fraîche', emoji: '🍤', hue: '#f9d5c8',
    prep: 5, cook: '8-10', cookMin: 9,
    ing: [I('pates', 150), I('crevettes', 150), I('creme', 100, { approx: true })],
    staples: ['Sel', 'Poivre', 'Huile'],
    steps: [
      { t: 'Cuis les pâtes dans l’eau salée, 8-10 min.' },
      { t: 'Pendant ce temps, saisis les crevettes à la poêle avec un peu d’huile, 3-4 min.' },
      { t: 'Ajoute la crème fraîche aux crevettes, 1 min.' },
      { t: 'Égoutte les pâtes, mélange avec la sauce.' }
    ]
  },
  {
    id: 'pane', name: 'Poulet pané façon KFC + frites + tomate/concombre', emoji: '🍗', hue: '#f7e0a8',
    prep: 10, cook: '12-14', cookMin: 13,
    ing: [I('poulet', 225, { r: '200-250 g' }), I('chapelure', 60, { approx: true }), I('oeufs', 1), I('frites', 200), I('tomate', 1, { approx: true }), I('concombre', 0.5, { approx: true })],
    staples: ['Sel', 'Poivre', 'Paprika', 'Huile'],
    steps: [
      { t: 'Bats l’œuf dans une assiette, sel, poivre, paprika. Chapelure dans une autre.' },
      { t: 'Passe le poulet dans l’œuf puis dans la chapelure. Un filet d’huile dessus.' },
      { t: 'Cuis le poulet.', af: 'Air fryer 190 °C, 12-14 min, retourne à mi-cuisson.', alt: 'Au four 200 °C, 20 min, ou à la poêle.' },
      { t: 'Cuis les frites.', af: 'Air fryer 200 °C, 12-15 min.', alt: 'Au four 220 °C, 20-25 min.' },
      { t: 'Coupe la tomate et le concombre, sers ensemble.' }
    ]
  },
  {
    id: 'gnocchi', name: 'Gnocchi poulet crème fraîche', emoji: '🥘', hue: '#f2e4c2',
    prep: 5, cook: '8-10', cookMin: 9,
    ing: [I('gnocchi', 165, { r: '≈ 165 g (1 paquet = 3 repas)' }), I('poulet', 200), I('creme', 100, { approx: true })],
    staples: ['Sel', 'Poivre', 'Huile'],
    steps: [
      { t: 'Coupe le poulet en dés, sel, poivre.' },
      { t: 'Saisis le poulet à la poêle, 6-8 min.' },
      { t: 'Plonge les gnocchi dans l’eau bouillante : ils sont prêts quand ils remontent (2-3 min).' },
      { t: 'Ajoute la crème au poulet, puis les gnocchi égouttés. Mélange.' }
    ]
  },
  {
    id: 'bolo', name: 'Pâtes bolognaise', emoji: '🍝', hue: '#f4c9b5',
    prep: 5, cook: '10-13', cookMin: 12,
    ing: [I('pates', 150), I('boeuf', 175, { r: '150-200 g' }), I('sautomate', 200, { approx: true })],
    staples: ['Sel', 'Poivre', 'Huile'],
    steps: [
      { t: 'Fais revenir le bœuf haché à la poêle, 5 min, sel, poivre.' },
      { t: 'Verse la sauce tomate, laisse mijoter 5-8 min.' },
      { t: 'Pendant ce temps, cuis les pâtes dans l’eau salée.' },
      { t: 'Égoutte et mélange avec la sauce.' }
    ]
  },
  {
    id: 'burger', name: 'Burger poulet + frites', emoji: '🍔', hue: '#f5d6a6',
    prep: 5, cook: '12', cookMin: 12,
    ing: [I('painburger', 1), I('poulet', 200), I('frites', 200), I('tomate', 1, { approx: true }), I('ketchupmayo', 2, { approx: true }), I('cheddar', 1, { approx: true })],
    staples: ['Sel', 'Poivre', 'Paprika'],
    steps: [
      { t: 'Assaisonne le poulet (sel, poivre, paprika).' },
      { t: 'Cuis le poulet.', af: 'Air fryer 190 °C, 12 min.', alt: 'À la poêle, 10-12 min.' },
      { t: 'Cuis les frites.', af: 'Air fryer 200 °C, 12-15 min.', alt: 'Au four 220 °C, 20-25 min.' },
      { t: 'Pose le cheddar sur le poulet en fin de cuisson pour qu’il fonde.' },
      { t: 'Monte le burger : pain, ketchup/mayo, tomate, poulet.' }
    ]
  },
  {
    id: 'cuisses', name: 'Cuisses de poulet + pommes de terre au four', emoji: '🍗', hue: '#eed2a8',
    prep: 10, cook: '20-25', cookMin: 23,
    ing: [I('cuisses', 2), I('patates', 350, { r: '300-400 g' })],
    staples: ['Sel', 'Poivre', 'Paprika', 'Huile'],
    steps: [
      { t: 'Coupe les pommes de terre en quartiers. Huile, sel, poivre.' },
      { t: 'Assaisonne les cuisses (sel, poivre, paprika).' },
      { t: 'Cuis le tout.', af: 'Air fryer 190-200 °C, 20-25 min, remue à mi-cuisson.', alt: 'Four 200 °C, 35-40 min.' }
    ]
  },
  {
    id: 'wrap', name: 'Wrap poulet grillé sauce blanche', emoji: '🌯', hue: '#f1dcb4',
    prep: 5, cook: '12', cookMin: 12,
    ing: [I('poulet', 200), I('tortillas', 2, { r: '1-2 pièces' }), I('sauceblanche', 3, { approx: true }), I('tomate', 1, { approx: true }), I('concombre', 0.5, { approx: true })],
    staples: ['Sel', 'Poivre', 'Paprika'],
    steps: [
      { t: 'Coupe le poulet en lamelles, assaisonne.' },
      { t: 'Cuis le poulet.', af: 'Air fryer 190 °C, 10-12 min.', alt: 'À la poêle, 8-10 min.' },
      { t: 'Coupe tomate et concombre.' },
      { t: 'Garnis la tortilla : sauce blanche, poulet, légumes. Roule.' }
    ]
  },
  {
    id: 'mac', name: 'Mac and cheese + poulet', emoji: '🧀', hue: '#f9e3a0',
    prep: 5, cook: '8-10', cookMin: 9,
    ing: [I('pates', 150), I('rape', 100, { approx: true }), I('lait', 150, { approx: true }), I('poulet', 200)],
    staples: ['Sel', 'Poivre', 'Huile'],
    steps: [
      { t: 'Coupe le poulet en dés, saisis-le à la poêle 6-8 min.' },
      { t: 'Cuis les pâtes dans l’eau salée, 8-10 min. Égoutte.' },
      { t: 'Remets les pâtes dans la casserole avec le lait et le fromage, mélange à feu doux jusqu’à ce que ce soit crémeux.' },
      { t: 'Ajoute le poulet.' }
    ]
  },
  {
    id: 'carbo', name: 'Pâtes carbonara dinde fumée', emoji: '🥓', hue: '#f3e0c0',
    prep: 5, cook: '8-10', cookMin: 9,
    ing: [I('pates', 150), I('dinde', 4, { approx: true }), I('oeufs', 1), I('creme', 80, { approx: true })],
    staples: ['Sel', 'Poivre'],
    steps: [
      { t: 'Cuis les pâtes dans l’eau salée, 8-10 min.' },
      { t: 'Fais dorer la dinde fumée en lanières à la poêle, 2-3 min.' },
      { t: 'Mélange l’œuf et la crème fraîche, poivre.' },
      { t: 'Hors du feu, mêle les pâtes égouttées, la dinde et la sauce œuf-crème.' }
    ]
  },
  {
    id: 'nuggets', name: 'Nuggets maison + frites', emoji: '🍗', hue: '#f6dca4',
    prep: 10, cook: '10-12', cookMin: 11,
    ing: [I('poulet', 225, { r: '200-250 g' }), I('chapelure', 60, { approx: true }), I('oeufs', 1), I('frites', 200)],
    staples: ['Sel', 'Poivre', 'Paprika', 'Huile'],
    steps: [
      { t: 'Coupe le poulet en morceaux, assaisonne.' },
      { t: 'Trempe dans l’œuf battu, puis dans la chapelure.' },
      { t: 'Cuis les nuggets.', af: 'Air fryer 190 °C, 10-12 min.', alt: 'Au four 200 °C, 15-18 min.' },
      { t: 'Cuis les frites.', af: 'Air fryer 200 °C, 12-15 min.', alt: 'Au four 220 °C, 20-25 min.' }
    ]
  },
  {
    id: 'croque', name: 'Croques-monsieur halal bien chargés (×2) + frites', emoji: '🥪', hue: '#f0d9b0',
    prep: 10, cook: '8-10', cookMin: 9,
    ing: [I('paindemie', 4), I('dinde', 3, { r: '2-3 tranches' }), I('cheddar', 2), I('lait', 150), I('beurre', 1), I('farine', 1), I('frites', 200)],
    staples: ['Sel', 'Poivre'],
    steps: [
      { t: 'Béchamel : fais fondre le beurre, ajoute la farine, puis le lait en fouettant. Sel, poivre.' },
      { t: 'Monte 2 croques : pain, béchamel, dinde fumée, cheddar, pain. Un peu de béchamel dessus.' },
      { t: 'Cuis les croques.', af: 'Air fryer 200 °C, 8-10 min.', alt: 'Four 200 °C, 8-10 min.' },
      { t: 'Cuis les frites.', af: 'Air fryer 200 °C, 12-15 min.', alt: 'Au four 220 °C, 20-25 min.' }
    ]
  }
]

export const BREAKFASTS = [
  { id: 'cereales', name: 'Céréales + lait', emoji: '🥣', mins: 3, ing: [I('cereales', 40, { approx: true }), I('lait', 200, { approx: true })] },
  { id: 'pb', name: 'Pain + beurre de cacahuète + confiture', emoji: '🥜', mins: 5, ing: [I('pain', 2, { approx: true }), I('pb', 1, { approx: true }), I('confiture', 1, { approx: true })] },
  { id: 'oeufs', name: 'Œufs + pain', emoji: '🍳', mins: 8, ing: [I('oeufs', 2, { approx: true }), I('pain', 2, { approx: true })] }
]

// Plan 4 semaines (validé par Lat) — 28 soirs.
const W1 = ['tacos', 'crevettes', 'pane', 'gnocchi', 'bolo', 'burger', 'cuisses']
const W2 = ['wrap', 'mac', 'carbo', 'nuggets', 'tacos', 'crevettes', 'pane']
const W3 = ['gnocchi', 'bolo', 'burger', 'cuisses', 'wrap', 'mac', 'carbo']
const W4 = ['nuggets', 'tacos', 'crevettes', 'pane', 'gnocchi', 'bolo', 'burger']
export const DEFAULT_PLAN = [...W1, ...W2, ...W3, ...W4]

// Référence fournie par le brief (estimation de Lat, pas un total garanti).
export const REFERENCE_BASKET = { amount: 217, label: 'Panier exemple (Walmart Sherbrooke via Uber Eats), estimation du brief' }

export const DEFAULT_SETTINGS = {
  budget: 200, persons: 1, store: 'Walmart', storeUrl: '',
  halal: true, noPork: true, noFish: true, noRice: true, vegLimit: true,
  airfryer: true, breakfastOpts: ['cereales', 'pb', 'oeufs'], breakfastInCart: true
}
