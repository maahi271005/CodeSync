import mongoose from "mongoose";
import { ENV } from "../env.js";
import Problem from "../models/Problem.js";
import { SEED_PROBLEMS } from "../data/seedProblems.js";

// Inserts any seed problems whose slug isn't in the database yet. Existing problems are left untouched.
async function seedProblems() {
  if (!ENV.DB_URL) throw new Error("DB_URL is not defined in environment variables");
  await mongoose.connect(ENV.DB_URL);

  const existing = new Set(
    (await Problem.find({ slug: { $in: SEED_PROBLEMS.map((p) => p.slug) } }).select("slug")).map((p) => p.slug)
  );
  const toInsert = SEED_PROBLEMS.filter((p) => !existing.has(p.slug));

  if (toInsert.length) await Problem.insertMany(toInsert);

  console.log(`Inserted ${toInsert.length} problem(s), skipped ${existing.size} already present.`);
  toInsert.forEach((p) => console.log(`  + [${p.difficulty}] ${p.title}`));
}

seedProblems()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
