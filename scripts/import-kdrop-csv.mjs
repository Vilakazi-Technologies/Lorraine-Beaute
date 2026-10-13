import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const csvPath =
  process.argv[2] ||
  path.join(process.env.USERPROFILE || "", "Downloads", "listings_LT-261007-4816_25486e4f.csv");

const csv = readFileSync(csvPath, "utf-8");

const res = await fetch("http://localhost:3000/api/kdropshipping/import", {
  method: "POST",
  headers: {
    "Content-Type": "text/csv",
    "x-sync-key": process.env.K_DROPSHIPPING_SYNC_SECRET || "dev-import",
  },
  body: csv,
});

if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

const data = await res.json();
console.log("Imported:", data);

const catalogPath = path.join(root, "src", "data", "synced-catalog.json");
if (existsSync(catalogPath)) {
  console.log("Catalog written to", catalogPath);
}
