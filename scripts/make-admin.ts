/**
 * Promote an existing user to superadmin.
 * Usage: npm run make-admin -- user@email.com
 *
 * This script:
 *  1. Connects to your MongoDB
 *  2. Finds the user by email
 *  3. Sets role = "superadmin" and status = "approved"
 */

// Load env variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const email = process.argv[2];

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set in .env.local");
  process.exit(1);
}

if (!email) {
  console.error("❌ Usage: npm run make-admin -- <email>");
  console.error("   Example: npm run make-admin -- admin@khulna-neu.org");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("✅ Connected to MongoDB");

  const db = client.db();
  const userCol = db.collection("user"); // Better Auth uses 'user' collection

  const user = await userCol.findOne({ email: email.toLowerCase() });

  if (!user) {
    console.error(`❌ No user found with email: ${email}`);
    console.error("   Make sure you registered through the website first.");
    await client.close();
    process.exit(1);
  }

  await userCol.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        role: "superadmin",
        status: "approved",
        approvedAt: new Date(),
        approvedBy: "system-script",
      },
    }
  );

  console.log(`✅ Success! User "${user.name ?? email}" is now a superadmin.`);
  console.log(`   role: superadmin`);
  console.log(`   status: approved`);
  console.log("");
  console.log("   Next steps:");
  console.log("   1. Go to your app and sign in with this account");
  console.log("   2. You'll see the admin dashboard with full access");
  console.log("   3. Go to /admin/approvals to approve pending members");

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
