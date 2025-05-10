import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { seedProblems } from "./seed";

export const db = drizzle(process.env.DATABASE_URL!);

// seedProblems().catch((err) => {
//   console.error("❌ Failed to seed problems:", err);
// });
