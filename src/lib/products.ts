export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  tags: string[];
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
  sku: string;
  skinConcerns?: string[];
  upsellIds?: string[];
  supplier?: "k-beauty" | "asever" | "upsell";
  brand?: string;
  sourceUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`;

/** Collection preview images — real product CDN (verified) */
const COL_SERUM =
  "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/advanced-snail-96-mucin-power-essence-cosrx-official-4.jpg?v=1763111577";
const COL_CLEANSER =
  "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/low-ph-good-morning-gel-cleanser-cosrx-official-1.jpg?v=1768785801";
const COL_MOISTURISER =
  "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/snail_cream_thumbnail.png?v=1748420673";
const COL_SUNCARE =
  "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/03_0805__-_ROW.jpg?v=1787196277";
const COL_MASK =
  "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/full-fit-propolis-honey-overnight-mask-cosrx-official-1.jpg?v=1724835974";
const COL_SET =
  "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/all-about-snail-kit-4-step-cosrx-official-1.png?v=1724835890";
const SKIN_HERO = img("photo-1570193564026-1f0931c42e36", 1800);
const LIP_UPSELL = img("photo-1586495777744-4413d210b935");
const FRAGRANCE_HERO = img("photo-1541643600914-78b084683601", 1200);
const FRAGRANCE_FLATLAY = img("photo-1595425970387-17a455864234");

/** As Ever supplier imagery (Shopify CDN) */
const AE_CANDLE_519 =
  "https://cdn.shopify.com/s/files/1/0913/9424/4889/files/ae-candle-519-main-1.png?v=1761231790";
const AE_CANDLE_084 =
  "https://cdn.shopify.com/s/files/1/0913/9424/4889/files/ae-candle-084-main-1.png?v=1761232625";
const AE_CANDLE_604 =
  "https://cdn.shopify.com/s/files/1/0913/9424/4889/files/Candle604.png?v=1776718732";
const AE_CANDLE_506 =
  "https://cdn.shopify.com/s/files/1/0913/9424/4889/files/Candle506.png?v=1776718696";
const AE_GARDEN_DUO =
  "https://cdn.shopify.com/s/files/1/0913/9424/4889/files/gardenduo-BUNDLE_7964648d-f140-4969-823b-4c9f18823de1.png?v=1779918364";
const AE_SIGNATURE_COLLECTION =
  "https://cdn.shopify.com/s/files/1/0913/9424/4889/files/signaturescent-BUNDLEpsd_d732c82c-337c-4b0a-9efc-ad254719a342.png?v=1779919269";

/** Demo catalog sourced from official brand stores; pending K-Dropshipping live sync */
export const DEMO_CATALOG_SOURCE =
  "Official K-beauty brand catalogs (COSRX, Beauty of Joseon, SKIN1004, Anua) — to be fulfilled via K-Dropshipping";

const COSRX = "https://www.cosrx.com/products";
const BOJ = "https://beautyofjoseon.com/products";
const S1004 = "https://skin1004.com/products";
const ANUA = "https://anua.us/products";

export const collections: Collection[] = [
  {
    id: "fragrance",
    slug: "fragrance",
    name: "Fragrances",
    description: "Signature candles & scent collections by As Ever",
    image: FRAGRANCE_HERO,
  },
  {
    id: "serums",
    slug: "serums",
    name: "Serums & Essences",
    description: "Snail mucin, centella, propolis — the heart of K-beauty",
    image: COL_SERUM,
  },
  {
    id: "cleansers",
    slug: "cleansers",
    name: "Cleansers",
    description: "Gentle low-pH formulas for every skin type",
    image: COL_CLEANSER,
  },
  {
    id: "moisturisers",
    slug: "moisturisers",
    name: "Moisturisers",
    description: "Glass-skin hydration with Korean botanicals",
    image: COL_MOISTURISER,
  },
  {
    id: "suncare",
    slug: "suncare",
    name: "Sun Care",
    description: "Weightless SPF protection, no white cast",
    image: COL_SUNCARE,
  },
  {
    id: "masks",
    slug: "masks",
    name: "Masks & Treatments",
    description: "Overnight masks and weekly skin resets",
    image: COL_MASK,
  },
  {
    id: "sets",
    slug: "sets",
    name: "K-Beauty Sets",
    description: "Curated routines for radiant, healthy skin",
    image: COL_SET,
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "snail-mucin-96-essence",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    description: "Lightweight essence with 96% snail secretion filtrate for deep hydration",
    longDescription:
      "The New York Post Most Wanted 2024 award-winning essence with 96% snail secretion filtrate. Strengthens the skin barrier, delivers deep hydration, and leaves skin plump and dewy without stickiness. A global K-beauty bestseller.",
    price: 449,
    compareAtPrice: 549,
    category: "serums",
    tags: ["bestseller", "snail", "essence", "k-beauty"],
    image:
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/advanced-snail-96-mucin-power-essence-cosrx-official-4.jpg?v=1763111577",
    images: [
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/advanced-snail-96-mucin-power-essence-cosrx-official-4.jpg?v=1763111577",
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/advanced-snail-96-mucin-power-essence-cosrx-official-1.jpg?v=1763111577",
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/advanced-snail-96-mucin-power-essence-cosrx-official-2.jpg?v=1763111577",
    ],
    rating: 4.9,
    reviewCount: 87432,
    badge: "Bestseller",
    inStock: true,
    sku: "KB-COS-SNAIL96",
    skinConcerns: ["dryness", "dehydration", "texture", "dullness"],
    upsellIds: ["3", "6"],
    supplier: "k-beauty",
    sourceUrl: `${COSRX}/advanced-snail-96-mucin-power-essence`,
  },
  {
    id: "2",
    slug: "glow-serum-propolis-niacinamide",
    name: "Glow Serum — Propolis + Niacinamide",
    brand: "Beauty of Joseon",
    description: "Niacinamide & propolis serum for pore care, hydration, and glass-skin glow",
    longDescription:
      "A cushiony smoothing serum with niacinamide and propolis extract that helps refine pores, hydrate, and calm the skin for a glassy glow. Lightweight Hanbang-inspired formula — a viral K-beauty staple.",
    price: 279,
    compareAtPrice: 349,
    category: "serums",
    tags: ["glass-skin", "niacinamide", "brightening"],
    image:
      "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/glow-serum-propolis-niacinamide-1-front.webp?v=1770278801",
    images: [
      "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/glow-serum-propolis-niacinamide-1-front.webp?v=1770278801",
      "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/glow-serum-propolis-niacinamide-2-texture.webp?v=1770278801",
    ],
    rating: 4.8,
    reviewCount: 42180,
    badge: "Staff Pick",
    inStock: true,
    sku: "KB-BOJ-GLOW",
    skinConcerns: ["dullness", "dark-spots", "uneven-tone"],
    upsellIds: ["5", "7"],
    supplier: "k-beauty",
    sourceUrl: `${BOJ}/glow-serum-propolis-niacinamide`,
  },
  {
    id: "3",
    slug: "low-ph-good-morning-cleanser",
    name: "Low pH Good Morning Gel Cleanser",
    brand: "COSRX",
    description: "Gentle gel cleanser that balances skin without stripping",
    longDescription:
      "Gentle gel cleanser with a mildly acidic pH that refines skin texture without stripping. Wakes skin up to a firmer, balanced feel — ideal for all skin types as a daily morning or second cleanse.",
    price: 219,
    category: "cleansers",
    tags: ["cleanser", "gentle", "daily"],
    image:
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/low-ph-good-morning-gel-cleanser-cosrx-official-1.jpg?v=1768785801",
    images: [
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/low-ph-good-morning-gel-cleanser-cosrx-official-1.jpg?v=1768785801",
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/low-ph-good-morning-gel-cleanser-cosrx-official-2.jpg?v=1768785801",
    ],
    rating: 4.7,
    reviewCount: 38940,
    inStock: true,
    sku: "KB-COS-CLEAN",
    skinConcerns: ["sensitivity", "large-pores", "texture"],
    upsellIds: ["1"],
    supplier: "k-beauty",
    sourceUrl: `${COSRX}/low-ph-good-morning-gel-cleanser`,
  },
  {
    id: "4",
    slug: "madagascar-centella-ampoule",
    name: "Madagascar Centella Ampoule",
    brand: "SKIN1004",
    description: "100% centella asiatica extract for calm, soothed skin",
    longDescription:
      "An all-rounder ampoule with high-quality Madagascan Centella Asiatica extract. Soothes visible redness, comforts sensitive skin, and strengthens the barrier — single-ingredient simplicity trusted worldwide.",
    price: 379,
    compareAtPrice: 449,
    category: "serums",
    tags: ["centella", "soothing", "ampoule"],
    image:
      "https://cdn.shopify.com/s/files/1/0590/4538/0253/files/skin1004-ampoule-serum-centella-ampoule-1253199402.jpg?v=1786012992",
    images: [
      "https://cdn.shopify.com/s/files/1/0590/4538/0253/files/skin1004-ampoule-serum-centella-ampoule-1253199402.jpg?v=1786012992",
      "https://cdn.shopify.com/s/files/1/0590/4538/0253/files/skin1004-ampoule-serum-centella-ampoule-1253199403.jpg?v=1786012992",
    ],
    rating: 4.9,
    reviewCount: 28450,
    badge: "Calming",
    inStock: true,
    sku: "KB-S1004-CENT",
    skinConcerns: ["sensitivity", "redness", "dehydration"],
    upsellIds: ["3", "6"],
    supplier: "k-beauty",
    sourceUrl: `${S1004}/skin1004-madagascar-centella-ampoule`,
  },
  {
    id: "5",
    slug: "relief-sun-rice-probiotics-spf50",
    name: "Relief Sun : Rice + Niacinamide (SPF50+ PA++++)",
    brand: "Beauty of Joseon",
    description: "Organic rice & probiotic sunscreen — no white cast on all skin tones",
    longDescription:
      "Viral K-beauty sunscreen infused with rice bran extract and probiotics. Broad-spectrum SPF50+ PA++++ protection with a lightweight, dewy finish — feels like a moisturiser, works like a shield.",
    price: 349,
    compareAtPrice: 429,
    category: "suncare",
    tags: ["spf", "sunscreen", "daily"],
    image:
      "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/03_0805__-_ROW.jpg?v=1787196277",
    images: [
      "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/03_0805__-_ROW.jpg?v=1787196277",
      "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/04_0805__-_ROW.jpg?v=1787196277",
    ],
    rating: 4.8,
    reviewCount: 56210,
    badge: "Viral",
    inStock: true,
    sku: "KB-BOJ-SUN",
    skinConcerns: ["dullness", "dryness", "uneven-tone"],
    upsellIds: ["2"],
    supplier: "k-beauty",
    sourceUrl: `${BOJ}/relief-sun-rice-probiotics`,
  },
  {
    id: "6",
    slug: "advanced-snail-92-cream",
    name: "Advanced Snail 92 All in One Cream",
    brand: "COSRX",
    description: "92% snail mucin cream for elasticity, repair, and deep hydration",
    longDescription:
      "K-beauty favourite cream with 92% snail mucin to repair stressed skin barriers and boost elasticity. Rich yet fast-absorbing — plumps fine lines and locks in moisture for all skin types.",
    price: 479,
    category: "moisturisers",
    tags: ["snail", "moisturiser", "barrier"],
    image:
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/snail_cream_thumbnail.png?v=1748420673",
    images: [
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/snail_cream_thumbnail.png?v=1748420673",
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/advanced-snail-92-all-in-one-cream-cosrx-official-1.jpg?v=1724835644",
    ],
    rating: 4.8,
    reviewCount: 31280,
    inStock: true,
    sku: "KB-COS-SNAIL92",
    skinConcerns: ["dryness", "dehydration", "fine-lines"],
    upsellIds: ["1", "5"],
    supplier: "k-beauty",
    sourceUrl: `${COSRX}/advanced-snail-92-all-in-one-cream`,
  },
  {
    id: "7",
    slug: "heartleaf-77-soothing-toner",
    name: "Heartleaf 77% Soothing Toner",
    brand: "Anua",
    description: "Heartleaf extract toner for oily and combination skin",
    longDescription:
      "#1 bestselling facial toner on Amazon. Formulated with 77% heartleaf extract to calm irritation, control sebum, and prep skin for serums. Watery, refreshing texture — a K-beauty community favourite.",
    price: 429,
    compareAtPrice: 499,
    category: "toners",
    tags: ["toner", "heartleaf", "pore-care"],
    image:
      "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-toner-heartleaf-77-soothing-toner-1239193744.jpg?v=1779181932",
    images: [
      "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-toner-heartleaf-77-soothing-toner-1239193744.jpg?v=1779181932",
    ],
    rating: 4.8,
    reviewCount: 44820,
    badge: "New",
    inStock: true,
    sku: "KB-ANUA-TONER",
    skinConcerns: ["large-pores", "texture", "sensitivity"],
    upsellIds: ["4"],
    supplier: "k-beauty",
    sourceUrl: `${ANUA}/heartleaf-77-soothing-toner`,
  },
  {
    id: "8",
    slug: "propolis-honey-overnight-mask",
    name: "Full Fit Propolis Honey Overnight Mask",
    brand: "COSRX",
    description: "Overnight propolis & honey mask — 3-in-1 hydrate, cream, or wash-off",
    longDescription:
      "Enriched with 70%+ propolis extract and natural beeswax. Use as an overnight mask, daily cream, or wash-off treatment for intense hydration and a honey-glow finish by morning.",
    price: 349,
    compareAtPrice: 429,
    category: "masks",
    tags: ["mask", "overnight", "propolis"],
    image:
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/full-fit-propolis-honey-overnight-mask-cosrx-official-1.jpg?v=1724835974",
    images: [
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/full-fit-propolis-honey-overnight-mask-cosrx-official-1.jpg?v=1724835974",
    ],
    rating: 4.9,
    reviewCount: 18420,
    inStock: true,
    sku: "KB-COS-MASK",
    skinConcerns: ["dryness", "dullness", "dehydration"],
    upsellIds: ["6"],
    supplier: "k-beauty",
    sourceUrl: `${COSRX}/full-fit-propolis-honey-overnight-mask`,
  },
  {
    id: "9",
    slug: "aha-bha-clarifying-toner",
    name: "AHA/BHA Clarifying Treatment Toner",
    brand: "COSRX",
    description: "Daily exfoliating toner with AHA, BHA & botanicals for clear skin",
    longDescription:
      "Formulated with AHA, BHA, and purifying botanical ingredients to improve skin clarity, refine texture, and prevent breakouts. Gentle enough for regular use — a K-beauty exfoliation essential.",
    price: 229,
    category: "toners",
    tags: ["exfoliating", "aha", "bha"],
    image:
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/ahabha-clarifying-treatment-toner-cosrx-official-1.jpg?v=1724835581",
    images: [
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/ahabha-clarifying-treatment-toner-cosrx-official-1.jpg?v=1724835581",
    ],
    rating: 4.6,
    reviewCount: 22140,
    inStock: true,
    sku: "KB-COS-TONER",
    skinConcerns: ["texture", "large-pores", "dark-spots"],
    upsellIds: ["4", "3"],
    supplier: "k-beauty",
    sourceUrl: `${COSRX}/aha-bha-clarifying-treatment-toner`,
  },
  {
    id: "10",
    slug: "all-about-snail-kit",
    name: "All About Snail Kit (4-Step)",
    brand: "COSRX",
    description: "COSRX's 4-step snail mucin trial kit — cleanse, treat, moisturise, protect",
    longDescription:
      "COSRX's most-loved 4-step Advanced Snail trial kit. Everything needed to start a snail mucin routine: cleanser, essence, cream, and SPF — full-size essentials for visible results in weeks.",
    price: 899,
    compareAtPrice: 1099,
    category: "sets",
    tags: ["set", "starter", "gift", "snail"],
    image:
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/all-about-snail-kit-4-step-cosrx-official-1.png?v=1724835890",
    images: [
      "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/all-about-snail-kit-4-step-cosrx-official-1.png?v=1724835890",
    ],
    rating: 4.9,
    reviewCount: 6840,
    badge: "Gift Set",
    inStock: true,
    sku: "LB-SET-SNAIL",
    skinConcerns: ["dryness", "dullness", "uneven-tone", "dehydration"],
    upsellIds: ["11"],
    supplier: "k-beauty",
    sourceUrl: `${COSRX}/all-about-snail-kit-4-step`,
  },
  {
    id: "11",
    slug: "hydrating-lip-balm-upsell",
    name: "Hydrating Lip Sleeping Mask",
    brand: "Laneige",
    description: "Overnight lip mask — the perfect finish to your skincare routine",
    longDescription:
      "Berry-enriched overnight lip mask that deeply hydrates and repairs dry, cracked lips while you sleep. A beloved K-beauty add-on to any skincare routine.",
    price: 349,
    category: "lips",
    tags: ["lip-care", "upsell"],
    image: LIP_UPSELL,
    images: [LIP_UPSELL],
    rating: 4.8,
    reviewCount: 15420,
    inStock: true,
    sku: "KB-LAN-LIP",
    skinConcerns: ["dry-lips"],
    supplier: "upsell",
  },
  {
    id: "12",
    slug: "matte-lip-kit-upsell",
    name: "Matte Lip Kit",
    brand: "Kylie Cosmetics",
    description: "Complete your look — iconic matte lip liner and liquid lip",
    longDescription:
      "After perfecting your skin, finish with a full-coverage matte lip. Includes precision lip liner and long-wearing liquid lip for sculpted, everyday definition.",
    price: 449,
    compareAtPrice: 549,
    category: "lips",
    tags: ["makeup", "upsell", "matte"],
    image: LIP_UPSELL,
    images: [LIP_UPSELL],
    rating: 4.7,
    reviewCount: 5201,
    inStock: true,
    sku: "UP-KY-LIP",
    skinConcerns: ["dry-lips"],
    supplier: "upsell",
  },
  {
    id: "13",
    slug: "signature-candle-519",
    name: "Signature Candle No. 519",
    brand: "As Ever",
    description: "Moroccan mint, cardamom & tea leaves — warm, uplifting home scent",
    longDescription:
      "An As Ever signature home fragrance with notes of Moroccan mint, cardamom, and tea leaves. Hand-poured for a clean, even burn and a scent that fills the room without overwhelming. Perfect beside your skincare ritual or evening wind-down.",
    price: 899,
    compareAtPrice: 1099,
    category: "fragrance",
    tags: ["candle", "home-fragrance", "signature"],
    image: AE_CANDLE_519,
    images: [AE_CANDLE_519, FRAGRANCE_HERO],
    rating: 4.9,
    reviewCount: 3842,
    badge: "Bestseller",
    inStock: true,
    sku: "AE-CND-519",
    upsellIds: ["15"],
    supplier: "asever",
  },
  {
    id: "14",
    slug: "signature-candle-084",
    name: "Signature Candle No. 084",
    brand: "As Ever",
    description: "Water lotus, sandalwood & California poppy — soft floral serenity",
    longDescription:
      "A calming floral blend of water lotus, sandalwood, and California poppy. Creates a spa-like atmosphere at home — ideal for self-care evenings after your K-beauty routine.",
    price: 899,
    category: "fragrance",
    tags: ["candle", "floral", "home-fragrance"],
    image: AE_CANDLE_084,
    images: [AE_CANDLE_084, FRAGRANCE_FLATLAY],
    rating: 4.8,
    reviewCount: 2917,
    inStock: true,
    sku: "AE-CND-084",
    upsellIds: ["13"],
    supplier: "asever",
  },
  {
    id: "15",
    slug: "signature-candle-604",
    name: "Signature Candle No. 604",
    brand: "As Ever",
    description: "Rich, layered home fragrance from the As Ever signature line",
    longDescription:
      "One of As Ever's most-loved signature candles — a complex, warm scent profile designed to transform any room. Long burn time, premium wax blend, and elegant glass vessel.",
    price: 899,
    category: "fragrance",
    tags: ["candle", "signature", "home-fragrance"],
    image: AE_CANDLE_604,
    images: [AE_CANDLE_604, AE_CANDLE_506],
    rating: 4.8,
    reviewCount: 2104,
    inStock: true,
    sku: "AE-CND-604",
    supplier: "asever",
  },
  {
    id: "16",
    slug: "signature-candle-506",
    name: "Signature Candle No. 506",
    brand: "As Ever",
    description: "Warm botanical notes — an everyday luxury for your home",
    longDescription:
      "Signature Candle No. 506 delivers a sophisticated botanical fragrance that pairs beautifully with a calm, curated home. From the same supplier collection trusted by As Ever customers worldwide.",
    price: 899,
    category: "fragrance",
    tags: ["candle", "botanical", "home-fragrance"],
    image: AE_CANDLE_506,
    images: [AE_CANDLE_506, AE_CANDLE_604],
    rating: 4.7,
    reviewCount: 1876,
    inStock: true,
    sku: "AE-CND-506",
    supplier: "asever",
  },
  {
    id: "17",
    slug: "the-garden-duo",
    name: "The Garden Duo",
    brand: "As Ever",
    description: "Two complementary signature scents — the perfect fragrance gift set",
    longDescription:
      "A curated duo of As Ever signature home fragrances. Layer two scents throughout your space or gift the set to someone who loves elevated everyday rituals. Save compared to buying separately.",
    price: 1699,
    compareAtPrice: 1999,
    category: "fragrance",
    tags: ["set", "gift", "duo"],
    image: AE_GARDEN_DUO,
    images: [AE_GARDEN_DUO, AE_SIGNATURE_COLLECTION],
    rating: 4.9,
    reviewCount: 1243,
    badge: "Gift Set",
    inStock: true,
    sku: "AE-SET-GARDEN",
    upsellIds: ["13", "14"],
    supplier: "asever",
  },
  {
    id: "18",
    slug: "signature-scent-collection",
    name: "The Signature Scent Collection",
    brand: "As Ever",
    description: "The complete As Ever fragrance collection — our hero scent edit",
    longDescription:
      "The full Signature Scent Collection from As Ever — every candle in one beautifully packaged set. The ultimate home fragrance investment and our most popular gift for clients who love skincare and scent together.",
    price: 3299,
    compareAtPrice: 3999,
    category: "fragrance",
    tags: ["collection", "gift", "signature"],
    image: AE_SIGNATURE_COLLECTION,
    images: [AE_SIGNATURE_COLLECTION, AE_GARDEN_DUO],
    rating: 5.0,
    reviewCount: 892,
    badge: "Collection",
    inStock: true,
    sku: "AE-SET-SIG",
    upsellIds: ["10"],
    supplier: "asever",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    author: "Thandi M.",
    location: "Johannesburg, SA",
    rating: 5,
    title: "Holy grail essence",
    body: "This snail mucin essence is literally a holy grail. My skin went from dull and flaky to plump and glowing in two weeks. Absorbs instantly, no sticky feeling. Already on my third bottle.",
    date: "2026-02-15",
    verified: true,
  },
  {
    id: "r2",
    productId: "1",
    author: "Jessica K.",
    location: "Cape Town, SA",
    rating: 5,
    title: "Best K-beauty purchase ever",
    body: "I was sceptical about snail mucin but this changed everything. Repairs my barrier after breakouts and keeps my skin hydrated all day in Cape Town's dry wind.",
    date: "2026-01-28",
    verified: true,
  },
  {
    id: "r3",
    productId: "2",
    author: "Nomsa K.",
    location: "Durban, SA",
    rating: 5,
    title: "Glass skin is real",
    body: "The propolis glow is no joke. My dark spots have faded noticeably and my skin has that dewy Korean glass skin look. Use it every morning before SPF.",
    date: "2026-02-03",
    verified: true,
  },
  {
    id: "r4",
    productId: "2",
    author: "Emily R.",
    location: "Pretoria, SA",
    rating: 5,
    title: "Worth every rand",
    body: "Lightweight, no pilling under makeup, and my complexion looks brighter after 10 days. This is what K-beauty is all about.",
    date: "2026-02-18",
    verified: true,
  },
  {
    id: "r5",
    productId: "3",
    author: "Lerato T.",
    location: "Sandton, SA",
    rating: 5,
    title: "Gentle but effective",
    body: "Finally a cleanser that doesn't strip my skin. Low pH makes a huge difference — my skin feels balanced and never tight after washing.",
    date: "2026-02-10",
    verified: true,
  },
  {
    id: "r6",
    productId: "4",
    author: "Aisha N.",
    location: "Johannesburg, SA",
    rating: 5,
    title: "Saved my sensitive skin",
    body: "Centella ampoule calmed my redness within days. Single ingredient, no fragrance, no irritation. Perfect for post-treatment recovery.",
    date: "2026-01-20",
    verified: true,
  },
  {
    id: "r7",
    productId: "5",
    author: "Zanele M.",
    location: "Cape Town, SA",
    rating: 5,
    title: "No white cast — finally!",
    body: "As a dark-skinned woman I've struggled with sunscreen my whole life. This Beauty of Joseon SPF leaves zero white cast and feels like a moisturiser. Game changer.",
    date: "2026-02-08",
    verified: true,
  },
  {
    id: "r8",
    productId: "5",
    author: "Sarah L.",
    location: "Stellenbosch, SA",
    rating: 5,
    title: "The viral SPF lives up to the hype",
    body: "Dewy finish, no greasiness, protects all day. I reapply over makeup with no issues. Best SPF I've used from any brand worldwide.",
    date: "2026-02-22",
    verified: true,
  },
  {
    id: "r9",
    productId: "7",
    author: "Emma W.",
    location: "Pretoria, SA",
    rating: 5,
    title: "Pores visibly smaller",
    body: "Heartleaf toner is magic for oily T-zone. Pores look smaller, less shine throughout the day. The texture is so watery and refreshing.",
    date: "2026-02-12",
    verified: true,
  },
  {
    id: "r10",
    productId: "8",
    author: "Olivia P.",
    location: "Durban, SA",
    rating: 5,
    title: "Wake up glowing",
    body: "Laneige sleeping mask is iconic for a reason. I use it twice a week and wake up with the softest, most hydrated skin. Worth every cent.",
    date: "2026-01-15",
    verified: true,
  },
  {
    id: "r11",
    productId: "9",
    author: "Mia T.",
    location: "Johannesburg, SA",
    rating: 5,
    title: "Cleared my texture in 30 days",
    body: "The 30-day miracle toner actually delivered. My forehead bumps are gone and skin is smoother than it's been in years. Gentle enough for daily use.",
    date: "2026-02-05",
    verified: true,
  },
  {
    id: "r12",
    productId: "10",
    author: "Jessica L.",
    location: "Sandton, SA",
    rating: 5,
    title: "Perfect starter kit",
    body: "Bought this for my mom who is new to skincare. The 4-step routine is simple and she saw results in 3 weeks. Beautiful packaging too — perfect gift.",
    date: "2026-02-18",
    verified: true,
  },
  {
    id: "r13",
    productId: "6",
    author: "Charlotte B.",
    location: "Cape Town, SA",
    rating: 5,
    title: "Deep hydration without heaviness",
    body: "Eight types of hyaluronic acid sounds like marketing but this cream genuinely plumps my skin. Not greasy, layers well under SPF.",
    date: "2026-02-01",
    verified: true,
  },
  {
    id: "r14",
    productId: "13",
    author: "Priya S.",
    location: "Johannesburg, SA",
    rating: 5,
    title: "My whole apartment smells incredible",
    body: "The Moroccan mint candle is unlike anything I've bought locally. Burns evenly for weeks and the scent is fresh but warm. I light it every evening after my skincare routine.",
    date: "2026-02-20",
    verified: true,
  },
  {
    id: "r15",
    productId: "13",
    author: "Karen D.",
    location: "Cape Town, SA",
    rating: 5,
    title: "Worth every rand",
    body: "Bought this after seeing As Ever reviews online. The cardamom and tea notes are so sophisticated — guests always ask what fragrance I'm using.",
    date: "2026-01-30",
    verified: true,
  },
  {
    id: "r16",
    productId: "14",
    author: "Michelle F.",
    location: "Durban, SA",
    rating: 5,
    title: "Spa vibes at home",
    body: "Water lotus and sandalwood is the most relaxing combination. I use it on self-care Sundays with my Laneige mask. Pure luxury.",
    date: "2026-02-14",
    verified: true,
  },
  {
    id: "r17",
    productId: "17",
    author: "Rachel G.",
    location: "Pretoria, SA",
    rating: 5,
    title: "Perfect gift set",
    body: "Gave the Garden Duo to my sister — she loved both scents. Beautiful packaging, feels premium, and the price is fair for two full-size candles.",
    date: "2026-02-08",
    verified: true,
  },
  {
    id: "r18",
    productId: "18",
    author: "Amanda H.",
    location: "Sandton, SA",
    rating: 5,
    title: "The full collection is stunning",
    body: "If you love home fragrance, get the Signature Scent Collection. Every candle is distinct and high quality. This is now my go-to gift for clients.",
    date: "2026-02-22",
    verified: true,
  },
];

export const recentPurchases = [
  { name: "Priya", city: "Johannesburg", product: "Signature Candle No. 519", minutesAgo: 8 },
  { name: "Thandi", city: "Johannesburg", product: "Snail Mucin 96 Essence", minutesAgo: 3 },
  { name: "Nomsa", city: "Cape Town", product: "Glow Serum Propolis + Niacinamide", minutesAgo: 6 },
  { name: "Lerato", city: "Pretoria", product: "Relief Sun SPF50+", minutesAgo: 11 },
  { name: "Aisha", city: "Durban", product: "Centella Ampoule", minutesAgo: 17 },
  { name: "Zanele", city: "Sandton", product: "All About Snail Kit", minutesAgo: 23 },
  { name: "Emma", city: "Stellenbosch", product: "Heartleaf 77% Toner", minutesAgo: 29 },
];

export { SKIN_HERO, FRAGRANCE_HERO };

export function getFragranceProducts() {
  return products.filter((p) => p.supplier === "asever");
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function getUpsellProducts(product: Product) {
  if (!product.upsellIds) return [];
  return product.upsellIds
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[];
}

export function getBestsellers() {
  return products
    .filter((p) => p.supplier === "k-beauty")
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);
}

export function getProductsForSkinConcerns(concerns: string[]) {
  if (concerns.length === 0) {
    return products.filter((p) => p.supplier === "k-beauty").slice(0, 4);
  }
  return products
    .filter((p) => p.skinConcerns?.some((c) => concerns.includes(c)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}

export function getSkincareProducts() {
  return products.filter((p) => p.supplier === "k-beauty");
}

export function getUpsellOnlyProducts() {
  return products.filter((p) => p.supplier === "upsell");
}
