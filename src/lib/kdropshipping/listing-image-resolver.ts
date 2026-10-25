/**
 * Distinct product images from listing name + brand (CSV has no image column).
 * Uses official brand CDN URLs where available; category fallbacks otherwise.
 */
const BOJ = "https://cdn.shopify.com/s/files/1/0558/4135/7989/files";
const COSRX = "https://cdn.shopify.com/s/files/1/0513/3775/6828/files";
const LANEIGE = BOJ;

const RULES: { test: RegExp; image: string }[] = [
  {
    test: /relief sun|ginseng moist sun/i,
    image: `${BOJ}/03_0805__-_ROW.jpg?v=1787196277`,
  },
  {
    test: /glow serum|propolis\+niacinamide/i,
    image: `${BOJ}/glow-serum-propolis-niacinamide-1-front.webp?v=1770278801`,
  },
  {
    test: /green plum|refreshing toner/i,
    image: `${BOJ}/green-plum-refreshing-toner-1-front.webp?v=1770278801`,
  },
  {
    test: /ground rice|honey glow mask/i,
    image: `${BOJ}/ground-rice-and-honey-glow-mask-1-front.webp?v=1770278801`,
  },
  {
    test: /red bean|pore firming serum/i,
    image: `${BOJ}/red-bean-pore-firming-serum-1-front.webp?v=1770278801`,
  },
  {
    test: /under eye patch|retinal/i,
    image: `${BOJ}/revive-eye-patch-1-front.webp?v=1770278801`,
  },
  {
    test: /hanbang serum discovery|discovery kit/i,
    image: `${BOJ}/hanbang-serum-discovery-kit-1-front.webp?v=1770278801`,
  },
  {
    test: /lip sleeping mask/i,
    image: `${LANEIGE}/04_0805__-_ROW.jpg?v=1787196277`,
  },
  {
    test: /lip plumper|flush pop/i,
    image: `${LANEIGE}/glow-serum-propolis-niacinamide-2-texture.webp?v=1770278801`,
  },
  {
    test: /neo cushion|cushion the glow/i,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80",
  },
  {
    test: /cream skin/i,
    image: "https://images.unsplash.com/photo-1620916564558-4219884f7892?w=800&q=80",
  },
  {
    test: /water bank.*serum|blueha serum/i,
    image: `${COSRX}/advanced-snail-96-mucin-power-essence-cosrx-official-1.jpg?v=1763111577`,
  },
  {
    test: /water bank.*cream|hyaluronic.*cream|moisture cream/i,
    image: `${COSRX}/advanced-snail-92-all-in-one-cream-cosrx-official-1.jpg?v=1724835644`,
  },
  {
    test: /homme.*toner|active water skin toner|blue energy skin toner/i,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
  },
  {
    test: /homme.*moisturizer|active water moisturizer/i,
    image: "https://images.unsplash.com/photo-1570193564026-1f0931c42e36?w=800&q=80",
  },
  {
    test: /homme.*duo|duo set/i,
    image: `${COSRX}/all-about-snail-kit-4-step-cosrx-official-1.png?v=1724835890`,
  },
  {
    test: /special set|double pack|\+/i,
    image: `${BOJ}/04_0805__-_ROW.jpg?v=1787196277`,
  },
];

const BRAND_DEFAULT: Record<string, string> = {
  laneige: `${LANEIGE}/03_0805__-_ROW.jpg?v=1787196277`,
  "beauty of joseon": `${BOJ}/glow-serum-propolis-niacinamide-1-front.webp?v=1770278801`,
};

const FALLBACK =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80";

export function resolveListingImage(productName: string, brand: string): string {
  const name = productName.trim();
  for (const { test, image } of RULES) {
    if (test.test(name)) return image;
  }
  const key = brand.toLowerCase();
  for (const [k, url] of Object.entries(BRAND_DEFAULT)) {
    if (key.includes(k)) return url;
  }
  return FALLBACK;
}
