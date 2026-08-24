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
  supplier?: "kylie" | "asever" | "lorraine";
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

export const collections: Collection[] = [
  {
    id: "lips",
    slug: "lips",
    name: "Lips",
    description: "Plumping formulas with a soft, diffused finish",
    image: img("photo-1586495777744-4413d210b935"),
  },
  {
    id: "skincare",
    slug: "skincare",
    name: "Skincare",
    description: "Daily rituals for radiant, healthy skin",
    image: img("photo-1556228720-195a672e8a03"),
  },
  {
    id: "fragrance",
    slug: "fragrance",
    name: "Fragrance",
    description: "Scents inspired by the immersive power of nature",
    image: img("photo-1541643600914-78b084683601"),
  },
  {
    id: "sets",
    slug: "sets",
    name: "Gift Sets",
    description: "Curated collections to bring delight to every day",
    image: img("photo-1596462502278-27bfdc403348"),
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "plumping-matte-lip-kit",
    name: "Plumping Matte Lip Kit",
    description:
      "The iconic lip kit in plumping formulas with a lightweight, matte finish",
    longDescription:
      "Featuring a lip liner and liquid lip, the plumping matte lip kit effortlessly sculpts, blurs, and offers full coverage payoff with a soft, diffused finish. Highly pigmented, long-lasting, and perfect for everyday wear.",
    price: 449,
    compareAtPrice: 599,
    category: "lips",
    tags: ["bestseller", "matte", "plumping"],
    image: img("photo-1586495777744-4413d210b935"),
    images: [
      img("photo-1586495777744-4413d210b935"),
      img("photo-1631214524020-7e146d5d65a9"),
      img("photo-1596462502278-27bfdc403348"),
    ],
    rating: 4.9,
    reviewCount: 3847,
    badge: "Bestseller",
    inStock: true,
    sku: "KY-LIP-PLUMP",
    skinConcerns: ["dry-lips", "fine-lines"],
    upsellIds: ["5", "8"],
    supplier: "kylie",
  },
  {
    id: "2",
    slug: "matte-lip-kit-candy-k",
    name: "Matte Lip Kit — Candy K",
    description: "Iconic matte lip liner and liquid lip in the signature Candy K shade",
    longDescription:
      "Our best-selling matte lip kit includes a precision lip liner and long-wearing liquid lip. Full coverage, velvety matte finish that lasts all day without drying.",
    price: 399,
    compareAtPrice: 499,
    category: "lips",
    tags: ["matte", "iconic"],
    image: img("photo-1631214524020-7e146d5d65a9"),
    images: [
      img("photo-1631214524020-7e146d5d65a9"),
      img("photo-1571781926291-c477eb30eed6"),
    ],
    rating: 4.8,
    reviewCount: 5201,
    badge: "Iconic",
    inStock: true,
    sku: "KY-LIP-MATTE-CK",
    skinConcerns: ["dry-lips"],
    upsellIds: ["8"],
    supplier: "kylie",
  },
  {
    id: "3",
    slug: "glossy-lip-kit",
    name: "Glossy Lip Kit",
    description: "High-shine gloss with matching lip liner for a glossy, full-coverage look",
    longDescription:
      "The glossy lip kit pairs a creamy lip liner with a high-shine gloss formula. Buildable colour with a wet-look finish that keeps lips hydrated and luminous.",
    price: 399,
    category: "lips",
    tags: ["gloss", "hydrating"],
    image: img("photo-1571781926291-c477eb30eed6"),
    images: [img("photo-1571781926291-c477eb30eed6")],
    rating: 4.7,
    reviewCount: 2103,
    inStock: true,
    sku: "KY-LIP-GLOSS",
    skinConcerns: ["dry-lips", "dullness"],
    supplier: "kylie",
  },
  {
    id: "4",
    slug: "glow-vitamin-c-serum",
    name: "Glow Vitamin C Serum",
    description: "Brightening serum for luminous, even-toned skin",
    longDescription:
      "A lightweight, fast-absorbing serum powered by vitamin C, hyaluronic acid, and botanical extracts. Reveals brighter, smoother skin and helps reduce the appearance of dark spots.",
    price: 649,
    compareAtPrice: 799,
    category: "skincare",
    tags: ["serum", "vitamin-c", "brightening"],
    image: img("photo-1620916566568-2440574f5d9c"),
    images: [
      img("photo-1620916566568-2440574f5d9c"),
      img("photo-1556228720-195a672e8a03"),
    ],
    rating: 4.8,
    reviewCount: 1864,
    badge: "Staff Pick",
    inStock: true,
    sku: "LB-SRM-VITC",
    skinConcerns: ["dullness", "dark-spots", "uneven-tone"],
    upsellIds: ["9", "10"],
    supplier: "lorraine",
  },
  {
    id: "5",
    slug: "mood-stones-fragrance-trio",
    name: "Mood Stones Fragrance Trio",
    description: "A new fragrance trio inspired by the immersive power of scent",
    longDescription:
      "The Mood Stones collection features three unique fragrances designed to evoke emotion and memory. Layer them or wear alone for a scent experience that transforms with your mood.",
    price: 1299,
    compareAtPrice: 1599,
    category: "fragrance",
    tags: ["trio", "limited", "luxury"],
    image: img("photo-1541643600914-78b084683601"),
    images: [
      img("photo-1541643600914-78b084683601"),
      img("photo-1592945403244-b3fbafd7f539"),
    ],
    rating: 4.9,
    reviewCount: 934,
    badge: "New",
    inStock: true,
    sku: "KY-FRG-MOOD",
    skinConcerns: [],
    supplier: "kylie",
  },
  {
    id: "6",
    slug: "signature-candle-no-084",
    name: "Signature Candle No. 084",
    description: "Water Lotus, Sandalwood, and California Poppy",
    longDescription:
      "For daily rituals at home. Hand-poured with a complex blend of water lotus, warm sandalwood, and delicate California poppy. 60-hour burn time in a reusable glass vessel.",
    price: 699,
    category: "fragrance",
    tags: ["candle", "home", "ritual"],
    image: img("photo-1602874801006-e29c8f6a1b1e"),
    images: [
      img("photo-1602874801006-e29c8f6a1b1e"),
      img("photo-1608248543801-ba977795e702"),
    ],
    rating: 4.9,
    reviewCount: 892,
    inStock: true,
    sku: "AE-CND-084",
    skinConcerns: [],
    upsellIds: ["7"],
    supplier: "asever",
  },
  {
    id: "7",
    slug: "when-the-day-slows-set",
    name: "When the Day Slows Set",
    description: "Evenings at home, done well — candle, serum, and lip balm trio",
    longDescription:
      "A curated self-care set featuring our Signature Candle No. 084, Glow Vitamin C Serum, and Hydrating Lip Balm. The perfect gift for unwinding rituals.",
    price: 1499,
    compareAtPrice: 1899,
    category: "sets",
    tags: ["gift", "set", "ritual"],
    image: img("photo-1608248543801-ba977795e702"),
    images: [img("photo-1608248543801-ba977795e702")],
    rating: 5.0,
    reviewCount: 412,
    badge: "Gift Set",
    inStock: true,
    sku: "LB-SET-RITUAL",
    skinConcerns: ["dryness", "dullness", "dry-lips"],
    supplier: "lorraine",
  },
  {
    id: "8",
    slug: "hydrating-lip-balm",
    name: "Hydrating Lip Balm",
    description: "Shea butter and honey for all-day moisture and softness",
    longDescription:
      "A nourishing lip balm enriched with shea butter, honey, and vitamin E. Glides on smoothly for instant hydration without stickiness.",
    price: 249,
    category: "lips",
    tags: ["balm", "hydrating"],
    image: img("photo-1571781926291-c477eb30eed6"),
    images: [img("photo-1571781926291-c477eb30eed6")],
    rating: 4.8,
    reviewCount: 3103,
    inStock: true,
    sku: "LB-BLM-HYD",
    skinConcerns: ["dry-lips", "sensitivity"],
    supplier: "lorraine",
  },
  {
    id: "9",
    slug: "berry-blush-trio",
    name: "Berry Blush Trio",
    description: "Sun-ripened berry tones for a natural, buildable flush",
    longDescription:
      "A giftable trio featuring three covetable berry shades. Buildable, blendable formula that melts into skin for a lit-from-within glow.",
    price: 549,
    compareAtPrice: 699,
    category: "skincare",
    tags: ["blush", "trio", "new"],
    image: img("photo-1596462502278-27bfdc403348"),
    images: [
      img("photo-1596462502278-27bfdc403348"),
      img("photo-1571781926291-c477eb30eed6"),
    ],
    rating: 4.8,
    reviewCount: 1203,
    badge: "New",
    inStock: true,
    sku: "AE-BLS-TRIO",
    skinConcerns: ["dullness"],
    upsellIds: ["4"],
    supplier: "asever",
  },
  {
    id: "10",
    slug: "hyaluronic-moisture-cream",
    name: "Hyaluronic Moisture Cream",
    description: "Deep hydration for dry and dehydrated skin",
    longDescription:
      "Rich yet lightweight moisturiser with hyaluronic acid, ceramides, and squalane. Restores moisture barrier and keeps skin plump and supple for 24 hours.",
    price: 599,
    category: "skincare",
    tags: ["moisturiser", "hydrating"],
    image: img("photo-1556228720-195a672e8a03"),
    images: [img("photo-1556228720-195a672e8a03")],
    rating: 4.7,
    reviewCount: 987,
    inStock: true,
    sku: "LB-CRM-HYA",
    skinConcerns: ["dryness", "dehydration", "sensitivity"],
    supplier: "lorraine",
  },
  {
    id: "11",
    slug: "velvet-lip-kit-true-brown",
    name: "Velvet Lip Kit — True Brown K",
    description: "Velvet finish lip kit in the iconic True Brown K shade",
    longDescription:
      "Soft velvet finish with a diffused, blurred effect. Includes lip liner and liquid lip for sculpted, everyday definition.",
    price: 429,
    category: "lips",
    tags: ["velvet", "nude"],
    image: img("photo-1586495777744-4413d210b935"),
    images: [img("photo-1586495777744-4413d210b935")],
    rating: 4.8,
    reviewCount: 1647,
    inStock: true,
    sku: "KY-LIP-VEL-TB",
    skinConcerns: ["dry-lips"],
    supplier: "kylie",
  },
  {
    id: "12",
    slug: "retinol-night-renewal",
    name: "Retinol Night Renewal",
    description: "Overnight renewal treatment for fine lines and texture",
    longDescription:
      "Gentle retinol formula combined with peptides and niacinamide. Works overnight to smooth texture, refine pores, and improve skin elasticity.",
    price: 749,
    compareAtPrice: 899,
    category: "skincare",
    tags: ["retinol", "anti-aging"],
    image: img("photo-1620916566568-2440574f5d9c"),
    images: [img("photo-1620916566568-2440574f5d9c")],
    rating: 4.9,
    reviewCount: 756,
    badge: "Anti-Aging",
    inStock: true,
    sku: "LB-SRM-RET",
    skinConcerns: ["fine-lines", "texture", "large-pores"],
    upsellIds: ["10"],
    supplier: "lorraine",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    author: "Thandi M.",
    location: "Johannesburg, SA",
    rating: 5,
    title: "Absolutely obsessed",
    body: "10 out of 10. The plumping formula is quite literally our new obsession. Lasts all day without drying — perfect for Joburg weather.",
    date: "2026-02-15",
    verified: true,
  },
  {
    id: "r2",
    productId: "4",
    author: "Nomsa K.",
    location: "Cape Town, SA",
    rating: 5,
    title: "Visible glow in 2 weeks",
    body: "My skin has never looked this radiant. The glow is real — friends keep asking what I'm using.",
    date: "2026-02-03",
    verified: true,
  },
  {
    id: "r3",
    productId: "6",
    author: "Olivia R.",
    location: "London, UK",
    rating: 5,
    title: "One of the stars of the collection",
    body: "The scent is grounding yet uplifting. Burns evenly and fills the entire room beautifully.",
    date: "2026-01-28",
    verified: true,
  },
  {
    id: "r4",
    productId: "5",
    author: "Lerato T.",
    location: "Pretoria, SA",
    rating: 5,
    title: "Compliments everywhere",
    body: "The Mood Stones trio is intoxicating. I get stopped constantly and asked what I'm wearing.",
    date: "2026-02-10",
    verified: true,
  },
  {
    id: "r5",
    productId: "7",
    author: "Jessica L.",
    location: "Durban, SA",
    rating: 5,
    title: "Perfect gift",
    body: "Always show up with something sweet — this set is beautifully packaged and feels so luxurious.",
    date: "2026-02-18",
    verified: true,
  },
  {
    id: "r6",
    productId: "2",
    author: "Sarah M.",
    location: "Sandton, SA",
    rating: 5,
    title: "Candy K is iconic",
    body: "The best lip kit I ever tried. Candy K suits every skin tone — I'm stocking up.",
    date: "2026-01-20",
    verified: true,
  },
  {
    id: "r7",
    productId: "9",
    author: "Emma W.",
    location: "Stellenbosch, SA",
    rating: 5,
    title: "Sun-ripened perfection",
    body: "Sun-ripened berry sweetness on the cheeks. Blends like a dream.",
    date: "2026-02-08",
    verified: true,
  },
];

export const recentPurchases = [
  { name: "Thandi", city: "Johannesburg", product: "Plumping Matte Lip Kit", minutesAgo: 3 },
  { name: "Nomsa", city: "Cape Town", product: "Glow Vitamin C Serum", minutesAgo: 7 },
  { name: "Lerato", city: "Pretoria", product: "Mood Stones Fragrance Trio", minutesAgo: 12 },
  { name: "Aisha", city: "Durban", product: "Berry Blush Trio", minutesAgo: 18 },
  { name: "Zanele", city: "Sandton", product: "When the Day Slows Set", minutesAgo: 24 },
  { name: "Emma", city: "Stellenbosch", product: "Matte Lip Kit — Candy K", minutesAgo: 31 },
];

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
  return products.filter((p) => p.badge === "Bestseller" || p.reviewCount > 1500);
}

export function getProductsForSkinConcerns(concerns: string[]) {
  if (concerns.length === 0) return products.filter((p) => p.category === "skincare").slice(0, 4);
  return products
    .filter((p) => p.skinConcerns?.some((c) => concerns.includes(c)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}
