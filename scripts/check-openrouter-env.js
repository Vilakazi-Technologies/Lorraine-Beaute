const k = process.env.OPENROUTER_API_KEY || "";
const m = process.env.OPENROUTER_MODEL || "";
console.log(k.length > 10 ? "OPENROUTER_OK" : "OPENROUTER_MISSING");
console.log("MODEL=" + (m || "default"));
