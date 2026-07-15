/**
 * Seed script — populates departments, districts, and reference data.
 * Run: npm run seed
 * Requires MONGODB_URI in .env.local (auto-loaded)
 */

// Load env variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

const DEPARTMENTS = [
  { name: "Bangla", code: "BNG" },
  { name: "English", code: "ENG" },
  { name: "Mathematics", code: "MTH" },
  { name: "Physics", code: "PHY" },
  { name: "Chemistry", code: "CHM" },
  { name: "Botany", code: "BOT" },
  { name: "Zoology", code: "ZOO" },
  { name: "Geography and Environment", code: "GEO" },
  { name: "Economics", code: "ECO" },
  { name: "Political Science", code: "POL" },
  { name: "Sociology", code: "SOC" },
  { name: "Islamic Studies", code: "ISL" },
  { name: "History", code: "HIS" },
  { name: "Philosophy", code: "PHI" },
  { name: "Social Work", code: "SWK" },
  { name: "Accounting", code: "ACC" },
  { name: "Management", code: "MGT" },
  { name: "Finance and Banking", code: "FNB" },
  { name: "Marketing", code: "MKT" },
  { name: "Computer Science and Engineering", code: "CSE" },
  { name: "Electrical and Electronic Engineering", code: "EEE" },
  { name: "Civil Engineering", code: "CVE" },
];

const DISTRICTS = [
  "Khulna", "Bagerhat", "Satkhira", "Jessore", "Magura",
  "Jhenaidah", "Narail", "Chuadanga", "Meherpur", "Kushtia",
];

async function main() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db!;

  // Seed departments
  const deptCol = db.collection("departments");
  await deptCol.createIndex({ code: 1 }, { unique: true });
  for (const dept of DEPARTMENTS) {
    await deptCol.updateOne({ code: dept.code }, { $setOnInsert: dept }, { upsert: true });
  }
  console.log(`✅ Seeded ${DEPARTMENTS.length} departments`);

  // Seed districts
  const distCol = db.collection("districts");
  await distCol.createIndex({ name: 1 }, { unique: true });
  for (const name of DISTRICTS) {
    await distCol.updateOne({ name }, { $setOnInsert: { name, division: "Khulna" } }, { upsert: true });
  }
  console.log(`✅ Seeded ${DISTRICTS.length} Khulna districts`);

  await mongoose.disconnect();
  console.log("✅ Seeding complete! You can now start the app.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
