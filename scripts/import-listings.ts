/**
 * Import K-Dropshipping listings CSV → src/data/synced-catalog.json
 * Usage: npx tsx scripts/import-listings.ts [path-to.csv]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { listingsCsvToProducts } from "../src/lib/kdropshipping/parse-listings-csv";

const csvPath =
  process.argv[2] ??
  path.join(process.env.USERPROFILE ?? "", "Downloads", "listings_LT-261007-4816_25486e4f.csv");

const csv = readFileSync(csvPath, "utf-8");
const products = listingsCsvToProducts(csv);

const outDir = path.join(process.cwd(), "src", "data");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const payload = {
  updatedAt: new Date().toISOString(),
  source: "k-dropshipping-csv",
  products,
};

writeFileSync(path.join(outDir, "synced-catalog.json"), JSON.stringify(payload, null, 2), "utf-8");

console.log(`Imported ${products.length} products → src/data/synced-catalog.json`);
