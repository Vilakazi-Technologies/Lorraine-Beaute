import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mirrors inferSkinConcerns in map-product.ts for offline catalog refresh.
function inferSkinConcerns(name, category) {
  const n = name.toLowerCase();
  const concerns = new Set();
  if (n.includes("lip") || n.includes("plumper")) concerns.add("dry-lips");
  if (n.includes("sun") || n.includes("spf") || n.includes("relief sun")) {
    concerns.add("uneven-tone");
    concerns.add("sensitivity");
    concerns.add("fine-lines");
  }
  if (n.includes("pore") || n.includes("red bean")) {
    concerns.add("large-pores");
    concerns.add("texture");
  }
  if (
    (n.includes("glow") &&
      (n.includes("serum") || n.includes("niacinamide") || n.includes("propolis"))) ||
    n.includes("glow serum")
  ) {
    concerns.add("dullness");
    concerns.add("dark-spots");
    concerns.add("uneven-tone");
  }
  if (n.includes("retinal") || (n.includes("under eye") && n.includes("patch"))) {
    concerns.add("fine-lines");
    concerns.add("dark-spots");
    concerns.add("dehydration");
  }
  if (n.includes("green plum") && n.includes("toner")) {
    concerns.add("texture");
    concerns.add("dullness");
    concerns.add("large-pores");
  }
  if (n.includes("rice") && n.includes("honey")) {
    concerns.add("dullness");
    concerns.add("texture");
    concerns.add("uneven-tone");
  }
  if (n.includes("water bank") || n.includes("hyaluronic") || n.includes("cream skin")) {
    concerns.add("dehydration");
    concerns.add("dryness");
  }
  if (n.includes("intensive cream")) concerns.add("fine-lines");
  if (n.includes("cushion")) {
    concerns.add("uneven-tone");
    concerns.add("dullness");
  }
  if (n.includes("homme")) {
    concerns.add("dehydration");
    concerns.add("texture");
  }
  if (n.includes("discovery kit") || n.includes("hanbang")) {
    concerns.add("dullness");
    concerns.add("uneven-tone");
    concerns.add("texture");
  }
  if (n.includes("blueha") || (n.includes("serum") && n.includes("laneige"))) {
    concerns.add("dehydration");
    concerns.add("dullness");
  }
  if (n.includes("ginseng") && n.includes("sun")) {
    concerns.add("fine-lines");
    concerns.add("dehydration");
    concerns.add("uneven-tone");
  }
  if (concerns.size > 0) return [...concerns];
  switch (category) {
    case "suncare":
      return ["uneven-tone", "sensitivity", "fine-lines"];
    case "masks":
      return ["dullness", "texture", "dehydration"];
    case "moisturisers":
      return ["dehydration", "dryness", "fine-lines"];
    case "serums":
      return ["dullness", "uneven-tone", "texture"];
    case "toners":
      return ["texture", "large-pores", "dullness"];
    case "lips":
      return ["dry-lips", "dehydration"];
    default:
      return ["dullness", "dehydration"];
  }
}

const catalogPath = path.join(__dirname, "../src/data/synced-catalog.json");
const data = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
for (const p of data.products) {
  p.skinConcerns = inferSkinConcerns(p.name, p.category);
}
fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2) + "\n");
console.log("Updated skinConcerns for", data.products.length, "products");
